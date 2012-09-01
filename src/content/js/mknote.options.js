//@huntbao @mknote
//All right reserved
;(function($){
    MKNoteWebclipper.Options = {
        init: function(){
            $('#mknotewebclipper-preferences').css({
		width: 660,
		height: 540
	    });
	    window.frames[0].communicationProxy = {
		clipper: MKNoteWebclipper,
		i18n: $('#mknotewebclipper-i18n')[0]
	    }
        }
    }
})(MKNoteWebclipper.jQuery);