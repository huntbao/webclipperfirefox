/**
 * MKNoteWebclipper namespace.
 */
if ("undefined" == typeof(MKNoteWebclipper)) {
  var MKNoteWebclipper = {};
};

MKNoteWebclipper.BrowserOverlay = {
  sayHello : function(aEvent) {
    let stringBundle = document.getElementById("mknotewebclipper-string-bundle");
    let message = stringBundle.getString("mknotewebclipper.greeting.label");

    window.alert(message);
  },
  sayHelloo : function(aEvent) {
    let stringBundle = document.getElementById("mknotewebclipper-string-bundle");
    let message = stringBundle.getString("mknotewebclipper.greeting.label");

    window.alert(message);
  }
};
