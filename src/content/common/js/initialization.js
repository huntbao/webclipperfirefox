;(function($){
    var MKNoteWebclipperInit = {
        init: function(){
            var self = this;
            self.initContextMenu();
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
            MKNoteWebclipper.Util.debug(gContextMenu);
            var self = this,
            isContentSelected = gContextMenu.isContentSelected,
            onImage = gContextMenu.onImage,
            onLink = gContextMenu.onLink;
            self.contextMenus.selection[isContentSelected ? 'show' : 'hide']();
            self.contextMenus.curlink[onLink ? 'show' : 'hide']();
            self.contextMenus.curimage[onImage ? 'show' : 'hide']();
            if(onImage || onLink || isContentSelected){
                self.contextMenus.content.hide();
                self.contextMenus.links.hide();
                self.contextMenus.images.hide();
                self.contextMenus.url.hide();
                self.contextMenus.subseperator1.hide();
            }else{
                self.contextMenus.content.show();
                self.contextMenus.links.show();
                self.contextMenus.images.show();
                self.contextMenus.url.show();
                self.contextMenus.subseperator1.show();
            }
        }
    }
    $(window).bind('load', function(){
        MKNoteWebclipperInit.init();
    });
})(MKNoteWebclipper.jQuery);