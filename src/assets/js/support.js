var screen_id=null;
/*function start(){
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
  
  /*  if(availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
      $(".button").removeAttr("disabled").text("Start");
    }
  }*/
  
  function onError(e) {
    console.log('onError', e);
  }
  
  function onSessionRequestSuccess(session) {
    console.log('onSessionRequestSuccess', session);
    //
    var mediaInfo = new chrome.cast.media.MediaInfo(
      "https://canadisplay.com/assets/screens/"+screen_id+".png"
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
  
  function castContent(screen_id) {
    console.log("cast url : ","https://canadisplay.com/assets/screens/"+screen_id+".png");
    setTimeout( chrome.cast.requestSession(onSessionRequestSuccess, onError), 2000);
  }

  window.argsSet = function(screen_id) {
    this.screen_id=screen_id;
    castContent(screen_id);
    console.log('X args', this.screen_id);
    return false; 
} 