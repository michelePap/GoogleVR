var vrView;
var jsonScene;
const projectsFolder = "/GoogleVR/projects/catalogo/home/";
var jsonpath = projectsFolder + "scene.json"

$.getJSON( jsonpath, function( resp ) {
 
    jsonScene = resp;
});

// is_stereo false - immagine convertita
function onLoad() {
  vrView = new VRView.Player('#vrview', {
    image: 'blank.png',
    preview: 'blank.png',
    width: '100%',
    height: 700,
    is_stereo: false,
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
  vrView.getPosition()
  console.log('onHotspotClick', e.id);
  if (e.id == "next") {
    vrView.removeImage("5");

  } else if (e.id == "prev") {

  } else if (e.id) {
    loadScene(e.id);
  }
}

function loadScene(id) {
  console.log('loadScene', id);

  // Set the image
  // is_stereo false - immagine convertita
  vrView.setContent({
    image: projectsFolder + jsonScene.scenes[id].image,
    is_stereo: false,
    is_autopan_off: true
  });

  // Add all the hotspots for the scene
  // newScene e' l'oggetto scena con image e hotspots
  var newScene = jsonScene.scenes[id];
  console.log("oggetto scena", newScene);

  // Object.keys restituisce un array i cui elementi sono stringhe
  // corrispondenti alle proprietà enumerabili dell'oggetto passato come parametro.
  // array con i nomi degli hotspots, corrispondono all'index della scena che caricano
  var sceneHotspots = Object.keys(newScene.hotspots);
  
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

  vrView.addImage("1", {
    src: "../../projects/catalogo/photo/1.jpg",
    pitch: 0,
    yaw: 32,
    width: 0.35,
    height: 0.35,
    distance: 0.8,
  });

  vrView.addImage("2", {
    src: "../../projects/catalogo/photo/2.jpg",
    pitch: 0,
    yaw: 0,
    width: 0.45,
    height: 0.45,
    distance: 0.8,
  });

  vrView.addImage("3", {
    src: "../../projects/catalogo/photo/3.jpg",
    pitch: 12,
    yaw: -25,
    width: 0.15,
    height: 0.15,
    distance: 0.8,
  });

  vrView.addImage("4", {
    src: "../../projects/catalogo/photo/4.jpg",
    pitch: 0,
    yaw: -25,
    width: 0.15,
    height: 0.15,
    distance: 0.8,
  });

  vrView.addImage("5", {
    src: "../../projects/catalogo/photo/5.jpg",
    pitch: -12,
    yaw: -25,
    width: 0.15,
    height: 0.15,
    distance: 0.8,
  });
}

function onVRViewError(e) {
  console.log('Error! %s', e.message);
}

window.addEventListener('load', onLoad);
