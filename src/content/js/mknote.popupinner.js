//@huntbao @mknote
//All right reserved
(function($){
    var maikuNotePopup = {
        init: function(){
            var self = this;
	    communicationProxy.localize(document.body);
	    communicationProxy.showWin();
	    self.addEvents();
	    self.initAddNode();
	    self.initCategories();
	    self.initTags();
	    communicationProxy.getUser(function(data){
		if(data.user){
		    self.userloginedHandler(data.user, data.settings);
		}else{
		    self.userlogoutedHandler();
		}
		communicationProxy.createInspector(data.settings.autoExtractContent);
		if(data.settings.autoExtractContent == false){
		    self.autoExtractContent.removeClass('mkbm-enable').addClass('mkbm-disabled').attr('title', communicationProxy.clipper.i18n.getMessage('AutoExtractContentDisabled'));
		}
	    });
	    communicationProxy.updateUserInfo = function(data){
		if(data && data.user){
		    self.userloginedHandler(data.user, data.settings);
		}else{
		    self.userlogoutedHandler();
		}
	    }
        },
        addEvents: function(){
            var self = this;
            self.title = $('#titleinp');
            var mouseDowned,
            startPageY,
            noteContent = $('#notecontent'),
            body = $('body'),
            initTaHeight = parseInt(noteContent.css('height')),
            changeStep;
            $(document).mousemove(function(e){
		if(mouseDowned){
		    changeStep = e.pageY - startPageY;
		    noteContent.css('height', initTaHeight + changeStep);
		    communicationProxy.changeIframeHeight(changeStep);
		}
            }).bind('mouseup', function(e){
                mouseDowned = false;
                body.removeClass('not-selectable');
                noteContent.removeClass('not-selectable');
                initTaHeight = parseInt(noteContent.css('height'));
		communicationProxy.changeIframeHeight(false);
            }).mouseenter(function(){
                communicationProxy.hideMask();
            });
            $('#resizer').mousedown(function(e){
                mouseDowned = true;
                body.addClass('not-selectable');
                noteContent.addClass('not-selectable');
                startPageY = e.pageY;
            });
            $('#closebtn').click(function(e){
		communicationProxy.closeWin();
                return false;
            });
	    $('#resetbtn').click(function(e){
		noteContent.html('').focus();
		self.title.val('');
		communicationProxy.reset();
	    });
	    self.saveNote = function(){
		noteContent.find('div[mkclip=true]').removeAttr('id').removeAttr('mkclip');
		communicationProxy.saveNote({
		    notecontent: noteContent.html(),
		    categoryid: self.displayName.data('cateid'),
		    tags: self.tagHandlerEl.tagHandler('getTags').join(','),
		    title: self.title.val() || noteContent.text().trim()
		});
	    }
            $('#savebtn').click(function(e){
                self.saveNote();
            });
            var mkbmUtils = $('#mkbm-utils');
            self.autoExtractContent = mkbmUtils.find('.mkbm-auto-extract .mkbm-util-icon');
            mkbmUtils.delegate('.mkbm-util-item', 'click', function(e){
                var t = $(this);
                if(t.is('.mkbm-auto-extract')){
		    if(self.autoExtractContent.is('.mkbm-enable')){
                        self.autoExtractContent.removeClass('mkbm-enable').addClass('mkbm-disabled').attr('title', communicationProxy.clipper.i18n.getMessage('AutoExtractContentDisabled'));
                        parent.postMessage({name: 'disablemouseselectfrommaikupopup'}, '*');
                        chrome.extension.sendRequest({name: 'setautoextract', value: false});
                    }else{
                        self.autoExtractContent.removeClass('mkbm-disabled').addClass('mkbm-enable').attr('title', communicationProxy.clipper.i18n.getMessage('AutoExtractContentEnabled'));
                        parent.postMessage({name: 'enablemouseselectfrommaikupopup'}, '*');
                        chrome.extension.sendRequest({name: 'setautoextract', value: true});
                    }
                }else if(t.is('.mkbm-panel-position')){
                    if(t.data('panel-position') == 'bottom'){
			communicationProxy.positionTop();
                        t.data('panel-position', 'top').find('.mkbm-util-icon').removeClass('mkbm-down').attr('title', communicationProxy.clipper.i18n.getMessage('GoBottom'));
                    }else{
			communicationProxy.positionBottom();
                        t.data('panel-position', 'bottom').find('.mkbm-util-icon').addClass('mkbm-down').attr('title', communicationProxy.clipper.i18n.getMessage('GoTop'));
                    }
                }
            });
            self.noteContent = noteContent;
        },
        addNode: function(node){
            var self = this;
            self.noteContent.append(node).scrollTop(self.noteContent.prop('scrollHeight'));
        },
        userloginedHandler: function(userData, settings){
            var self = this;
            $('#username').html(userData.user.NickName)
            .attr('title', communicationProxy.clipper.i18n.getMessage('LoginMaiku'))
            .attr('href', communicationProxy.clipper.baseUrl)
            .addClass('logined')
            .next().show().unbind('click').click(function(e){
                communicationProxy.clipper.logOut();
                return false;
            });
            self.setCategories(userData, settings);
            self.isLogin = true;
        },
        userlogoutedHandler: function(){
            var self = this;
	    self.clearCategories();
            $('#username').html(communicationProxy.clipper.i18n.getMessage('NotLoginMaiku'))
            .attr('title', communicationProxy.clipper.i18n.getMessage('NotLoginMaikuTip'))
            .removeClass('logined')
            .unbind('click').click(function(e){
                communicationProxy.clipper.checkLogin(function(data){
		    self.userloginedHandler(data.user, data.settins);
		});
                return false;
            }).next().hide();
            self.isLogin = false;
        },
        initCategories: function(){
            var self = this;
            self.mkbmExtra = $('#mkbm-extra');
            var category = self.mkbmExtra.find('.mkbm-category');
            self.displayName = category.find('.mkbm-category-show span');
            self.dropList = category.find('.mkbm-category-select');
	    self.displayNameWrap = self.displayName.parent();
	    self.displayNameWrap.data('title', self.displayNameWrap.attr('title'));
            self.displayNameWrap.click(function(e){
		if(!self.isLogin) return false;
                self.dropList.show();
                $(document).one('click', function(e){
                    self.dropList.hide();
                });
                return false;
            });
            self.dropList.delegate('li', 'click', function(e){
                var t = $(this);
                self.displayName.html(t.html()).data('cateid', t.attr('cateid'));
		chrome.extension.sendRequest({name: 'setdefaultcategory', defaultCategory: t.attr('cateid')});
            });
        },
        setCategories: function(userData, settings){
            var self = this,
	    privateCategories = userData.categories.pri, 
	    publicCategories = userData.categories.pub,
	    defaultCategory = settings.defaultCategory,
	    foundCategory = '',
	    displayName = communicationProxy.clipper.i18n.getMessage('DefaultCatecory'),
	    tStr = '<li class="mkbm-category-title">' + communicationProxy.clipper.i18n.getMessage('PrivateCatecory') + '</li>',
            genStrByCates = function(cates){
                for(var i = 0, l = cates.length, cate; i < l; i++){
                    cate = cates[i];
                    if(cate.ParentID){
                        tStr += '<li class="mkbm-child-category" cateid="' + cate.NoteCategoryID + '">' + cate.DisplayName + '</li>';
                    }else{
                        tStr += '<li cateid="' + cate.NoteCategoryID + '">' + cate.DisplayName + '</li>';
                    }
		    if(!foundCategory && (cate.NoteCategoryID == defaultCategory)){
			displayName = cate.DisplayName;
			foundCategory = defaultCategory;
		    }
                }
            }
            genStrByCates(privateCategories);
            tStr += '<li class="mkbm-category-title">' + communicationProxy.clipper.i18n.getMessage('PublicCatecory') + '</li>';
            genStrByCates(publicCategories);
            self.dropList.html(tStr);
	    self.displayNameWrap.attr('title', '');
	    self.displayName.html(displayName).data('cateid', foundCategory);
        },
	clearCategories: function(){
	    var self = this;
	    self.dropList.html('');
	    self.displayName.html(communicationProxy.clipper.i18n.getMessage('DefaultCatecory'));
	    self.displayNameWrap.attr('title', self.displayNameWrap.data('title'));
	},
        initTags: function(){
            var self = this,
            tags = self.mkbmExtra.find('.mkbm-tags'),
	    tagHandlerEl = tags.find('.mkbm-tagHandler-init'),
            tagsShowTimeout;
            tagHandlerEl.tagHandler({
                className: 'mkbm-taghandler',
                onAdd: function(){
                    tags.scrollTop(9999999);
                },
                onFocus: function(){
                    if(tags.attr('class').indexOf('mkbm-tags-expand') == -1){
                        tags.addClass('mkbm-tags-expand mkbm-focus');
                    }
                },
                onBlur: function(){
                    if(tags.attr('class').indexOf('mkbm-tags-expand') != -1){
                        tags.removeClass('mkbm-tags-expand mkbm-focus');
                    }
                }
            });
            tags.bind('mouseenter', function(){
                tagsShowTimeout = setTimeout(function(){
                    tags.find('.tagInputField').focus();
                    tags.scrollTop(9999999);
                    tags.addClass('mkbm-tags-expand mkbm-focus');
                }, 300);
            });
            tags.bind('mouseleave', function(){
                clearTimeout(tagsShowTimeout);
                tags.find('.tagInputField').blur();
                tags.scrollTop(0);
                tags.removeClass('mkbm-tags-expand mkbm-focus');
            });
	    self.tagHandlerEl = tagHandlerEl;
        },
	initAddNode: function(){
	    var self = this;
	    communicationProxy.addNode = function(data){
		if(data.add){
		    //add content
		    self.addNode($('<div mkclip="true" id="' + data.uid + '"></div>').append(data.noteContent));
		    if(data.title){
			//for auto extract content
			self.title.val(data.title);
		    }
		}else{
		    //remove content by uid
		    $('#' + data.uid).remove();
		}
	    }
	}
    }
    $(function(){
	var startTime = new Date().getTime(),
        timeout = 8000,
        timer = setInterval(function(){
            if(window.communicationProxy){
                clearInterval(timer);
		maikuNotePopup.init();
            }else if(startTime + timeout < new Date().getTime()){
                clearInterval(timer);
            }
        }, 10);
    });
})(MKNoteWebclipper.jQuery);