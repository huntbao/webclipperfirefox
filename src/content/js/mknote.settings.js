//@huntbao @mknote
//All right reserved
;(function(undefined){
    var getOption = function(key, defaultValue){
	var options = MKNoteWebclipper.options.settings || {};
	if(options[key] === undefined){
	    return defaultValue;
	}else{
	    return options[key];
	}
    }
    var setOption = function(key, value){
	var options = MKNoteWebclipper.options.settings || {};
	options[key] = value;
	MKNoteWebclipper.options.writeOptionsFile(options);
    }
    MKNoteWebclipper.options = {
	clipper: MKNoteWebclipper,
	settings: {},
	getSerializeImg: function(){
	    return getOption('serializeImg', true);
	},
	setSerializeImg: function(value){
	    setOption('serializeImg', value);
	},
	getDefaultCategory: function(){
	    return getOption('defaultCategory', '');
	},
	setDefaultCategory: function(value){
	    setOption('defaultCategory', value);
	},
	getAutoExtractContent: function(){
	    return getOption('autoExtractContent', true);
	},
	setAutoExtractContent: function(value){
	    setOption('autoExtractContent', value);
	},
	getImageAttachment: function(){
	    return getOption('imageAttachment', false);
	},
	setImageAttachment: function(value){
	    setOption('imageAttachment', value);
	},
        IS_WIN: (navigator.platform.indexOf('Win') != -1),
        getSLASH: function(){
            return this.IS_WIN ? '\\' : '/';
        },
        readOptionsFile: function(){
            var self = this,
            slash = self.SLASH,
            defalutOptions = {},
            dirPath = slash + 'mknotewebclipper',
            optionsFilePath = slash + 'mknotewebclipper' + slash + 'options.json';
            self.clipper.FileManager.createDir(dirPath, function(){
                //dir not exist, first install extension
                self.clipper.FileManager.writeFile(optionsFilePath, defalutOptions, true);
            }, function(){
                //dir exist, get options.json
                self.clipper.FileManager.readFile(optionsFilePath, function(data){
                    defalutOptions = data;
                });
            });
            self.settings = defalutOptions; 
        },
        writeOptionsFile: function(options){
            var self = this,
            slash = self.SLASH,
            optionsFilePath = slash + 'mknotewebclipper' + slash + 'options.json';
	    self.settings = options;//store
            self.clipper.FileManager.writeFile(optionsFilePath, options, true);
	    self.notifyObserver(options);
        },
	notifyObserver: function(options){
	    this.observer.notifyObservers(null, 'options-file-changed', JSON.stringify(options));
	},
	getObserver: function(){
	    var self = this;
	    if(!self._observer){
		self._observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
	    }
	    return self._observer;
	}
    }
    
    MKNoteWebclipper.options.__defineGetter__('serializeImg', MKNoteWebclipper.options.getSerializeImg);
    MKNoteWebclipper.options.__defineSetter__('serializeImg', MKNoteWebclipper.options.setSerializeImg);
    MKNoteWebclipper.options.__defineGetter__('defaultCategory', MKNoteWebclipper.options.getDefaultCategory);
    MKNoteWebclipper.options.__defineSetter__('defaultCategory', MKNoteWebclipper.options.setDefaultCategory);
    MKNoteWebclipper.options.__defineGetter__('autoExtractContent', MKNoteWebclipper.options.getAutoExtractContent);
    MKNoteWebclipper.options.__defineSetter__('autoExtractContent', MKNoteWebclipper.options.setAutoExtractContent);
    MKNoteWebclipper.options.__defineGetter__('imageAttachment', MKNoteWebclipper.options.getImageAttachment);
    MKNoteWebclipper.options.__defineSetter__('imageAttachment', MKNoteWebclipper.options.setImageAttachment);
    MKNoteWebclipper.options.__defineGetter__('SLASH', MKNoteWebclipper.options.getSLASH);
    MKNoteWebclipper.options.__defineGetter__('observer', MKNoteWebclipper.options.getObserver);
})();