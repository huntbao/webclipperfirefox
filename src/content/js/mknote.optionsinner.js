//@huntbao @mknote
//All right reserved
;(function($){
    window.maikuNoteSettings = {
        init: function(){
            var self = this,
            options = window.communicationProxy.options,
	    i18n = window.communicationProxy.clipper.i18n;
	    i18n.localizeElement(document.body);
	    document.title = i18n.getMessage('OptionsPageTitle');
            self.retrieveRemoteImageOps = $('input[name="retrieveremoteimage"]').click(function(){
                options.serializeImg = $(this).attr('checked') == 'checked' ? true : false;
            });
            self.imageAttachmentOps = $('input[name="imageattachment"]').click(function(){
                options.imageAttachment = $(this).attr('checked') == 'checked' ? true : false;
            });
            self.autoExtractContentOps = $('input[name="autoextract"]').click(function(){
                options.autoExtractContent = $(this).attr('checked') == 'checked' ? true : false;
            });
            if(options.serializeImg == false){
                self.retrieveRemoteImageOps.attr('checked', false);
            }
            if(options.imageAttachment == true){
                self.imageAttachmentOps.attr('checked', true);
            }
            if(options.autoExtractContent == false){
                self.autoExtractContentOps.attr('checked', false);
            } 
        }
    }
    $(function(){
	var startTime = new Date().getTime(),
        timeout = 8000,
        timer = setInterval(function(){
            if(window.communicationProxy){
                clearInterval(timer);
		maikuNoteSettings.init();
            }else if(startTime + timeout < new Date().getTime()){
                clearInterval(timer);
            }
        }, 10);
    });
})(MKNoteWebclipper.jQuery);