var screen_id=null;
function start(){
    var initializeCastApi = function() {
    console.log('initializeCastApi');
  
    var sessionRequest = new chrome.cast.SessionRequest(
      chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
    var apiConfig = new chrome.cast.ApiConfig(
      sessionRequest, sessionListener, receiverListener);
    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
  };
  
  if (!chrome.cast || !chrome.cast.isAvailable) {
    setTimeout(initializeCastApi, 1000);
    }
  }

  
  function onInitSuccess() {
    console.log('onInitSuccess');
  }
  
  function onError(e) {
    console.log('onError', e);
  }
  
  function sessionListener(e) {
    console.log('sessionListener', e);
  }

  function receiverListener(availability) {
    console.log('receiverListener', availability);
  
    if(availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
      $(".button").removeAttr("disabled").text("Start");
    }
  }
  
  function onSessionRequestSuccess(session) {
    console.log('onSessionRequestSuccess', session);
    //
    var mediaInfo = new chrome.cast.media.MediaInfo(
      "http://35.184.95.5/assets/screens/"+screen_id+".png"
      /*"https://menubord-app.web.app/assets/screens/s005.PNG",
      "image/PNG");
      `http://localhost:4200/assets/screens/${{screen_id}}.PNG`,
      "image/PNG"
      `../screens/android004.png`*/
      );
    console.log("cast success");
    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    session.loadMedia(request, onMediaLoadSuccess, onError);
    session.setTimeout(17000);
  }
  
  function onMediaLoadSuccess(e) {
    console.log('onMediaLoadSuccess', e);
    //var idleInterval = setInterval(timerIncrement, 60000); // 1 minute
  }

  function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 4) { // 5 minutes
        context.stop();
    }
  }
  
 /* function castContent() {
    //this.screen_id=sid;
    chrome.cast.requestSession(onSessionRequestSuccess, onError);
  }*/

  window.castContent = function(screen_id) {
    this.screen_id=screen_id;
    console.log('X args', this.screen_id);
    chrome.cast.requestSession(onSessionRequestSuccess, onError);
}