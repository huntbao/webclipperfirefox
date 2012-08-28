;(function($){
    var notificationInner = {
        init: function(params){
            var self = this;
            self.initContent(params);
            self.initCloseBtn(params);
            self.addMessageListener();
        },
        initContent: function(params){
            var self = this;
            $('#title').html(params.i18n.getMessage('mknotewebclipper.name'));
            $('#tip').html(params.tip);
        },
        initCloseBtn: function(params){
            var self = this;
            $('#closebtn').click(function(e){
                params.desktopNotification.close();
            });
        },
        addMessageListener: function(){
            var self = this,
            messageHandler = function(e){
                alert(e.origin)
                $('#tip').html(e.data);
            }
            window.addEventListener('message', messageHandler, true);
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