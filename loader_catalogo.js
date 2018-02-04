var vrView;
var jsonScene;
var jsonPhoto;
var jsonCategory;
var jsonVideo;
// array con path foto
var photoList;
var photoCategoryList;
var videoCategoryList;
var videoList;
// parametri dei Frame
var imageFrame;
var videoFrame;
// parametri dei 3 imageFrame delle categorie
var photocategoryFrame;
var videocategoryFrame;
// id dei 4 imageFrame in cui caricare le foto
var imageFrameId;
var idphotoCatFrame;
var videoFrameId;
var idvideoCatFrame;
// indici di caricamento
var photoIndex = 0;
var photoCategoryIndex = 0;
var videoIndex = 0;
var videoCategoryIndex = 0;
// usato per evitare conflitti con hotspot foto
var casualNum = 50;
// id attuali hotspot categorie
var catPhotoId = [];
var catVideoId = [];
// indica il primo caricamento
var firstLoad = true;
var firstLoadPhotoCategory = true;
var firstLoadVideoCategory = true;
const projectsFolder = "/GoogleVR/projects/catalogo";
var jsonpathHome = projectsFolder + "/home.json";
var jsonpathPhoto = projectsFolder + "/photo.json";
var jsonpathCategory = projectsFolder + "/category.json";
var jsonpathVideo = projectsFolder + "/video.json";
// hotspot
var next;
var prev;
var nextPhCat;
var prevPhCat;
var nextVidCat;
var prevVidCat;
var nextVd;
var prevVd;
// hotspot status
var nextAdded = true;
var prevAdded = true;

var nextPhCatAdded = true;
var prevPhCatAdded = true;

var nextVideoAdded = true;
var prevVideoAdded = true;

var nextVidCatAdded = true;
var prevVidCatAdded = true;

var simpleRoom = false;

$.getJSON( jsonpathHome, function( resp ) {
  jsonScene = resp;

  imageFrame = jsonScene.scenes[0].image_frame;
  imageFrameId = Object.keys(imageFrame);
  imageFrameId.shift(); // rimuovo il primo imageFrame/left
  videoFrame = jsonScene.scenes[0].video_frame;
  videoFrameId = Object.keys(videoFrame);
  //videoFrameId.shift(); // rimuovo frame centrale

  photocategoryFrame = jsonScene.scenes[0].image_cat_frame;
  idphotoCatFrame = Object.keys(photocategoryFrame);
  videocategoryFrame = jsonScene.scenes[0].video_cat_frame;
  idvideoCatFrame = Object.keys(videocategoryFrame);

  // salvo parametri hotspot
  next = jsonScene.scenes[0].hotspots.next;
  prev = jsonScene.scenes[0].hotspots.prev;
  nextPhCat = jsonScene.scenes[0].hotspots.next_cat;
  prevPhCat = jsonScene.scenes[0].hotspots.prev_cat;
  nextVidCat = jsonScene.scenes[0].hotspots.next_cat_vid;
  prevVidCat = jsonScene.scenes[0].hotspots.prev_cat_vid;
  nextVd = jsonScene.scenes[0].hotspots.next_vid;
  prevVd = jsonScene.scenes[0].hotspots.prev_vid;

});

$.getJSON( jsonpathPhoto, function( resp ) {
  jsonPhoto = resp;
});

$.getJSON( jsonpathCategory, function( resp ) {
  jsonCategory = resp;
  photoCategoryList = jsonCategory.photo_cat;
  videoCategoryList = jsonCategory.video_cat;
});

$.getJSON( jsonpathVideo, function( resp ) {
  jsonVideo = resp;
});

// imposta la categoria delle foto da visualizzare
function setPhotoCategory(category) {
  photoIndex = 0; // reset index
  firstLoad = true;
  photoList = jsonPhoto.photo[category].images;
  setLeftFrame(category);
  loadImage();
}

// imposta la categoria dei video da visualizzare
function setVideoCategory(category) {
  videoIndex = 0;
  var normalCategory = category - casualNum;
  videoList = jsonVideo.video[normalCategory].video;
  loadVideoPreview();
}

