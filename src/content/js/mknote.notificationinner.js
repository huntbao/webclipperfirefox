;(function($){
    var notificationInner = {
        init: function(params){
            var self = this;
            self.initContent(params);
            self.initCloseBtn(params);
        },
        initContent: function(params){
            var self = this;
            $('#tip').html(params.tip);
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