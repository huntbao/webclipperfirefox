//@huntbao @mknote
//All right reserved
;(function(){
    if(typeof MKNoteWebclipper == 'undefined'){
        MKNoteWebclipper = {}; 
    }
    MKNoteWebclipper.jQuery = jQuery.noConflict(true);
    //escapeHTML
    if(typeof String.prototype.escapeHTML === 'undefined'){
        String.prototype.escapeHTML = function(){
            return MKNoteWebclipper.jQuery('<div>', content.document).text(this.toString()).html();
        }
    }
})();

