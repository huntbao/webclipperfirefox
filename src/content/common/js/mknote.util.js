//utils
MKNoteWebclipper.Util = {
  sayHello: function(aEvent){
    let stringBundle = document.getElementById('mknotewebclipper-string-bundle');
    let message = stringBundle.getString('mknotewebclipper.greeting.label');
  },
  debug: function(msg){
    if(!msg){
      msg = 'Nothing to debug!!!';
    }
    var consoleService = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
  }
};