//@huntbao @mknote
//All right reserved
;(function(){
    MKNoteWebclipper.FileManager = {
        getProfileDir: function(){
            var self = this;
            if(!self._profileDir){
                self._profileDir = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('ProfD', Components.interfaces.nsIFile);
            }
            return self._profileDir;
        },
        getProfileDirPath: function(){
            return this.profileDir.path;
        },
        createDir: function(dirPath, dirNotExistsCallback, dirExistsCallback){
            dirPath = this.profilePath + dirPath;
            try{
                var dir = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
                dir.initWithPath(dirPath);
                dir.QueryInterface(Components.interfaces.nsIFile);
                if (!dir.exists()){
                    dir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);
                    dirNotExistsCallback && dirNotExistsCallback();
                }else{
                    dirExistsCallback && dirExistsCallback();
                }
            }catch(e){
                MKNoteWebclipper.Util.log('FileManager.createDir() failed: dirPath = ' + dirPath + ', error = ' + e);
            }    
        },
        writeFile: function(filePath, data, isJSONformat){
            filePath = this.profilePath + filePath;
            try{
                var localFile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
                localFile.initWithPath(filePath);
                var fileOutputStream = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
                // use 0x02 | 0x20 to open file and truncate content.
                fileOutputStream.init(localFile, 0x02 | 0x08 | 0x20, 0666, 0);
                // write, create, truncate
                var converter = Components.classes['@mozilla.org/intl/converter-output-stream;1'].createInstance(Components.interfaces.nsIConverterOutputStream);
                converter.init(fileOutputStream, 'UTF-8', 0, 0);
                if(isJSONformat){
                    converter.writeString(JSON.stringify(data));
                }else{
                    converter.writeString(data);
                }
                converter.flush();
                converter.close();
            }catch(e){
                MKNoteWebclipper.Util.log('FileManager.writeFile(): filePath = ' + filePath + ', error = ' + e );
            } 
        },
        readFile: function(filePath, fileReadSuccessCallback, fileNotExistsCallback){
            filePath = this.profilePath + filePath;
            try{
                var localFile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
                localFile.initWithPath(filePath);
                if(!localFile.exists()){
                    //file not exists
                    fileNotExistsCallback && fileNotExistsCallback();
                    return null;
                }
                var fileInputStream = Components.classes['@mozilla.org/network/file-input-stream;1'].createInstance( Components.interfaces.nsIFileInputStream );
                fileInputStream.init(localFile, -1, 0, 0);
                var converter = Components.classes['@mozilla.org/intl/converter-input-stream;1'].createInstance(Components.interfaces.nsIConverterInputStream);
                converter.init(fileInputStream, 'UTF-8', 0, 0);
                var data = '';
                let(str = {}){
                    let read = 0;
                    do{
                        read = converter.readString(0xffffffff, str); 
                        data += str.value;
                    }
                    while(read != 0);
                }
                var obj = JSON.parse(data);
                converter.close();
                fileReadSuccessCallback && fileReadSuccessCallback(obj);
            }catch(e){
                MKNoteWebclipper.Util.log('FileManager.readFile() failed: filePath = ' + filePath + ', error = ' + e);
            }
            return null;
        }
    }
    MKNoteWebclipper.FileManager.__defineGetter__('profileDir', MKNoteWebclipper.FileManager.getProfileDir);
    MKNoteWebclipper.FileManager.__defineGetter__('profilePath', MKNoteWebclipper.FileManager.getProfileDirPath);
})();