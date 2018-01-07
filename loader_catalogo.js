var vrView;
var jsonScene;
var jsonPhoto;
var jsonCategory;
// array con path foto
var photoList;
var photoCategoryList;
// parametri dei 5 frame
var frame;
// parametri dei 3 frame delle categorie
var photocategoryFrame;
// id dei 4 frame in cui caricare le foto
var sceneFrame;
var categoryFrame;
// indice di photoList dal quale
// iniziare a caricare le foto
var photoIndex = 0;
var categoryIndex = 0;
// id attuali hotspot categorie foto
var catPhotoId = new Array();
// indica il primo caricamento
var firstLoad = true;
var firstLoadPhotoCategory = true;
const projectsFolder = "/GoogleVR/projects/catalogo";
var jsonpathHome = projectsFolder + "/home.json";
var jsonpathPhoto = projectsFolder + "/photo.json";
var jsonpathCategory = projectsFolder + "/category.json";

$.getJSON( jsonpathHome, function( resp ) {
  jsonScene = resp;

  frame = jsonScene.scenes[0].image_frame;
  sceneFrame = Object.keys(frame);
  sceneFrame.shift(); // rimuovo il primo frame/left

  photocategoryFrame = jsonScene.scenes[0].image_cat_frame;
  categoryFrame = Object.keys(photocategoryFrame);
});

$.getJSON( jsonpathPhoto, function( resp ) {
  jsonPhoto = resp;
});

$.getJSON( jsonpathCategory, function( resp ) {
  jsonCategory = resp;
  photoCategoryList = jsonCategory.photo_cat;
});

// imposta la categoria delle foto da visualizzare
function setPhotoCategory(category) {
  photoIndex = 0; // reset index
  firstLoad = true;
  photoList = jsonPhoto.photo[category].images;
  setLeftFrame(category);
  loadImage();
}

function onLoad() {
  vrView = new VRView.Player('#vrview', {
    image: 'blank.png',
    preview: 'blank.png',
    width: '100%',
    height: 700,
    is_stereo: false, // is_stereo false - immagine convertita
    is_autopan_off: true,
    default_yaw: -90
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

  } else if (e.id == "next_cat") {
    nextCategory();

  } else if (e.id == "prev_cat") {
    prevCategory();

  } else if (e.id) {
    setPhotoCategory(e.id);
  }
}

// visualizza foto successiva
function nextImage() {
  photoIndex++;
  loadImage();
}

// visualizza foto precedente
function prevImage() {
  // se ci sono foto precedenti
  if(photoIndex > 0) {
    photoIndex--;
    loadImage();
  } else {
    console.log("No photo to display");
  }
}

// visualizza categoria foto successiva
function nextCategory() {
  categoryIndex++;
  loadImageCategory();
}

// visualizza categoria foto precedente
function prevCategory() {
  if(categoryIndex > 0) {
    categoryIndex--;
    loadImageCategory();
  } else {
    console.log("No category to display");
  }
}

// aggiunge le foto nei frame
function loadImage() {
  var tempIndex = photoIndex;
  // se l'ultima foto e' stata caricata o e' il primo caricamento
  if((tempIndex + sceneFrame.length) <= photoList.length || firstLoad) {
    removeImage();
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
    firstLoad = false;

  } else {
    console.log("No photo to display");
    photoIndex--;
  }
}

// aggiunge foto left frame - fissa durante lo scorrimento
function setLeftFrame(category) {
  vrView.removeImage("left");

  vrView.addImage("left", {
    src: projectsFolder + photoCategoryList[category].value,
    pitch: frame["left"].pitch,
    yaw: frame["left"].yaw,
    width: frame["left"].width,
    height: frame["left"].height,
    distance: frame["left"].distance
  });
}

// rimuove tutte le foto dei quattro frame
function removeImage() {
  $.each(sceneFrame, function( index, value) {
    vrView.removeImage(value);
  });
}

// rimuove gli hotspot delle categorie delle foto
function removePhotoCatHotspots() {
  $.each(catPhotoId, function( index, value ) {
    vrView.removeHotspot(value);
  });
  catPhotoId = new Array();
}

// aggiunge gli hotspot delle categorie delle foto
function loadImageCategory() {
  var tempIndex = categoryIndex;
  // se l'ultima categoria e' stata caricata o e' il primo caricamento
  if((tempIndex + categoryFrame.length) <= photoCategoryList.length || firstLoadPhotoCategory) {
    removePhotoCatHotspots();
    $.each(categoryFrame, function( index, value) {
      // se ci sono categorie da caricare
      if(tempIndex < photoCategoryList.length) {
        vrView.addHotspot(tempIndex, {
          pitch: photocategoryFrame[value].pitch,
          yaw: photocategoryFrame[value].yaw,
          distance: photocategoryFrame[value].distance,
          image: projectsFolder + photoCategoryList[tempIndex].value,
          width: photocategoryFrame[value].width,
          height: photocategoryFrame[value].height
        });
        catPhotoId.push(tempIndex);
        tempIndex++;
      } else {
        return false;
      }
    });
    firstLoadPhotoCategory = false;

  } else {
    console.log("No photo to display");
    categoryIndex--;
  }
}

function loadScene(id) {
  console.log('loadScene', id);

  // Set the image
  // is_stereo false - immagine convertita
  vrView.setContent({
    image: projectsFolder + jsonScene.scenes[id].image,
    is_stereo: false,
    is_autopan_off: true,
    default_yaw: -90
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

  var start_category = 0;
  setPhotoCategory(start_category);
  loadImageCategory();
}

function onVRViewError(e) {
  console.log('Error! %s', e.message);
}

window.addEventListener('load', onLoad);
