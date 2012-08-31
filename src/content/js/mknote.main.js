//@huntbao @mknote
//All right reserved
;(function($){
    $.extend(MKNoteWebclipper, {
        loginCookieName: '.iNoteAuth',
        baseUrl: 'http://note.sdo.com',
        iNoteAuthCookieHost: '.note.sdo.com',
        mkNoteWebclipperPopups: [],//store all popups, every tab can have a popup
        menuActionSwitcher: function(event, clipType){
            var self = this;
            self.Util.log(gContextMenu);
            switch(clipType){
                case 'selection':
                    self.clipSelection();
                    break;
                case 'curimage':
                    self.clipImage();
                    break;
                case 'curlink':
                    self.clipLink();
                    break;
                case 'content':
                    self.clipPageContent();
                    break;
                case 'links':
                    self.clipAllLinks();
                    break;
                case 'images':
                    self.clipAllImages();
                    break;
                case 'url':
                    self.clipPageUrl();
                    break;
                case 'curlink':
                    self.clipLink();
                    break;
                case 'newnote':
                    self.newNote();
                    break;
                case 'serializeimage':
                    self.serializeImage();
                    break;
                default:
                    break;
            }
        },
        clipSelection: function(){
            var self = this,
            userSelectionText = content.getSelection().toString();
            self.Util.log(userSelectionText);
            if(userSelectionText.trim() == '') return;
        },
        clipImage: function(){
            var self = this,
            target = gContextMenu.target;
            self.Note.getImageFromURL(target.src);
        },
        clipPageContent: function(){
            var self = this;
            self.Note.saveNote('hello world', content.location.href, '你好');
        },
        newNote: function(){
            var self = this;
            self.createPopup();
        },
        createPopup: function(){
            if(content.currentMaikuWebclipperPopup) return;
            var self = this,
            popupInstance = $('<div mkclip="true" style="position:fixed;right:8px;top:8px;width:450px;height:450px;\
            min-height:304px;max-height:644px;z-index:;border-radius:3px;box-shadow:0 0 5px 0 #333;overflow:hidden;z-index:20120830"></div>', content.document)
                .hide()
                .appendTo(content.document.body),
            iframe = $('<iframe frameborder="0" style="width:100%;height:100%;"></iframe>', content.document).appendTo(popupInstance),
            iframeWin = iframe[0].contentWindow;
            iframeWin.location.href = 'chrome://mknotewebclipper/content/popup.xul';
            content.currentMaikuWebclipperPopup = {
                clipper: self,
                instance: popupInstance,
                popupContext: content,
                updateUserInfo: function(){
                    //override by corresponding popup
                }
            }
            self.mkNoteWebclipperPopups.push(content.currentMaikuWebclipperPopup);
        },
        deletePopup: function(popup){
            var self = this,
            idx = self.mkNoteWebclipperPopups.indexOf(popup);
            if(idx != -1){
                popup.popupContext.currentMaikuWebclipperPopup = null;
                self.mkNoteWebclipperPopups.splice(idx, 1);
            }
        },
        checkLogin: function(callback, showNotification){
            var self = this;
            cookie = self.Cookie.get(self.baseUrl, self.loginCookieName, self.iNoteAuthCookieHost);
            if(cookie == null){
                showNotification && self.Notification.show(self.i18n.getMessage('NotLogin'), false);
                var popLoginWin = content.openDialog(self.baseUrl + '/login', '','chrome, titlebar = no, left = 10, top = 10, width = 800, height = 600, resizable = no');
                self.Cookie.addObserver('popupLoginObserver', self.loginCookieName, false, function(action){
                    popLoginWin.close();
                    callback && callback();
                });
            }else{
                callback && callback();
            }
        },
        logOut: function(){
            var self = this;
            content.openDialog(self.baseUrl + '/account/logout', '','chrome, popup, titlebar = no, right = -100, bottom = -100, width = 10, height = 10, resizable = no');
        },
        getUser: function(callback){
            var self = this;
            if(self.userData){
                callback(self.combineData(self.userData));
                return;
            }
            var cookie = self.Cookie.get(self.baseUrl, self.loginCookieName, self.iNoteAuthCookieHost);
            if(cookie){
                //user logined, get user from localStorage or send request to get user
                $.ajax({
                    url: self.baseUrl + '/plugin/clipperdata',
                    success: function(data){
                        if(data.error){
                            //todo
                            callback(self.combineData());
                            return;
                        }
                        self.Util.log(data);
                        self.userData = data;
                        callback(self.combineData(data));
                    },
                    error: function(){
                        callback(self.combineData());
                    }
                });
            }else{
                callback(self.combineData());
            }
        },
        combineData: function(user){
            var self = this;
            return {
                user: user,
                settings: self.getSettings()
            }    
        },
        getSettings: function(){
            var self = this;
            self.settings = {
                serializeImg: true,
                defaultCategory: '',
                autoExtractContent: true
            }
            return self.settings;
        },
        cookieChanged: function(action){
            var self = this;
            if(action == 'added'){
                //user logined
                self.getUser(function(data){
                    self.updateAllPopups(data);
                });
            }else if(action == 'deleted'){
                //user logout
                self.userData = null;
                self.updateAllPopups(null);
            }
        },
        updateAllPopups: function(data){
            var self = this;
            for(let i = 0, l = self.mkNoteWebclipperPopups.length; i < l; i++){
                let popupContext = self.mkNoteWebclipperPopups[i].popupContext;
                popupContext.maikuWebclipperPopupIframe.communicationProxy.updateUserInfo(data);
            }
        },
        restartFirefox: function(){
            Components.classes['@mozilla.org/toolkit/app-startup;1'].getService(Components.interfaces.nsIAppStartup)
            .quit(Components.interfaces.nsIAppStartup.eAttemptQuit | Components.interfaces.nsIAppStartup.eRestart);
        }
    });
})(MKNoteWebclipper.jQuery);

