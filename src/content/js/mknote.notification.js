//Notification
;(function($){
    MKNoteWebclipper.Notification = {
        clipper: MKNoteWebclipper, 
        show: function(message, lastTime){
            var self = this;
            if(self._dialog){
                clearTimeout(self.notificationTimer);
                self._dialogData.changeMessage(message);
            }else{
                self._dialogData = {
                    i18n: self.clipper.i18n,
                    desktopNotification: self,
                    message: message,
                    changeMessage: function(){
                        //this method will be rewrited in dialog code
                    }
                }
                var position = self.getPosition();
                self._dialog = window.openDialog('chrome://mknotewebclipper/content/notification.xul', '',
                    'chrome, popup, left=' + position.left + ', top=' + position.top + ', titlebar=no, resizable=no', self._dialogData);
            }
            if(lastTime !== false){
                self.notificationTimer = setTimeout(function(){
                    self.close();
                }, lastTime || 5000);
            }
        },
        close: function(){
            var self = this;
            if(self._dialog){
                self._dialog.close();
                self._dialog = null;
                self._dialogData = null;
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