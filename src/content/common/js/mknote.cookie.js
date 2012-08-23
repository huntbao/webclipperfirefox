//cookie
MKNoteWebclipper.Cookie = {
    Util: MKNoteWebclipper.Util,
    get: function(url, name, host){
        var self = this;
        try{
            host = host || self.ioService.newURI(url, null, null).host;
            for(let e = self.cookieManagerService.enumerator; e.hasMoreElements();){
                let cookie = e.getNext().QueryInterface(Components.interfaces.nsICookie);
                if (cookie && cookie.host == host && cookie.name == name){
                    return cookie;
                }
            }
        }catch(e){
            self.Util.debug('MKNoteWebclipper.Cookie.get() failed: url = ' + url + ', name = ' + name + ', error = ' + e );
        }
        return null;
    },
    getIOService: function(){
        var self = this;
        if(!self._ioService){
            self._ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
        }
        return self._ioService;
    },
    getCookieManagerService: function(){
        var self = this;
        if(!self._cookieManagerSrv){
            self._cookieManagerSrv = Components.classes['@mozilla.org/cookiemanager;1'].getService(Components.interfaces.nsICookieManager);
        }
        return self._cookieManagerSrv;
    }
};
MKNoteWebclipper.Cookie.__defineGetter__('ioService', MKNoteWebclipper.Cookie.getIOService);
MKNoteWebclipper.Cookie.__defineGetter__('cookieManagerService', MKNoteWebclipper.Cookie.getCookieManagerService);