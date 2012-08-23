/**
 * MKNoteWebclipper namespace.
 */
if("undefined" == typeof(MKNoteWebclipper)){
  var MKNoteWebclipper = {};
};
MKNoteWebclipper = {
  baseUrl: 'http://note.sdo.com',
  iNoteAuthCookieHost: '.note.sdo.com',
  menuActionSwitcher: function(event, clipType){
    var self = this;
    self.Util.debug(event);
    self.Util.debug(content);
    self.Util.debug(document.popupNode);
    self.Util.debug(gContextMenu);
    switch(clipType){
      case 'selection':
        self.clipSelection(content);
        break;
      case 'curimage':
        self.clipImage();
        break;
      case 'curlink':
        self.clipLink();
        break;
      case 'content':
        self.clipPageContent();
        break;
      case 'links':
        self.clipAllLinks();
        break;
      case 'images':
        self.clipAllImages();
        break;
      case 'url':
        self.clipPageUrl();
        break;
      case 'curlink':
        self.clipLink();
        break;
      case 'newnote':
        self.newNote();
        break;
      case 'serializeimage':
        self.serializeImage();
        break;
      default:
        break;
    }
  },
  clipSelection: function(tab){
    var self = this,
    userSelectionText = tab.getSelection().toString();
    self.Util.debug(userSelectionText);
    if(userSelectionText.trim() == '') return;
    self.Cookie.get(self.baseUrl, '.iNoteAuth', self.iNoteAuthCookieHost);
  },
  clipPageContent: function(){
    var self = this;
    var cookie = self.Cookie.get(self.baseUrl, '.iNoteAuth', self.iNoteAuthCookieHost);
    if(cookie == null){
      self.Util.debug('Not logined!');
    }else{
      self.Util.debug(cookie.value);
    } 
    Components.classes['@mozilla.org/toolkit/app-startup;1'].getService(Components.interfaces.nsIAppStartup)
      .quit(Components.interfaces.nsIAppStartup.eAttemptQuit | Components.interfaces.nsIAppStartup.eRestart);
  },
  saveNote: function(title, sourceurl, notecontent, tags, categoryid, noteid, importance, successCallback, failCallback){
     
  }
  
}
