//@huntbao @mknote
//All right reserved
;(function($){
    var notificationInner = {
        init: function(params){
            var self = this;
            self.initContent(params);
            self.initCloseBtn(params);
        },
        initContent: function(params){
            var self = this;
            $('#title').html(params.i18n.getMessage('ExtensionName'));
            var tip = $('#tip').html(params.message),
            checkCloseBtn = function(){
                var closeBtn = $('#customclosebtn');
                if(closeBtn.length > 0){
                    closeBtn.mouseup(function(){
                        setTimeout(function(){
                            params.desktopNotification.close();
                        }, 10);
                    });
                }
            }
            //rewrite changeMessage method
            params.changeMessage = function(message){
                tip.css('opacity', 1).fadeOut(function(){
                    $(this).html(message).fadeIn();
                    checkCloseBtn();
                });
            }
            checkCloseBtn();
        },
        initCloseBtn: function(params){
            var self = this;
            $('#closebtn').click(function(e){
                params.desktopNotification.close();
            });
        }
    }
    $(function(){
        var startTime = new Date().getTime(),
        timeout = 8000,
        timer = setInterval(function(){
            if(window.panel){
                clearInterval(timer);
                notificationInner.init(window.panel.arguments[0]);
            }else if(startTime + timeout < new Date().getTime()){
                clearInterval(timer);
            }
        }, 10);
    });
})(MKNoteWebclipper.jQuery);