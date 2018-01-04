var vrView;
var jsonScene;
var jsonPhoto;
// array con path foto
var photoList;
// parametri dei 5 frame
var frame;
// id dei 4 frame in cui caricare le foto
var sceneFrame;
// indice di photoList dal quale
// iniziare a caricare le foto
var photoIndex = 1;
// indica il primo caricamento
var firstLoad = true;
const projectsFolder = "/GoogleVR/projects/catalogo";
var jsonpathHome = projectsFolder + "/home.json";
var jsonpathPhoto = projectsFolder + "/photo.json";

$.getJSON( jsonpathHome, function( resp ) {
  jsonScene = resp;
  frame = jsonScene.scenes[0].image_frame;
  sceneFrame = Object.keys(frame);
    sceneFrame.shift(); // rimuovo il primo frame/left
  });

$.getJSON( jsonpathPhoto, function( resp ) {
  jsonPhoto = resp;
  setPhotoCategory(0);
});

function setPhotoCategory(category) {
  photoList = jsonPhoto.photo[category].images;
}

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
    nextImage();

  } else if (e.id == "prev") {
    prevImage();

  } else if (e.id == "cat") {
    console.log("CAT1");

  } else if (e.id) {
    loadScene(e.id);
  }
}

// visualizza foto successiva
function nextImage() {
  photoIndex++;
  addAllImage();
}

// visualizza foto precedente
function prevImage() {
  // se ci sono foto precedenti
  if(photoIndex > 1) {
    photoIndex--;
    addAllImage();
  } else {
    console.log("No photo to display");
  }
}

// carica le foto nei frame
function addAllImage() {
  var tempIndex = photoIndex;
  // se l'ultima foto e' stata caricata o e' il primo caricamento
  if((tempIndex + sceneFrame.length) <= photoList.length || firstLoad) {
    $.each(sceneFrame, function( index, value) {
      // se ci sono foto da caricare
      if(tempIndex < photoList.length) {
        vrView.addImage(value, {
          src: projectsFolder + photoList[tempIndex].value,
          pitch: frame[value].pitch,
          yaw: frame[value].yaw,
          width: frame[value].width,
          height: frame[value].height,
          distance: frame[value].distance
        });
        tempIndex++;
      } else {
        return false;
      }
    });

    if(!firstLoad) {
      console.log("Remove all photos");
      removeAllImage();
    }
    firstLoad = false;

  } else {
    console.log("No photo to display");
    photoIndex--;
  }
}

function removeAllImage() {
  $.each(sceneFrame, function( index, value) {
    vrView.removeImage(value);
  });
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

  // imposto foto del primo fisso che rimane fissa
  vrView.addImage("left", {
    // GoogleVR/projects/catalogo + /photo/1.jpg
    src: projectsFolder + photoList[0].value,
    pitch: frame["left"].pitch,
    yaw: frame["left"].yaw,
    width: frame["left"].width,
    height: frame["left"].height,
    distance: frame["left"].distance
  });
  addAllImage();

  vrView.addHotspot("cat", {
    pitch: -39,
    yaw: -73,
    radius: 0.05,
    distance: 1,
    image: projectsFolder + "/category/Industria.jpg"
  });
}

function onVRViewError(e) {
  console.log('Error! %s', e.message);
}

window.addEventListener('load', onLoad);