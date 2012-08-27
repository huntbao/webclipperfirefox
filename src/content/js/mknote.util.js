//utils
MKNoteWebclipper.Util = {
    sayHello: function(aEvent){
        var stringBundle = document.getElementById('mknotewebclipper-string-bundle');
        var message = stringBundle.getString('mknotewebclipper.greeting.label');
    },
    log: function(msg){
        if(!msg){
            msg = '===>Nothing to debug!!!<===';
        }
        var self = this;
        if(typeof msg == 'object'){
            try{
                self.console.logStringMessage(JSON.stringify(msg));
            }catch(e){
                //maybe cyclic object
                self.console.logStringMessage(e + ':\n ' + msg);
            }
        }else{
            self.console.logStringMessage(msg);
        }
    },
    dump: function(obj){
        var self = this;
        function ddump(arr, level){
            var dumped_text = '';
            if(!level) level = 0;
            var level_padding = '';
            for(let j = 0; j < level + 1; j++){
                level_padding += '    ';
            }
            if(typeof(arr) == 'object'){
                for(let item in arr){
                    let value = arr[item];
                    if(typeof(value) == 'object'){
                        dumped_text += level_padding + "'" + item + "' ...\n";
                        dumped_text += ddump(value, level + 1);
                    }else{
                        dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                    }
                }
            }else{
                dumped_text = '===>' + arr + '<===(' + typeof(arr) + ')';
            }
            return dumped_text;
        }
        self.console.logStringMessage(ddump(obj));
    },
    getConsole: function(){
        var self = this;
        if(!self._console){
            self._console = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
        }
        return self._console;
    }
};
MKNoteWebclipper.Util.__defineGetter__('console', MKNoteWebclipper.Util.getConsole);