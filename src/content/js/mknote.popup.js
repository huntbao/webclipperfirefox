//popup
;(function($){
    MKNoteWebclipper.Popup = {
        clipper: MKNoteWebclipper,
        init: function(){
            var self = this;
            self.popupInstance = content.currentMaikuWebclipperPopup.instance;
            self.iframe = window.frames[0];
            self.iframe.communicationProxy = {
                closeWin: function(){
                    content.currentMaikuWebclipperPopup = null;
                    self.popupInstance.remove();
                },
                createInspector: function(){
                    self._createInspector();
                }
            }
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
            var backgroundImageSrc = '',
            markInner = $('<div mkclip="true"></div>', body).css({
                background: '#ccffcc',
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: 0.35,
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
            markClose = $('<span mkclip="true"></span', body).css({
                background: 'url(' + backgroundImageSrc + ', body) -120px -44px no-repeat',
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
            self.markContainer = $('<div mkclip="true"></div>', body).appendTo(body).append(self.cover).append(self.mask);
            self.markedElements = {};//save all marked page element
            self.marks = {};//save all marks
            self.markCount = 0;
            self.body = body;
            self.doc = doc;
            doc.bind('mousemove.maikuclippermark', function(e){
                self.mouseMoveMarkHandler(e);
            }).bind('click.maikuclippermark', function(e){
                self.clickMarkHandler(e);
            }).bind('mouseleave.maikuclippermark', function(e){
                self.mask.hide();
            });
            if(autoExtractContent){
                //extract content
                var extract = self.extractContent(document);
                if(extract.isSuccess){
                    var extractedContent = extract.content.asNode();
                    if(extractedContent.nodeType == 3){
                        extractedContent = extractedContent.parentNode;
                    }
                    setTimeout(function(){
                        var title = document.title && document.title.split('-')[0];
                        self.addMark($(extractedContent), self.mark.clone(), title.trim());
                    },0);
                }
            } 
        },
        removeInspector: function(){
            var self = this;
            if(!self.markContainer) return;
            self.markContainer.remove();
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
                self.clipper.Util.log("cannot save iframe's content");
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
            self.markContainer.html('').append(self.cover).append(self.mask);
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
                if(!/^(img|a)$/.test(nodeTagName) && node[0].innerHTML == 0 && nodeCSSStyleDeclaration['background-image'] == 'none'){
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
                        float: cssStyleDeclaration.float,
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
                    styleObj['list-style'] = cssStyleDeclaration['list-style'];
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
                    if(/^(margin|float)$/.test(cssProperty)) continue;
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
            'background': 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box',
            'border': '0px none rgb(0, 0, 0)',
            'bottom': 'auto',
            'box-shadow': 'none',
            'clear': 'none',
            'color': 'rgb(0, 0, 0)',
            'cursor': 'auto',
            'display': '',//consider inline tag or block tag, this value must have
            'float': 'none',
            'font': '',//this value must have, since it affect the appearance very much and style inherit is very complex
            'height': 'auto',
            'left': 'auto',
            'letter-spacing': 'normal',
            'line-height': 'normal',
            'margin': '',
            'max-height': 'none',
            'max-width': 'none',
            'min-height': '0px',
            'min-width': '0px',
            'opacity': '1',
            'outline': 'rgb(0, 0, 0) none 0px',
            'overflow': 'visible',
            'padding': '',
            'position': 'static',
            'right': 'auto',
            'table-layout': 'auto',
            'text-align': 'start',
            'text-decoration': '',
            'text-indent': '0px',
            'text-shadow': 'none',
            'text-overflow': 'clip',
            'text-transform': 'none',
            'top': 'auto',
            'vertical-align': 'baseline',
            'visibility': 'visible',
            'white-space': 'normal',
            'width': 'auto',
            'word-break': 'normal',
            'word-spacing': '0px',
            'word-wrap': 'normal',
            'z-index': 'auto',
            'zoom': '1'
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
        sendContentToPopup: function(uid, content, add, title){
            //cannot send data directly to popup page, so connect to background page first
            if(add && !content) return;//add blank node, return;
            var port = chrome.extension.connect({name:'actionfrompopupinspecotr'});
		port.postMessage({
                uid: uid,
                content: content,
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