function onLoad() {
  vrView = new VRView.Player('#vrview', {
    image: 'blank.png',
    preview: 'blank.png',
    width: '100%',
    height: 700,
    is_stereo: true,
    is_autopan_off: true,
    default_yaw: 0
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
  if(simpleRoom && e.id) {
    loadScene(e.id);

  } else if (e.id === "next") {
    nextImage();

  } else if (e.id === "prev") {
    prevImage();

  } else if (e.id === "next_cat") {
    nextPhotoCategory();

  } else if (e.id === "prev_cat") {
    prevPhotoCategory();

  } else if (e.id === "next_cat_vid") {
    nextVideoCategory();

  } else if (e.id === "prev_cat_vid") {
    prevVideoCategory();

  } else if (e.id === "play") {
    vrView.playVideo();

  } else if (e.id === "pause") {
    vrView.pauseVideo();

  } else if (e.id === "next_vid") {
    nextVideo();

  } else if (e.id === "prev_vid") {
    prevVideo();

  } else if (e.id === "exit") {
    removeImage();
    vrView.removeImage("left_ph");
    removeVideoPreview();

    $.getJSON( "/GoogleVR/projects/catalogo/scene/ninni_2_multi/scene.json", function( resp ) {
      jsonScene = resp;
      simpleRoom = true;
      loadScene(jsonScene.scenes[0].index);
    });

  } else if (e.id) {
    if (e.id >= casualNum) {
      setVideoCategory(e.id);
    } else {
      setPhotoCategory(e.id);
    }
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
function nextPhotoCategory() {
  photoCategoryIndex++;
  loadImageCategory();
}

// visualizza categoria foto precedente
function prevPhotoCategory() {
  if(photoCategoryIndex > 0) {
    photoCategoryIndex--;
    loadImageCategory();
  } else {
    console.log("No category to display");
  }
}

// visualizza categoria video successiva
function nextVideoCategory() {
  videoCategoryIndex++;
  loadVideoCategory();
}

// visualizza categoria video precedente
function prevVideoCategory() {
  if(videoCategoryIndex > 0) {
    videoCategoryIndex--;
    loadVideoCategory();
  } else {
    console.log("No category to display");
  }
}

function nextVideo() {
  videoIndex++;
  loadVideoPreview();
}

function prevVideo() {
  if(videoIndex > 0) {
    videoIndex--;
    loadVideoPreview();
  } else {
    console.log("No video to display");
  }
}

// aggiunge le foto nei frame
function loadImage() {
  var tempIndex = photoIndex;
  // se l'ultima foto e' stata caricata o e' il primo caricamento
  if((tempIndex + imageFrameId.length) <= photoList.length || firstLoad) {
    removeImage();
    $.each(imageFrameId, function(index, value) {
      // se ci sono foto da caricare
      if(tempIndex < photoList.length) {
        // aggiungo e rimuovo gli hotspot dinamicamente
        if(tempIndex === 0) {
          vrView.removeHotspot("prev");
          prevAdded = false;
        } else if(!prevAdded && (tempIndex % 4) === 0) {
          vrView.addHotspot("prev", prev);
          prevAdded = true;
        }

        if(tempIndex === photoList.length - 1) {
          vrView.removeHotspot("next");
          nextAdded = false;
        } else if(!nextAdded && (tempIndex % 4) === 0) {
          vrView.addHotspot("next", next);
          nextAdded = true;
        }
        vrView.addImage(value, {
          src: projectsFolder + photoList[tempIndex].value,
          pitch: imageFrame[value].pitch,
          yaw: imageFrame[value].yaw,
          width: imageFrame[value].width,
          height: imageFrame[value].height,
          distance: imageFrame[value].distance
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

function loadVideoPreview() {
  var tempIndex = videoIndex;
  if(tempIndex < videoList.length) {
    removeVideoPreview();
    // aggiungo e rimuovo gli hotspot dinamicamente
    if(tempIndex === 0) {
      vrView.removeHotspot("prev_vid");
      prevVideoAdded = false;
    } else {
      if(!prevVideoAdded) {
        vrView.addHotspot("prev_vid", prevVd);
        prevVideoAdded = true;
      }
    }
    if(tempIndex === (videoList.length - 1)) {
      vrView.removeHotspot("next_vid");
      nextVideoAdded = false;
    } else {
      if(!nextVideoAdded) {
        vrView.addHotspot("next_vid", nextVd);
        nextVideoAdded = true;
      }
    }
    $.each(videoFrameId, function(index, value) {
      if(tempIndex < videoList.length) {
        if(index === 0) {
          var videopath = videoList[tempIndex].value;
          var videoName = videopath.replace("png", "mp4");
          vrView.addVideo(value, {
            src: projectsFolder + videoName,
            pitch: videoFrame[value].pitch,
            yaw: videoFrame[value].yaw,
            width: videoFrame[value].width,
            height: videoFrame[value].height,
            distance: videoFrame[value].distance
          });
        } else {
          vrView.addImage(value, {
            src: projectsFolder + videoList[tempIndex].value,
            pitch: videoFrame[value].pitch,
            yaw: videoFrame[value].yaw,
            width: videoFrame[value].width,
            height: videoFrame[value].height,
            distance: videoFrame[value].distance
          });
        }
        tempIndex++;
      } else {
        return false;
      }
    });
  } else {
    console.log("No video to display");
    videoIndex--;
  }
}

// aggiunge foto left imageFrame - fissa durante lo scorrimento
function setLeftFrame(category) {

  vrView.removeImage("left_ph");

  vrView.addImage("left_ph", {
    src: projectsFolder + photoCategoryList[category].value,
    pitch: imageFrame["left_ph"].pitch,
    yaw: imageFrame["left_ph"].yaw,
    width: imageFrame["left_ph"].width,
    height: imageFrame["left_ph"].height,
    distance: imageFrame["left_ph"].distance
  });
}

// rimuove tutte le foto dei quattro imageFrame
function removeImage() {
  $.each(imageFrameId, function(index, value) {
    vrView.removeImage(value);
  });
}

// rimuove gli hotspot delle categorie delle foto
function removePhotoCatHotspots() {
  $.each(catPhotoId, function(index, value) {
    vrView.removeHotspot(value);
  });
  catPhotoId = [];
}

// rimuove gli hotspot delle categorie dei video
function removeVideoCatHotspots() {
  $.each(catVideoId, function(index, value) {
    vrView.removeHotspot(value);
  });
  catVideoId = [];
}

// rimuove le anteprime dei video
function removeVideoPreview() {
  $.each(videoFrameId, function(index, value) {
    vrView.removeImage(value);
  });
}

// aggiunge gli hotspot delle categorie delle foto
function loadImageCategory() {
  var tempIndex = photoCategoryIndex;
  // se l'ultima categoria e' stata caricata o e' il primo caricamento
  if((tempIndex + idphotoCatFrame.length) <= photoCategoryList.length || firstLoadPhotoCategory) {
    removePhotoCatHotspots();
    $.each(idphotoCatFrame, function( index, value) {
      // se ci sono categorie da caricare
      if(tempIndex < photoCategoryList.length) {
        // aggiungo e rimuovo gli hotspot per scorrere le categorie
        if(tempIndex === 0) {
          vrView.removeHotspot("prev_cat");
          prevPhCatAdded = false;
        } else if(!prevPhCatAdded && (tempIndex % 3) === 0) {
          vrView.addHotspot("prev_cat", prevPhCat);
          prevPhCatAdded = true;
        }
        if(tempIndex === photoCategoryList.length - 1) {
          vrView.removeHotspot("next_cat");
          nextPhCatAdded = false;
        } else if(!nextPhCatAdded && (tempIndex % 3) === 0) {
          vrView.addHotspot("next_cat", nextPhCat);
          nextPhCatAdded = true;
        }
        vrView.addHotspot(tempIndex, {
          pitch: photocategoryFrame[value].pitch,
          yaw: photocategoryFrame[value].yaw,
          distance: photocategoryFrame[value].distance,
          image: projectsFolder + photoCategoryList[tempIndex].value,
          width: photocategoryFrame[value].width,
          height: photocategoryFrame[value].height
        });
        // salvo id hotspot aggiunto
        catPhotoId.push(tempIndex);
        tempIndex++;
      } else {
        return false;
      }
    });
    firstLoadPhotoCategory = false;

  } else {
    console.log("No category to display");
    photoCategoryIndex--;
  }
}

// aggiunge gli hotspot delle categorie dei video
function loadVideoCategory() {
  var tempIndex = videoCategoryIndex;
  // se l'ultima categoria e' stata caricata o e' il primo caricamento
  if((tempIndex + idvideoCatFrame.length) <= videoCategoryList.length || firstLoadVideoCategory) {
    removeVideoCatHotspots();
    var hotspotID;
    $.each(idvideoCatFrame, function( index, value) {
      // se ci sono categorie da caricare
      if(tempIndex < videoCategoryList.length) {
        // aggiungo e rimuovo gli hotspot dinamicamente
        if(tempIndex === 0) {
          vrView.removeHotspot("prev_cat_vid");
          prevVidCatAdded = false;
        } else if(!prevVidCatAdded && (tempIndex % 3) == 0) {
          vrView.addHotspot("prev_cat_vid", prevVidCat);
          prevVidCatAdded = true;
        }

        if(tempIndex === videoCategoryList.length - 1) {
          vrView.removeHotspot("next_cat_vid");
          nextVidCatAdded = false;
        } else if(!nextVidCatAdded && (tempIndex % 3) === 0) {
          vrView.addHotspot("next_cat_vid", nextVidCat);
          nextVidCatAdded = true;
        }
        hotspotID = tempIndex + casualNum;
        vrView.addHotspot(hotspotID, {
          pitch: videocategoryFrame[value].pitch,
          yaw: videocategoryFrame[value].yaw,
          distance: videocategoryFrame[value].distance,
          image: projectsFolder + videoCategoryList[tempIndex].value,
          width: videocategoryFrame[value].width,
          height: videocategoryFrame[value].height
        });
        catVideoId.push(hotspotID);
        tempIndex++;
      } else {
        return false;
      }
    });
    firstLoadVideoCategory = false;

  } else {
    console.log("No category to display");
    videoCategoryIndex--;
  }
}

function loadScene(id) {
  console.log('loadScene', id);

  // Set the image
  vrView.setContent({
    image: projectsFolder + jsonScene.scenes[id].image,
    is_stereo: true,
    is_autopan_off: true,
    default_yaw: 0
  });

  // Tutti gli hotspot della scena
  var hotspots = jsonScene.scenes[id].hotspots;
  // array con i nomi degli hotspots, corrispondono all'index della scena che caricano
  var sceneHotspots = Object.keys(hotspots);
  $.each(sceneHotspots, function( index, value ) {

    if(simpleRoom) {
      vrView.addHotspot(value, {
        pitch: hotspots[value].pitch,
        yaw: hotspots[value].yaw,
        radius: hotspots[value].radius,
        distance: hotspots[value].distance
      });
    } else {
      vrView.addHotspot(value, {
        pitch: hotspots[value].pitch,
        yaw: hotspots[value].yaw,
        distance: hotspots[value].distance,
        image: hotspots[value].image,
        width:hotspots[value].width,
        height: hotspots[value].height
      });
    }
  });

  /*vrView.addImage("test", {
    src: projectsFolder + "/category/Industria.jpg",
    pitch: 0,
    yaw: 240,
    width: 0.26,
    height: 0.35,
    distance: 0.9
  });*/

  if(!simpleRoom) {
    var start_category = 0;
    setPhotoCategory(start_category);
    loadImageCategory();
    setVideoCategory(casualNum);
    loadVideoCategory();
  }
}

function onVRViewError(e) {
  console.log('Error! %s', e.message);
}

window.addEventListener('load', onLoad);
