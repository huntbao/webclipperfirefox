/**
 * MKNoteWebclipper namespace.
 */
if("undefined" == typeof(MKNoteWebclipper)){
  var MKNoteWebclipper = {};
};
MKNoteWebclipper = {
  menuActionSwitcher: function(event, clipType){
    MKNoteWebclipper.Util.debug(document);
    MKNoteWebclipper.Util.debug(document.popupNode);
    MKNoteWebclipper.Util.debug(gContextMenu);
  }
  
}
MKNoteWebclipper.Util = {
  sayHello: function(aEvent){
    let stringBundle = document.getElementById("mknotewebclipper-string-bundle");
    let message = stringBundle.getString("mknotewebclipper.greeting.label");
    window.alert(message);
  },
  debug: function(msg){
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
  }
};
