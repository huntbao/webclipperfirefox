//@huntbao @mknote
//All right reserved
;(function(){
    MKNoteWebclipper.i18n = {
        clipper: MKNoteWebclipper,
        getMessage: function(key, param){
            var self = this;
            if(self._stringBundle){
                try{
                    if(typeof params != 'undefined'){
                        var p = [].concat(params);
                        return self._stringBundle.formatStringFromName(key, p, p.length);
                    }else{
                        return self._stringBundle.GetStringFromName(key);
                    }
                }catch(e){
                    self.clipper.Util.log('Get failed: key = ' + key + ', error = ' + e );
                }
            }
            return '';
        },
        setStringBundle: function(stringBundle){
            this._stringBundle = stringBundle;
        }
    }
})();
MKNoteWebclipper.i18n.__defineSetter__('stringBundle', MKNoteWebclipper.i18n.setStringBundle);
