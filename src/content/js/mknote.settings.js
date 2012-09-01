//@huntbao @mknote
//All right reserved
;(function(undefined){
    var getOption = function(key, defaultValue){
	var options = JSON.parse(window.localStorage[maikuNoteOptions.localstoragekey] || '{}');
	if(options[key] === undefined){
		return defaultValue;
	}else{
	    return options[key];
	}
    }
    var setOption = function(key, value){
	var options = JSON.parse(window.localStorage[maikuNoteOptions.localstoragekey] || '{}');
	options[key] = value;
	window.localStorage[maikuNoteOptions.localstoragekey] = JSON.stringify(options);
    }
    var maikuNoteOptions = {
	localstoragekey: '__MaikuWebClipperOptions__',
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
	}
    }
    
    maikuNoteOptions.__defineGetter__('serializeImg', maikuNoteOptions.getSerializeImg);
    maikuNoteOptions.__defineSetter__('serializeImg', maikuNoteOptions.setSerializeImg);
    maikuNoteOptions.__defineGetter__('defaultCategory', maikuNoteOptions.getDefaultCategory);
    maikuNoteOptions.__defineSetter__('defaultCategory', maikuNoteOptions.setDefaultCategory);
    maikuNoteOptions.__defineGetter__('autoExtractContent', maikuNoteOptions.getAutoExtractContent);
    maikuNoteOptions.__defineSetter__('autoExtractContent', maikuNoteOptions.setAutoExtractContent);
    maikuNoteOptions.__defineGetter__('imageAttachment', maikuNoteOptions.getImageAttachment);
    maikuNoteOptions.__defineSetter__('imageAttachment', maikuNoteOptions.setImageAttachment);
    
    window.maikuNoteOptions = maikuNoteOptions;
})();