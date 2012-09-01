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
            el = $(el);
            self.localizeMessages(el);
            self.localizeTitleMessages(el);
            self.localizePlaceholderMessages(el);
        },
        localizeMessages: function(el){
            var self = this,
            els = el.find('.message');
            els.each(function(idx, ele){
                $(this).html(self.getMessage($(this).attr('messagekey')));
            });
            els.removeAttr('messagekey').removeClass('message');
        },
        localizeTitleMessages: function(el){
            var self = this,
            els = el.find('.message-title');
            els.each(function(idx, ele){
                $(this).attr('title', self.getMessage($(this).attr('messagetitlekey')));
            });
            els.removeAttr('messagetitlekey').removeClass('message-title');
        },
        localizePlaceholderMessages: function(el){
            var self = this,
            els = el.find('.message-placeholder');
            els.each(function(idx, ele){
                $(this).attr('placeholder', self.getMessage($(this).attr('messageplaceholderkey'))).removeAttr('messageplaceholderkey');
            });
            els.removeAttr('messageplaceholderkey').removeClass('message-placeholder');
        }
    }
})(MKNoteWebclipper.jQuery);
MKNoteWebclipper.i18n.__defineSetter__('stringBundle', MKNoteWebclipper.i18n.setStringBundle);
