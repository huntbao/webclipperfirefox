//cookie
MKNoteWebclipper.Cookie = {
    clipper: MKNoteWebclipper,
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
            self.clipper.Util.debug('Cookie get failed: url = ' + url + ', name = ' + name + ', error = ' + e );
        }
        return null;
    },
    observe: function(subject, topic, data){
        var self = this;
        try{
            subject.QueryInterface(Components.interfaces.nsICookie);
        }catch(e){
            return;
        }
        if(subject.host.toLowerCase().indexOf('sdo.com') < 0){
           return;
        }
        if(topic == 'cookie-changed'){
            if(subject.name == self.observeCookieName){
                self.removeObserverService();
                self.observeCallback && self.observeCallback();
                self.observeCookieName = null;
                self.observeCallback = null;
            }
        }
    },
    getObserverService: function(observeCookieName, observeCallback){
        var self = this;
        self.observeCookieName = observeCookieName;
        self.observeCallback = observeCallback;
        self.observerService = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
        self.observerService.addObserver(self, 'cookie-changed', false);
    },
    removeObserverService: function(){
        var self = this;
        if(self.observerService){
            self.observerService.removeObserver(self, 'cookie-changed');
        }
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
