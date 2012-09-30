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
            $('#title').text(params.i18n.getMessage('ExtensionName'));
            var tip = $('#tip'),
            changeTip = function(msg){
                if(typeof msg === 'string'){
                    tip.empty().append($('<span>', {text: msg}));
                }else if(typeof msg === 'object'){
                    tip.empty().append(msg);
                }
            }
            changeTip(params.message);
            
            //rewrite changeMessage method
            params.changeMessage = function(message){
                tip.css('opacity', 1).fadeOut(function(){
                    changeTip(message);
                    $(this).fadeIn();
                });
            }
            params.notificationReady = true;
            
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