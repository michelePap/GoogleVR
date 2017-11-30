var vrView;
var actualJSON;

$.getJSON( jsonpath, function( resp ) {
 
    actualJSON = resp;
    //console.log("JSON", actualJSON);
});

function onLoad() {
  vrView = new VRView.Player('#vrview', {
    image: 'blank.png',
    preview: 'blank.png',
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
  loadScene(actualJSON.scenes[0].index);
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
  // aggiunge il percorso relativo alla cartella del progetto
  vrView.setContent({
    image: "/projects/" + folder + "/" + actualJSON.scenes[id].image,
    is_stereo: true,
    is_autopan_off: true
  });

  // Add all the hotspots for the scene
  // newScene e' l'oggetto scena con image e hotspots
  var newScene = actualJSON.scenes[id];
  console.log("oggetto scena", newScene);

  // Object.keys restituisce un array i cui elementi sono stringhe
  // corrispondenti alle proprietà enumerabili dell'oggetto passato come parametro
  // array con i nomi degli hotspots, corrispondono all'index della scena che caricano
  var sceneHotspots = Object.keys(newScene.hotspots);
  console.log(sceneHotspots);
  
  $.each( sceneHotspots, function( index, value ){
    var hotspotName = value;
    var hotspot = newScene.hotspots[hotspotName];

    vrView.addHotspot(hotspotName, {
      pitch: hotspot.pitch,
      yaw: hotspot.yaw,
      radius: hotspot.radius,
      distance: hotspot.distance
    });
  });
}

function onVRViewError(e) {
  console.log('Error! %s', e.message);
}

window.addEventListener('load', onLoad);
