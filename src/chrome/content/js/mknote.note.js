//@huntbao @mknote
//All right reserved
;(function($){
    MKNoteWebclipper.Note = {
        clipper: MKNoteWebclipper,
        saveNote: function(title, sourceurl, notecontent, tags, categoryid, noteid, importance, successCallback, failCallback){
            var self = this;
            self.clipper.checkLogin(function(){
                self._saveNote(title, sourceurl, notecontent, tags, categoryid, noteid, importance, successCallback, failCallback);
            }, true);
        },
        _saveNote: function(title, sourceurl, notecontent, tags, categoryid, noteid, importance, successCallback, failCallback){
            var self = this;
            if(!title && !notecontent){
                self.notifyHTML('CannotSaveBlankNote');
                failCallback && failCallback();
                return;
            }
            var dataObj = {
                title: self.getTitleByText(title),
                sourceurl: sourceurl,
                notecontent: notecontent,
                tags: tags || '',
                categoryid: categoryid || '',
                noteid: noteid || '',
                importance: importance || 0
            }
            self.notifyHTML('IsSavingNote', false);
            $.ajax({
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                type:'POST',
                url: self.clipper.baseUrl + '/note/save',
                data: JSON.stringify(dataObj),
                success: function(data){
                    if(data.error){
                        if(data.error == 'notlogin'){
                            self.notifyHTML('NotLogin');
                        }else{
                            self.notifyHTML('SaveNoteFailed');
                        }
                        failCallback && failCallback();
                        return;
                    }
                    self.notifyHTML('SaveNoteSuccess');
                    successCallback && successCallback();
                    var successTip = self.getI18nMessage('SaveNoteSuccess'),
                    viewURL = self.clipper.baseUrl + '/note/previewfull/' + data.Note.NoteID,
                    viewTxt = self.getI18nMessage('ViewText');
                    self.notifyHTML(successTip + '<a href="' + viewURL + '" target="_blank" id="customclosebtn">' + viewTxt + '</a>', 10000, true);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    failCallback && failCallback();
                    self.notifyHTML('SaveNoteFailed');
                    self.clipper.Util.log(textStatus);
                    self.clipper.Util.log(errorThrown);
                }
            });
        },
        savePageContent: function(title, sourceurl, noteContent){
            var self = this;
            if(self.clipper.options.settings.serializeImg){
                var noteContentCon = $('<div></div>', content.document).append(noteContent),
                imgs = noteContentCon.find('img'),
                needReplaceImgs = [],
                filteredImg = {},
                filteredImgTitles = [],
                isToSave = function(url){
                    var suffix = url.substr(url.length - 4);
                    return /^\.(gif|jpg|png)$/.test(suffix);
                }
                for(let i = 0, img, l = imgs.length, src; i < l; i++){
                    img = imgs[i];
                    src = img.src;
                    if(!isToSave(src)) continue;
                    if(filteredImg[src]) continue;
                    filteredImg[src] = 1;
                    filteredImgTitles.push(img.title || img.alt || '');
                    needReplaceImgs.push(img);
                }
                self.saveImgs({
                   imgs: needReplaceImgs,
                   imgTitles: filteredImgTitles,
                   title: title,
                   sourceurl: sourceurl
                }, function(uploadedImageData, serializeSucceedImgIndexByOrder, noteId){
                    let realIndex, d;
                    for(let i = 0, l = needReplaceImgs.length; i < l; i++){
                        realIndex = serializeSucceedImgIndexByOrder[i];
                        if(realIndex){
                            d = uploadedImageData[realIndex];
                            needReplaceImgs[i].src = d.Url;
                            delete serializeSucceedImgIndexByOrder[i];
                        }
                    }
                    self.saveNote(title, sourceurl, noteContentCon.html(), '', '', noteId);
                }, function(){
                    //all images upload failed or serialize failed, just save the page
                    self.saveNote(title, sourceurl, noteContent);
                });
            }else{
                self.saveNote(title, sourceurl, noteContent);
            }
        },
        saveNoteFromPopup: function(title, sourceurl, noteContent, tags, categoryid, successCallback, failCallback){
            var self = this,
            normalSave = function(){
                self.saveNote(title, sourceurl, noteContent, tags, categoryid, '', '', function(){
                    successCallback && successCallback();
                }, function(){
                    failCallback && failCallback();
                });
            }
            if(self.clipper.options.settings.serializeImg){
                var noteContentCon = $('<div></div>', content.document).append(noteContent),
                imgs = noteContentCon.find('img'),
                needReplaceImgs = [],
                filteredImg = {},
                filteredImgTitles = [],
                isToSave = function(url){
                    var suffix = url.substr(url.length - 4);
                    return /^\.(gif|jpg|png)$/.test(suffix);
                }
                if(imgs.length > 0){
                    for(var i = 0, img, l = imgs.length, src; i < l; i++){
                        img = imgs[i];
                        src = img.src;
                        if(!isToSave(src)) continue;
                        if(filteredImg[src]) continue;
                        filteredImg[src] = 1;
                        filteredImgTitles.push(img.title || img.alt || '');
                        needReplaceImgs.push(img);
                    }
                    self.saveImgs({
                       imgs: imgs,
                       imgTitles: filteredImgTitles,
                       title: title,
                       sourceurl: sourceurl,
                       categoryId: categoryid
                    }, function(uploadedImageData, serializeSucceedImgIndexByOrder, noteId){
                        var realIndex, d;
                        for(var i = 0, l = needReplaceImgs.length; i < l; i++){
                            realIndex = serializeSucceedImgIndexByOrder[i];
                            if(realIndex){
                                d = uploadedImageData[realIndex];
                                needReplaceImgs[i].src = d.Url;
                                delete serializeSucceedImgIndexByOrder[i];
                            }
                        }
                        self.saveNote(title, sourceurl, noteContentCon.html(), tags, categoryid, noteId, '', function(){
                            successCallback && successCallback();
                        }, function(){
                            failCallback && failCallback();
                        });
                    }, function(){
                        //all images upload failed or serialize failed, just save the clipped content
                        normalSave();
                    });
                }else{
                    normalSave();
                }
            }else{
                normalSave();
            }
        },
        saveImgs: function(msg, successCallback, failCallback){
            var self = this;
            self.clipper.checkLogin(function(){
                self._saveImgs(msg, successCallback, failCallback);
            });
        },
        _saveImgs: function(msg, successCallback, failCallback){
            var self = this,
            noteContent = '',
            imgs = msg.imgs,
            totalImgNum = imgs.length,
            titles = [],
            saveNormalNote = function(){
                for(let i = 0; i < totalImgNum; i++){
                    noteContent += '<img src="' + imgs[i].src + '" title="' + titles[i] + '" alt="' + titles[i] + '"><br />';
                }
                self.saveNote(msg.title, msg.sourceurl, noteContent, msg.tags);
            }
            for(let i = 0; i < totalImgNum; i++){
                titles.push(self.getFileNameByUrl(imgs[i].src));
            }
            if(self.clipper.options.settings.serializeImg){
                //retrieve remote images
                self.notifyHTML('isRetrievingRemoteImgTip', false);
                var serializeSucceedImgNum = 0,
                serializeSucceedImgIndex = [],
                serializeSucceedImgIndexByOrder = {},
                files = {},
                checkComplete = function(){
                    if(serializeSucceedImgNum == totalImgNum){
                        for(var i = 0, l = serializeSucceedImgIndex.length; i < l; i++){
                            serializeSucceedImgIndexByOrder[serializeSucceedImgIndex[i]] = i.toString();
                        }
                        self.notifyHTML('IsUploadingImagesTip', false);
                        $.ajax({
                            url: self.clipper.baseUrl + "/attachment/savemany/",
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function(data){
                                if(data.error){
                                    //todo: server error, pending note...
                                    self.clipper.Util.log('Internal error: ');
                                    self.clipper.Util.log(data.error);
                                    if(failCallback){
                                        failCallback(true);
                                    }
                                    return;
                                }
                                if(successCallback){
                                    //is replace images in page content
                                    successCallback(data, serializeSucceedImgIndexByOrder, data[0].NoteID);
                                }else{
                                    var d, 
                                    noteId = data[0].NoteID,
                                    realIndex;
                                    for(var i = 0, l = totalImgNum; i < l; i++){
                                        realIndex = serializeSucceedImgIndexByOrder[i];
                                        if(realIndex){
                                            d = data[realIndex];
                                            noteContent += '<img src="' + d.Url + '" title="' + titles[i] + '" alt="' + titles[i] + '"><br />';
                                            delete serializeSucceedImgIndexByOrder[i];
                                        }else{
                                            noteContent += '<img src="' + imgs[i].src + '" title="' + titles[i] + '" alt="' + titles[i] + '"><br />';
                                        }
                                    }
                                    self.saveNote(msg.title, msg.sourceurl, noteContent, msg.tags, '', noteId);
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown){
                                self.clipper.Util.log('xhr error: ')
                                self.clipper.Util.log(textStatus)
                                self.notifyHTML('UploadImagesFailed');
                            }
                        });
                    }
                    return null;
                },
                formData = new FormData();
                formData.append('type', self.clipper.options.settings.imageAttachment ? 'Attachment' : 'Embedded');
                formData.append('categoryId', msg.categoryId || '');
                formData.append('id', msg.id || '');
                for(var i = 0, l = totalImgNum; i < l; i++){
                    self.getImageFile(imgs[i], titles[i], i, function(file, idx){
                        serializeSucceedImgNum++;
                        serializeSucceedImgIndex.push(idx);
                        formData.append('file' + idx, file);
			files[idx] = file;
                        checkComplete();
                    });
                }
            }else{
                saveNormalNote();
            }
        },
        getImageFile: function(image, fileName, index, successCallback){
            var self = this,
            canvas = content.document.createElement('canvas'),
            ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            if(fileName.indexOf('.') == -1){
                fileName += '.png';//default png format
            }
            var ext = fileName.split('.')[1];
            ctx.drawImage(image, 0, 0);
            var file = canvas.mozGetAsFile(fileName, 'image/' + ext);
            successCallback(file, index);
        },
        notifyHTML: function(message, lastTime, purgeText){
            var self = this;
            message = purgeText ? message : self.getI18nMessage(message);
            self.clipper.Notification.show(message, lastTime);
        },
        getI18nMessage: function(i18nString){
            return this.clipper.i18n.getMessage(i18nString);
        },
        getFileNameByUrl: function(url){
            var self = this,
            parts = url.split('/');
            return parts[parts.length -1];
        },
        getTitleByText: function(txt){
            var self = this,
            finalTitle = '';
            if(txt.length <= 100) return txt;
            if(txt.length > 0){
                var t = txt.substr(0, 100), l = t.length, i = l - 1, hasSpecialChar = false;
                //9 : HT 
                //10 : LF 
                //44 : ,
                //65292 : ，
                //46 :　．
                //12290 : 。
                //59 : ;
                //65307 : ；
                while(i >= 0){
                    if(/^(9|10|44|65292|46|12290|59|65307)$/.test(t.charCodeAt(i))){
                        hasSpecialChar = true;
                        break;
                    }else{
                        i--;
                    }
                }
                hasSpecialChar ? (t = t.substr(0, i)) : '';
                i = 0;
                l = t.length;
                while(i < l){
                    if(/^(9|10)$/.test(t.charCodeAt(i))){
                        break;
                    }else{
                        finalTitle += t.charAt(i);
                        i++;
                    }
                }
            }
            finalTitle = finalTitle.trim();
            return finalTitle.length > 0 ? finalTitle : ('[' + self.clipper.i18n.getMessage('DefaultTitle') + ']');
        },
    }
})(MKNoteWebclipper.jQuery);