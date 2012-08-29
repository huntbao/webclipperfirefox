//Note
;(function($){
    MKNoteWebclipper.Note = {
        clipper: MKNoteWebclipper,
        saveNote: function(title, sourceurl, notecontent, tags, categoryid, noteid, importance, successCallback, failCallback){
            var self = this;
            self.clipper.checkLogin(function(){
                self._saveNote(title, sourceurl, notecontent, tags, categoryid, noteid, importance, successCallback, failCallback);
            });
        },
        _saveNote: function(title, sourceurl, notecontent, tags, categoryid, noteid, importance, successCallback, failCallback){
            var self = this;
            if(!title && !notecontent){
                self.notifyHTML('CannotSaveBlankNote');
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
                    self.clipper.Util.log(data);
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
        downloadImage: function(url, imgIndex, successCallback, errorCallback){
            var self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e){
                if (this.status == 200){                 
                    var suffix = url.split('.'),
                    blob = new Blob([this.response], {type: 'image/' + suffix[suffix.length - 1]}),
                    parts = url.split('/'),
                    fileName = parts[parts.length - 1];
                    self.sendFileToServer(blob);
                    return;
                    window.requestFileSystem(TEMPORARY, this.response.byteLength, function(fs){
                        self.writeBlobAndSendFile(fs, blob, fileName, successCallback, errorCallback, imgIndex);
                    }, self.onFileError);
                }
            }
            xhr.onerror = function(){
                self.clipper.Util.log('retrieve remote image xhr onerror');
                errorCallback && errorCallback(imgIndex);
            }
            xhr.onabort = function(){
                self.clipper.Util.log('retrieve remote image xhr onabort');
                errorCallback && errorCallback(imgIndex);
            }
            xhr.send(null);
        },
        getImageFromURL: function(url){
            var self = this;
            var ioserv = Components.classes["@mozilla.org/network/io-service;1"]
                         .getService(Components.interfaces.nsIIOService); 
            var channel = ioserv.newChannel(url, 0, null); 
            var stream = channel.open();
            if(channel instanceof Components.interfaces.nsIHttpChannel && channel.responseStatus != 200){
              return '';
            }
            var bstream = Components.classes['@mozilla.org/binaryinputstream;1'] 
                          .createInstance(Components.interfaces.nsIBinaryInputStream); 
            bstream.setInputStream(stream); 
            var size = 0; 
            var fileData = ''; 
            while(bstream.available()){
                fileData += bstream.readBytes(bstream.available());
            }
            self.clipper.Util.log(size);
            self.clipper.Util.log(url);
            //self.sendFileToServer(fileData);
            return fileData;
            /*var file = Components.classes["@mozilla.org/file/local;1"]
                        .createInstance(Components.interfaces.nsILocalFile);
            file.initWithPath("C:\\filename.gif");
            var wbp = Components.classes['@mozilla.org/embedding/browser/nsWebBrowserPersist;1']
                      .createInstance(Components.interfaces.nsIWebBrowserPersist);
            var ios = Components.classes['@mozilla.org/network/io-service;1']
                      .getService(Components.interfaces.nsIIOService);
            var uri = ios.newURI(url, null, null);
            wbp.persistFlags &= ~Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_NO_CONVERSION; // don't save gzipped
            wbp.saveURI(uri, null, null, null, null, file);*/
        },
        sendFileToServer: function(file, successCallback, failCallback){
            var self = this,
            formData = new FormData();
            formData.append('type', 'Attachment');
            formData.append('categoryId', '');
            formData.append('id', '');
            var filename = 'hi';
            formData.append("file\"; FileName=\"" + filename + "\"", file);
            $.ajax({
                url: self.clipper.baseUrl + "/attachment/savemany/",
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    if(data.error){
                        //todo: server error, pending note...
                        self.clipper.Util.log('Internal error');
                        self.clipper.Util.log(data.error);
                        if(failCallback){
                            failCallback(true);
                        }
                        return;
                    }
                    self.clipper.Util.log(data)
                },
                error: function(jqXHR, textStatus, errorThrown){
                    self.clipper.Util.log('xhr error: ')
                    self.clipper.Util.log(textStatus)
                    self.notifyHTML('UploadImagesFailed');
                }
            });    
        },
        writeBlobAndSendFile: function(fs, blob, fileName, successCallback, errorCallback, imgIndex){
            var self = this;
            fs.root.getFile(fileName, {create: true}, function(fileEntry){
                fileEntry.createWriter(function(fileWriter){
                    fileWriter.onwrite = function(e){
                        self.clipper.Util.log('Write completed.');
                        fileEntry.file(function(file){
                            successCallback(file, imgIndex);
                        });
                    };
                    fileWriter.onerror = function(e){
                        self.clipper.Util.log('Write failed: ' + e.toString());
                    };
                    fileWriter.write(blob);
                }, self.onFileError);
            }, self.onFileError);
        },
        onFileError: function(err){
            for(var p in FileError){
                if(FileError[p] == err.code){
                    self.clipper.Util.log('Error code: ' + err.code + 'Error info: ' + p);
                    break;
                }
            }
        },
        notifyHTML: function(message, lastTime, purgeText){
            var self = this;
            message = purgeText ? message : self.getI18nMessage(message);
            self.clipper.Notification.show(message, lastTime);
        },
        getI18nMessage: function(i18nString){
            return this.clipper.i18n.getMessage('mknotewebclipper.' + i18nString);
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