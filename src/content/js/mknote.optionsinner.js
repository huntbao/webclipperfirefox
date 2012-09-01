//@huntbao @mknote
//All right reserved
;(function($){
    window.maikuNoteSettings = {
        init: function(){
            var self = this,
            maikuNoteOptions = window.maikuNoteOptions;
	    communicationProxy.clipper.Util.log(maikuNoteOptions)
            self.retrieveRemoteImageOps = $('input[name="retrieveremoteimage"]').click(function(){
                maikuNoteOptions.serializeImg = $(this).attr('checked') == 'checked' ? true : false;
            });
            self.imageAttachmentOps = $('input[name="imageattachment"]').click(function(){
                maikuNoteOptions.imageAttachment = $(this).attr('checked') == 'checked' ? true : false;
            });
            self.autoExtractContentOps = $('input[name="autoextract"]').click(function(){
                maikuNoteOptions.autoExtractContent = $(this).attr('checked') == 'checked' ? true : false;
            });
            if(maikuNoteOptions.serializeImg == false){
                self.retrieveRemoteImageOps.attr('checked', false);
            }
            if(maikuNoteOptions.imageAttachment == true){
                self.imageAttachmentOps.attr('checked', true);
            }
            if(maikuNoteOptions.autoExtractContent == false){
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