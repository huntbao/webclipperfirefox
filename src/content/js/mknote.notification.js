//Notification
;(function($){
    MKNoteWebclipper.Notification = {
        show: function(data){
            var self = this;
            if(!data){
                data = {};
            }
            data.i18n = MKNoteWebclipper.i18n;
            data.desktopNotification = self;
            data.tip = '正在保存，请稍候...<a href="http://www.mknote.com" target="_blank">查看</a>';
            var position = self.getPosition();
            self._dialog = window.openDialog('chrome://mknotewebclipper/content/notification.xul', '',
                'chrome, popup, left=' + position.left + ', top=' + position.top + ', titlebar=no, resizable=no', data);
        },
        close: function(){
            var self = this;
            if(self._dialog){
                self._dialog.close();
                self._dialog = null;
            }
        },
        getPosition: function(){
            return {
                left: screen.width - 310,
                top: screen.height - 130
            }
        }
    }
})(MKNoteWebclipper.jQuery);