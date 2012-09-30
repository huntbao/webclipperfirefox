//@huntbao @mknote
//All right reserved
;(function($){
    MKNoteWebclipper.i18n = {
        clipper: MKNoteWebclipper,
        getMessage: function(key){
            var self = this;
            if(self._stringBundle){
                try{
                    return self._stringBundle.GetStringFromName(key);
                }catch(e){
                    self.clipper.Util.log('Get failed: key = ' + key + ', error = ' + e );
                }
            }
            return '';
        },
        setStringBundle: function(stringBundle){
            this._stringBundle = stringBundle;
        },
        localizeElement: function(el){
            var self = this;
            if(!el) return;
            var els = $(el).find('.message'),
            message;
            els.each(function(idx, ele){
                ele = $(ele);
                message = ele.attr('message');
                if(message.indexOf(':') == -1){
                    //html
                    ele.text(self.getMessage(message));
                }else{
                    message = message.split('|');
                    for(let i = 0; i < message.length; i++){
                        let parts = message[i].split(':');
                        if(parts[0] == 'html'){
                            ele.text(self.getMessage(parts[1]));
                        }else{
                            ele.attr(parts[0], self.getMessage(parts[1]));
                        }
                    }
                }
            });
            els.removeAttr('message').removeClass('message');
        }
    }
})(MKNoteWebclipper.jQuery);
MKNoteWebclipper.i18n.__defineSetter__('stringBundle', MKNoteWebclipper.i18n.setStringBundle);
