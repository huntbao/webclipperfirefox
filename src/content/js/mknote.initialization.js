//@huntbao @mknote
//All right reserved
;(function($){
    var MKNoteWebclipperInit = {
        clipper: MKNoteWebclipper,
        init: function(){
            var self = this;
            self.initStringBundle();
            self.initContextMenu();
            self.jQuerySetUp();
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