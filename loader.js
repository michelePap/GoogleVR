var vrView;
var actualJSON;
init();

function loadJSON(callback) {   

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType("application/json");
    xmlhttp.open('GET', jsonpath, true); // false per caricamento sincrono (aspetto la risposta del server)
    xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState == 4 && xmlhttp.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xmlhttp.responseText);
          }
    };
    xmlhttp.send(null);  
 }

 function init() {
 loadJSON(function(response) {
  // Parse JSON string into object
  // funzione nativa
    actualJSON = JSON.parse(response);

    console.log(actualJSON);
 });
}

function onLoad() {
  vrView = new VRView.Player('#vrview', {
    image: '../vrview-master/examples/hotspots/blank.png',
    preview: '../vrview-master/examples/hotspots/blank.png',
    width: '100%',
    height: 700,
    is_stereo: true,
    is_autopan_off: true
  });

  vrView.on('ready', onVRViewReady);
  vrView.on('modechange', onModeChange);
  vrView.on('click', onHotspotClick);
  vrView.on('error', onVRViewError);
  vrView.on('getposition', onGetPosition);
}

function onVRViewReady(e) {
  console.log('onVRViewReady');
  loadScene(actualJSON.scenes[0].name);
}

function onModeChange(e) {
  console.log('onModeChange', e.mode);
}

function onGetPosition(e) {
  console.log(e);

}

function onHotspotClick(e) {
  vrView.getPosition()
  console.log('onHotspotClick', e.id);
  if (e.id) {
    loadScene(e.id);
  }
}

function loadScene(id) {
  console.log('loadScene', id);

  // Set the image
  vrView.setContent({
    image: actualJSON[id].image,
    image: actualJSON.scenes,
    is_stereo: true,
    is_autopan_off: true
  });

  // Add all the hotspots for the scene
  var newScene = actualJSON[id]; //newScene e' l'oggetto scena con image e hotspots
  console.log("oggetto scena", newScene);

  //Object.keys restituisce un array i cui elementi sono stringhe
  //corrispondenti alle proprietà enumerabili dell'oggetto passato come parametro
  var sceneHotspots = Object.keys(newScene.hotspots);
  console.log(sceneHotspots);
  
  for (var i = 0; i < sceneHotspots.length; i++) {

    var hotspotName = sceneHotspots[i];
    console.log(hotspotName);

    var hotspot = newScene.hotspots[hotspotName];
    //console.log(hotspot);

    vrView.addHotspot(hotspotName, {
      pitch: hotspot.pitch,
      yaw: hotspot.yaw,
      radius: hotspot.radius,
      distance: hotspot.distance
    });
  }
}

function onVRViewError(e) {
  console.log('Error! %s', e.message);
}

window.addEventListener('load', onLoad);
