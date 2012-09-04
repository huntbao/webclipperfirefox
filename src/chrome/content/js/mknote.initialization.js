//@huntbao @mknote
//All right reserved
;(function($){
    var MKNoteWebclipperInit = {
        clipper: MKNoteWebclipper,
        init: function(){
            var self = this;
            self.initCookieStaff();
            self.initStringBundle();
            self.initContextMenu();
            self.initBindEvent();
            self.jQuerySetUp();
            self.clipper.options.readOptionsFile();
            self.clipper.Observer.startOptionsFileObserverService();
        },
        initCookieStaff: function(){
            var self = this;
            self.clipper.Observer.startCookieObserverService()
            .addCookieObserver('cookieChangedObserver', self.clipper.loginCookieName, true, function(action){
                self.clipper.cookieChanged(action);
            });
        },
        initStringBundle: function(){
            var self = this,
            i18n = $('#mknotewebclipper-stringbundle');
            if(i18n.length > 0){
                self.clipper.i18n.stringBundle = i18n[0].stringBundle;
            }
        },
        initContextMenu: function(){
            var self = this;
            self.contextMenus = {
                selection: $('#mknotewebclipper-contextmenu-selection'),
                curimage: $('#mknotewebclipper-contextmenu-curimage'),
                curlink: $('#mknotewebclipper-contextmenu-curlink'),
                content: $('#mknotewebclipper-contextmenu-content'),
                links: $('#mknotewebclipper-contextmenu-links'),
                images: $('#mknotewebclipper-contextmenu-images'),
                url: $('#mknotewebclipper-contextmenu-url'),
                newnote: $('#mknotewebclipper-contextmenu-newnote'),
                serializeimage: $('#mknotewebclipper-contextmenu-serializeimage'),
                subseperator1: $('#mknotewebclipper-contextmenu-sep-sub1')
            }
            $('#contentAreaContextMenu').bind('popupshowing', function(){
                self.initContextMenuShow();
            });
        },
        initBindEvent: function(){
            var self = this;
            gBrowser.addEventListener('DOMContentLoaded', function(){
                //each web page load
                $(content.document).unbind('keydown.maikuwebclipper').bind('keydown.maikuwebclipper', function(e){
                    if(e.ctrlKey && e.shiftKey && e.keyCode == 88/*x*/){
                        self.clipper.newNote();
                    }
                });
            }, false);
        },
        initContextMenuShow: function(){
            var self = this,
            isContentSelected = gContextMenu.isContentSelected,
            onImage = gContextMenu.onImage,
            onLink = gContextMenu.onLink,
            menus = self.contextMenus;
            menus.selection[isContentSelected ? 'show' : 'hide']();
            menus.curlink[onLink ? 'show' : 'hide']();
            menus.curimage[onImage ? 'show' : 'hide']();
            if(onImage || onLink || isContentSelected){
                menus.content.hide();
                menus.links.hide();
                menus.images.hide();
                menus.url.hide();
                menus.subseperator1.hide();
            }else{
                menus.content.show();
                menus.links.show();
                menus.images.show();
                menus.url.show();
                menus.subseperator1.show();
            }
            menus.serializeimage[0].setAttribute('checked', self.clipper.options.settings.serializeImg);
        },
        jQuerySetUp:function(){
            $.ajaxSetup({
                dataType: 'text',
                cache: false,
                dataFilter: function(data){
                    data = $.parseJSON(data.substr(9));
                    return data.success ? data.data : {error: data.error};
                }
            });
        }
    }
        
    $(window).bind('load', function(){
        MKNoteWebclipperInit.init();
    });
})(MKNoteWebclipper.jQuery);