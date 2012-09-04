//@huntbao @mknote
//All right reserved
;(function($){
    MKNoteWebclipper.Notification = {
        clipper: MKNoteWebclipper, 
        show: function(message, lastTime){
            var self = this;
            clearTimeout(self.notificationTimer);
            clearInterval(self.checkReadyTimer);
            if(self._dialog){
                //if show method called very quickly, the notification page maybe not ready(so it has no changeMessage method)
                if(self._dialogData.notificationReady == true){
                    self._dialogData.changeMessage(message);
                }else{
                    self.checkReadyTimer = setInterval(function(){
                        if(self._dialogData.notificationReady){
                            clearInterval(self.checkReadyTimer);
                            self._dialogData.changeMessage(message);
                        }
                    }, 1);
                }
            }else{
                self._dialogData = {
                    i18n: self.clipper.i18n,
                    desktopNotification: self,
                    message: message,
                    notificationReady: false,
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
                clearTimeout(self.notificationTimer);
                clearInterval(self.checkReadyTimer);
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