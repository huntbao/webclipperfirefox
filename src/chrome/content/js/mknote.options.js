//@huntbao @mknote
//All right reserved
;(function($){
    MKNoteWebclipper.Options = {
        init: function(){
            $('#mknotewebclipper-preferences').css({
		width: 660,
		height: 540
	    });
	    MKNoteWebclipper.options.readOptionsFile();
	    var i18n = $('#mknotewebclipper-i18n');
            if(i18n.length > 0){
                MKNoteWebclipper.i18n.stringBundle = i18n[0].stringBundle;
            }
	    window.frames[0].communicationProxy = {
		clipper: MKNoteWebclipper,
		options: MKNoteWebclipper.options
	    }
        }
    }
})(MKNoteWebclipper.jQuery);