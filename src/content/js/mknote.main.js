/**
 * MKNoteWebclipper namespace.
 */
if(typeof MKNoteWebclipper == 'undefined'){
    var MKNoteWebclipper = {};
};
MKNoteWebclipper = {
    loginCookieName: '.iNoteAuth',
    baseUrl: 'http://notelocal.sdo.com',
    iNoteAuthCookieHost: '.notelocal.sdo.com',
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
        popupInstance = self.jQuery('<div mkclip="true" style="position:fixed;right:8px;top:8px;width:450px;height:450px;\
        min-height:304px;max-height:644px;z-index:;border-radius:3px;box-shadow:0 0 5px 0 #333;overflow:hidden;z-index:20120830"></div>', content.document)
            .hide()
            .appendTo(content.document.body),
        iframe = self.jQuery('<iframe frameborder="0" style="width:100%;height:100%;"></iframe>', content.document).appendTo(popupInstance),
        iframeWin = iframe[0].contentWindow;
        iframeWin.location.href = 'chrome://mknotewebclipper/content/popup.xul';
        popupInstance.show();
        content.currentMaikuWebclipperPopup = {
            targetWin: window,
            instance: popupInstance
        };
    },
    checkLogin: function(callback){
        var self = this,
        cookie = self.Cookie.get(self.baseUrl, self.loginCookieName, self.iNoteAuthCookieHost);
        if(cookie == null){
            self.Notification.show(self.i18n.getMessage('mknotewebclipper.NotLogin'), false);
            var popLoginWin = content.openDialog(self.baseUrl + '/login', '','chrome, titlebar = no, left = 10, top = 10, width = 800, height = 600, resizable = no');
            self.Cookie.getObserverService(self.loginCookieName, function(){
                popLoginWin.close();
                callback && callback();
            });
        }else{
            callback && callback();
        }
    },
    restartFirefox: function(){
        Components.classes['@mozilla.org/toolkit/app-startup;1'].getService(Components.interfaces.nsIAppStartup)
        .quit(Components.interfaces.nsIAppStartup.eAttemptQuit | Components.interfaces.nsIAppStartup.eRestart);
    }
}
