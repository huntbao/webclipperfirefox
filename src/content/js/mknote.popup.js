//@huntbao @mknote
//All right reserved
;(function($){
    MKNoteWebclipper.Popup = {
        init: function(){
            var self = this,
            popupInstance = content.currentMaikuWebclipperPopup.instance,
	    initDivHeight = parseInt(popupInstance.css('height')),
	    judgeHeight = function(h){
                if(h < 304) return 304;
                if(h > 624) return 624;
                return h;
            },
	    deskTopPopup = $('#deskpop-popup');
            content.maikuWebclipperPopupIframe = window.frames[0];
	    //these methods below will be called from popup
            content.maikuWebclipperPopupIframe.communicationProxy = {
		clipper: content.currentMaikuWebclipperPopup.clipper,
                closeWin: function(){
		    this.clipper.deletePopup(content.currentMaikuWebclipperPopup);
		    $(content.document).unbind('keydown.maikuclipperpopup');
                    popupInstance.remove();
		    self.removeInspector();
                },
                createInspector: function(autoExtractContent){
                    self._createInspector(autoExtractContent);
                },
		showWin: function(){
		    popupInstance.show();
		},
		reset: function(){
		    self.clearMarks();
		},
		getUser: function(callback){
		    this.clipper.getUser(callback);
		},
		changeIframeHeight: function(changeStep){
		    if(changeStep == false){
			//stop change height, mouseup on resizer
			initDivHeight = parseInt(popupInstance.css('height'));
		    }else{
			popupInstance.css('height', judgeHeight(initDivHeight + changeStep));
			deskTopPopup.css('height', judgeHeight(initDivHeight + changeStep));
		    }
		},
		positionTop: function(){
		    popupInstance.css({
			top: 8,
			bottom: 'auto'
		    });
		},
		positionBottom: function(){
		    popupInstance.css({
			top: 'auto',
			bottom: 8
		    });
		},
		localize: function(el){
		    this.clipper.i18n.localizeElement(el);
		},
		saveNote: function(noteData){
		    popupInstance.hide();
		    self.removeInspector();
		    let t = this;
		    t.clipper.Note.saveNote(
			noteData.title,
			content.location.href,
			noteData.notecontent,
			noteData.tags,
			noteData.categoryid,
			'',
			'',
			function(){
			    //save note success, remove staffs
			    t.clipper.deletePopup(content.currentMaikuWebclipperPopup);
			    $(content.document).unbind('keydown.maikuclipperpopup');
			    popupInstance.remove();
			},
			function(){
			    //save note failed, show popup again
			    popupInstance.show(); 
			}
		    );
		},
		addNode: function(){
		    //override by iframe
		},
		updateUserInfo: function(){
		    //override by iframe
		},
		hideMask: function(){
		    self.mask && self.mask.hide();
		}
            }
	    self.initEvents();
        },
	initEvents: function(){
	    var self = this;
	    $(content.document).bind('keydown.maikuclipperpopup', function(e){
		if(e.keyCode == 27){
		    content.maikuWebclipperPopupIframe.communicationProxy.closeWin();
		}
	    });
	},
        _createInspector: function(autoExtractContent){
            var self = this,
            popupZIndex = 20120830,
            doc = $(content.document),
            body = $(doc[0].body);
	    self.cover = $('<div mkclip="true"></div>', body).css({
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
                'z-index': popupZIndex - 1
            });
            self.mask = $('<div mkclip="true"></div>', body).css({
                'border-radius': 5,
                border: '3px solid #a2cca2',
                position: 'absolute',
                top: -9999,
                left: -9999,
                width: 0,
                height: 0,
                'z-index': popupZIndex - 1,
                background: 'transparent'
            });
            var backgroundImageSrc = 'resource://mknotewebclipperimages/sprite.png',
            markInner = $('<div mkclip="true"></div>', body).css({
                background: 'rgba(204, 255, 204, 0.5)',
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%'
            }),
            markExpandor = $('<div mkclip="true"></div>', body).css({
                background: 'url(' + backgroundImageSrc + ') -120px -66px no-repeat',
                height: 20,
                width: 20,
                cursor: 'pointer',
                position: 'absolute',
                top: 1,
                left: 1,
                'z-index': popupZIndex - 1
            }).attr('title', 'MarkExpandorTip'),
            markClose = $('<div mkclip="true"></div>', body).css({
                background: 'url(' + backgroundImageSrc + ') -120px -44px no-repeat',
                height: 20,
                width: 20,
                cursor: 'pointer',
                position: 'absolute',
                top: 1,
                left: 23,
                'z-index': popupZIndex - 1
            }).attr('title', 'CancelTip');
            self.mark = $('<div mkclip="true"></div>', body).css({
                'border-radius': 5,
                border: '3px solid #a2cca2',
                position: 'absolute',
                top: -9999,
                left: -9999,
                'z-index': popupZIndex - 1,
                background: 'transparent'
            }).append(markInner).append(markExpandor).append(markClose);
	    body.append(self.cover).append(self.mask);
            self.markContainer = $('<div mkclip="true"></div>', body).appendTo(body);
            self.markedElements = {};//save all marked page element
            self.marks = {};//save all marks
            self.markCount = 0;
            self.body = body;
            body.bind('mousemove.maikuclippermark', function(e){
                self.mouseMoveMarkHandler(e);
            }).bind('click.maikuclippermark', function(e){
                self.clickMarkHandler(e);
            }).bind('mouseleave.maikuclippermark', function(e){
                self.mask.hide();
            });
            if(autoExtractContent){
                //extract content
                var extract = self.extractContent(doc[0]);
                if(extract.isSuccess){
                    var extractedContent = extract.content.asNode();
                    if(extractedContent.nodeType == 3){
                        extractedContent = extractedContent.parentNode;
                    }
                    setTimeout(function(){
                        var title = doc[0].title && doc[0].title.split('-')[0];
                        self.addMark($(extractedContent), self.mark.clone(), title.trim());
                    },0);
                }
            } 
        },
        removeInspector: function(){
            var self = this;
            if(!self.markContainer) return;
            self.markContainer.remove();
	    self.mask.remove();
	    self.cover.remove();
            self.markedElements = {};
            self.marks = {};
            self.markCount = 0;
            self.body.unbind('mousemove.maikuclippermark').unbind('click.maikuclippermark');
        },
        mouseMoveMarkHandler: function(e){
            var self = this;
            self.cover.show();
            self.mask.show();
            var target = self.elementFromPoint(e),
            isMark = target.attr('mkclip'),
            isIgnore = false;
            if(target.is('body, html') || isMark){
                isIgnore = true;
            }
            //mouse in mark or remove-mark
            //hide cover so that remove-mark could be clicked
            if(!isMark && !isIgnore){
                self.attachBox(target, self.mask);
            }else{
                self.cover.hide();
                self.mask.hide();
            }
        },
        clickMarkHandler: function(e){
            var self = this,
            target = self.elementFromPoint(e),
            isIgnore = false;
            if(target.is('iframe, frame')){
                return false;
            }
            if(target.is('body, html')){
                isIgnore = true;
            }
            self.removeMarkInElement(target);
            if(!isIgnore){
                self.addMark(target, self.mark.clone());
                return false;
            }
            e.stopPropagation();
            return '';
        },
        addMark: function(target, mark, title){
            var self = this,
            uid = 'mkmark_' + self.markCount;
            self.markContainer.append(mark);
            self.attachBox(target, mark);
            self.markCount++;
            //var date = new Date();
            var html = self.getHTMLByNode(target);
            //console.log(new Date() - date)
            self.sendContentToPopup(uid, html, true, title);
            self.markedElements[uid] = target;
            self.marks[uid] = mark;
            mark.data('uid', uid).click(function(e){
                self.delMark(mark);
                return false;
            });
            $(mark.children()[1]).click(function(e){
                self.parentMark(mark);
                return false;
            });
        },
        delMark: function(mark){
            var self = this,
            uid = mark.data('uid');
            self.sendContentToPopup(uid);
            mark.remove();
            delete self.markedElements[uid];
        },
        clearMarks: function(){
            var self = this;
            self.markContainer.html('');
            self.markedElements = {};
            self.marks = {};
            self.markCount = 0;
        },
        parentMark: function(mark){
            var self = this,
            uid = mark.data('uid'),
            parent = self.markedElements[uid].parent();
            if(parent.is('html')) return;
            self.removeMarkInElement(parent);
            self.addMark(parent, self.mark.clone());
        },
        removeMarkInElement: function(el){
            var self = this,
            markedPageElementInParent = {};
            for(var uid in self.markedElements){
                if(el.find(self.markedElements[uid]).length > 0){
                    markedPageElementInParent[uid] = true;
                }
            }
            for(var uid in self.marks){
                if(markedPageElementInParent[uid]){
                    self.delMark(self.marks[uid]);
                }
            }
        },
        elementFromPoint: function(e){
            var self = this;
            self.cover.hide();
            self.mask.hide();
            var pos = {
                top: e.pageY - $(content.window).scrollTop(),
                left: e.pageX
            },
            target = $(content.document.elementFromPoint(pos.left, pos.top));
            self.cover.show();
            self.mask.show();
            return target;
        },
        attachBox: function(target, el){
            var self = this,
            body = self.body,
            size = {
                height: target.outerHeight(),
                width: target.outerWidth()
            },
            pos = {
                left: target.offset().left,
                top: target.offset().top
            }
            //box on the page edge
            //ajust the pos and size order to show the whole box
            var bodyOuterWidth = body.outerWidth();
            if(pos.left == 0){
                if(size.width >= bodyOuterWidth){
                    size.width = bodyOuterWidth - 6;
                }
            }else if(pos.left + size.width >= bodyOuterWidth){
                size.width = bodyOuterWidth - pos.left - 6;
            }else{
                pos.left -= 3;
            }
            if(pos.top == 0){
                size.height -= 3;
            }else{
                pos.top -= 3;
            }
            el.css({
                left: pos.left,
                top: pos.top,
                height: size.height,
                width: size.width
            });
        },
        getHTMLByNode: function(node){
            var self = this,
            filterTagsObj = self.filterTagsObj,
            nodeTagName = node[0].tagName.toLowerCase();
            if(filterTagsObj[nodeTagName]){
                return '';
            }
            var allEles = node[0].querySelectorAll('*'),
            allElesLength = allEles.length,
            nodeCSSStyleDeclaration = getComputedStyle(node[0]);
            if(allElesLength == 0){
                //no child
                if(!/^(img|a)$/.test(nodeTagName) && node[0].innerHTML == 0 && nodeCSSStyleDeclaration['backgroundImage'] == 'none'){
                    return '';
                }
            }
            var cloneNode = node.clone(),
            allElesCloned = cloneNode[0].querySelectorAll('*'),
            el,
            cloneEl,
            color,
            cssStyleDeclaration,
            styleObj = {},
            cssValue,
            saveStyles = self.saveStyles;
            for(var j = allElesLength - 1, tagName; j >= 0; j--){
                cloneEl = allElesCloned[j];
                tagName = cloneEl.tagName.toLowerCase();
                if(filterTagsObj[tagName] || cloneEl.getAttribute('mkclip')){
                    $(cloneEl).remove();
                    continue;
                }
                if(tagName == 'br'){
                    continue;
                }
                el = allEles[j];
                cssStyleDeclaration = getComputedStyle(el);
                cloneEl = $(cloneEl);
                color = cssStyleDeclaration.color;
                styleObj = {};
                if(tagName == 'img'){
                    cloneEl[0].src = cloneEl[0].src;
                    cloneEl.css({
                        width: cssStyleDeclaration.width,
                        height: cssStyleDeclaration.height,
                        float: cssStyleDeclaration.cssFloat,
                        background: cssStyleDeclaration.background,
                    });
                    continue;
                }
                for(var cssProperty in saveStyles){
                    cssValue = cssStyleDeclaration[cssProperty];
                    if(cssValue == saveStyles[cssProperty]) continue;
                    if(cssProperty == 'color'){
                        styleObj[cssProperty] = (color == 'rgb(255,255,255)' ? '#000' : color);
                        continue;
                    }
                    styleObj[cssProperty] = cssValue;
                }
                if(tagName == 'a'){
                    cloneEl.attr('href', el.href);
                }else if(/^(ul|ol|li)$/.test(tagName)){
                    styleObj['listStyleImage'] = cssStyleDeclaration['listStyleImage'];
                    styleObj['listStylePosition'] = cssStyleDeclaration['listStylePosition'];
                    styleObj['listStyleType'] = cssStyleDeclaration['listStyleType'];
                }
                cloneEl.css(styleObj);
                self.removeAttrs(cloneEl);
            }
            if(nodeTagName == 'body'){
                return cloneNode[0].innerHTML;
            }else{
                color = nodeCSSStyleDeclaration.color;
                styleObj = {};
                for(var cssProperty in saveStyles){
                    cssValue = nodeCSSStyleDeclaration[cssProperty];
                    if(cssValue == saveStyles[cssProperty]) continue;
                    if(/^(margin|cssFloat)$/.test(cssProperty)) continue;
                    if(cssProperty == 'color'){
                        styleObj[cssProperty] = (color == 'rgb(255,255,255)' ? '#000' : color);
                        continue;
                    }
                    styleObj[cssProperty] = cssValue;
                }
                cloneNode.css(styleObj);
                self.removeAttrs(cloneNode);
                return cloneNode[0].outerHTML;
            }
        },
        filterTagsObj: {style:1,script:1,link:1,iframe:1,frame:1,frameset:1,noscript:1,head:1,html:1,applet:1,base:1,basefont:1,bgsound:1,blink:1,ilayer:1,layer:1,meta:1,object:1,embed:1,input:1,textarea:1,button:1,select:1,canvas:1,map:1},
        saveStyles:{
	    'backgroundAttachment': 'scroll',
	    'backgroundColor': 'transparent',
	    'backgroundImage': 'none',
	    'backgroundPosition': '0% 0%',
	    'backgroundRepeat': 'repeat',
	    'borderCollapse': 'separate',
	    'borderColor': '',
	    'borderSpacing': '0px 0px',
	    'borderStyle': '',
	    'borderTop': '',
	    'borderRight': '',
	    'borderBottom': '',
	    'borderLeft': '',
	    'borderTopColor': 'rgb(0, 0, 0)',
	    'borderRightColor': 'rgb(0, 0, 0)',
	    'borderBottomColor': 'rgb(0, 0, 0)',
	    'borderLeftColor': 'rgb(0, 0, 0)',
	    'borderTopStyle': 'none',
	    'borderRightStyle': 'none',
	    'borderBottomStyle': 'none',
	    'borderLeftStyle': 'none',
	    'borderTopWidth': '0px',
	    'borderRightWidth': '0px',
	    'borderBottomWidth': '0px',
	    'borderLeftWidth': '0px',
	    'borderWidth': '',
	    'borderRadius': '',
	    'borderTopLeftRadius': '0px',
	    'borderTopRightRadius': '0px',
	    'borderBottomLeftRadius': '0px',
	    'borderBottomRightRadius': '0px',
	    'bottom': 'auto',
	    'clear': 'none',
	    'color': 'rgb(0, 0, 0)',
	    'cursor': 'auto',
	    'display': '',
	    'cssFloat': '',
	    'fontFamily': '',
	    'fontSize': '',
	    'fontStyle': '',
	    'fontWeight': '400',
	    'height': '',
	    'left': 'auto',
	    'letterSpacing': 'normal',
	    'lineHeight': '20px',
	    'marginTop': '0px',
	    'marginRight': '0px',
	    'marginBottom': '0px',
	    'marginLeft': '0px',
	    'maxHeight': 'none',
	    'maxWidth': 'none',
	    'minHeight': '0px',
	    'minWidth': '0px',
	    'overflow': 'visible',
	    'paddingTop': '0px',
	    'paddingRight': '0px',
	    'paddingBottom': '0px',
	    'paddingLeft': '0px',
	    'position': 'static',
	    'right': 'auto',
	    'tableLayout': 'auto',
	    'textAlign': 'start',
	    'textDecoration': 'none',
	    'textIndent': '0px',
	    'top': 'auto',
	    'verticalAlign': 'baseline',
	    'visibility': 'visible',
	    'whiteSpace': 'normal',
	    'width': '',
	    'wordSpacing': '0px',
	    'zIndex': 'auto',
	    'backgroundClip': 'border-box',
	    'backgroundOrigin': 'padding-box',
	    'opacity': '1',
	    'overflowX': 'visible',
	    'overflowY': 'visible',
	    'wordWrap': 'normal'
        },
        removeAttrs: function(node){
            var removeAttrs = ['id', 'class', 'height', 'width'];
            for(var i = 0, l = removeAttrs.length; i < l; i++){
                node.removeAttr(removeAttrs[i]);
            }
            return node;
        },
        extractContent: function(doc){
            var ex = new ExtractContentJS.LayeredExtractor();
            ex.addHandler(ex.factory.getHandler('Heuristics'));
            var res = ex.extract(doc);
            return res;
        },
        sendContentToPopup: function(uid, noteContent, add, title){
	    var self = this;
            if(add && !noteContent) return;//add blank node, return;
	    content.maikuWebclipperPopupIframe.communicationProxy.addNode({
		uid: uid,
                noteContent: noteContent,
                add: add,
                title: title
	    });
        },
        saveNote: function(notedata){
            var port = chrome.extension.connect({name:'savenotefrompopup'});
            notedata.sourceurl = location.href;
            port.postMessage(notedata);
        }
    }
})(MKNoteWebclipper.jQuery);