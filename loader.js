var vrView;
var jsonScene;
const projectsFolder = "/GoogleVR/projects/";

$.getJSON( jsonpath, function( resp ) {

  jsonScene = resp;
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
  loadScene(jsonScene.scenes[0].index);
}

function onModeChange(e) {
  console.log('onModeChange', e.mode);
}

function onGetPosition(e) {
  console.log(e);

}

function onHotspotClick(e) {
  vrView.getPosition();
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
    image: projectsFolder + folder + "/" + jsonScene.scenes[id].image,
    is_stereo: true,
    is_autopan_off: true
  });

  // Tutti gli hotspot della scena
  var hotspots = jsonScene.scenes[id].hotspots;

  // array con i nomi degli hotspots, corrispondono all'index della scena che caricano
  var sceneHotspots = Object.keys(hotspots);
  $.each(sceneHotspots, function( index, value ) {

    vrView.addHotspot(value, {
      pitch: hotspots[value].pitch,
      yaw: hotspots[value].yaw,
      radius: hotspots[value].radius,
      distance: hotspots[value].distance
    });
  });
}

function onVRViewError(e) {
  console.log('Error! %s', e.message);
}

window.addEventListener('load', onLoad);
