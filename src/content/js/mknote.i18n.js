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
            var self = this;
            el.find('.message').each(function(idx, ele){
                $(this).html(self.getMessage($(this).attr('messagekey')));
            });
        },
        localizeTitleMessages: function(el){
            var self = this;
            el.find('.message-title').each(function(idx, ele){
                $(this).attr('title', self.getMessage($(this).attr('messagetitlekey')));
            });
        },
        localizePlaceholderMessages: function(el){
            var self = this;
            el.find('.message-placeholder').each(function(idx, ele){
                $(this).attr('placeholder', self.getMessage($(this).attr('messageplaceholderkey')));
            });
        }
    }
})(MKNoteWebclipper.jQuery);
MKNoteWebclipper.i18n.__defineSetter__('stringBundle', MKNoteWebclipper.i18n.setStringBundle);
