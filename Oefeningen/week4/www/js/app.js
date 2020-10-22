var $$ = Dom7;

var app = new Framework7({
  root: '#app', // App root element

  id: 'be.mydomain_lingxu.f7Cordova2021', // App bundle ID
  name: 'F7Cordova2021', // App name
  theme: 'auto', // Automatic theme detection

  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
      // Demo products for Catalog section
      products: [
        {
          id: '1',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '2',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '3',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ]
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,


  // Input settings
  input: {
    scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
    scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
    },
    pageInit: function (page) {
      // andere methode om functies aan een knop te hangen
      if (page.route.name === "gegevens") {
          getList();
          $$('#btnVoegToe').on('click', function () {
            voegToe();
          });
      }
    }
  },
});

function showLocation(position) {
  if(app.view.current.router.url == "/locatie/") {
    // success functie

    $$("#locatieResultaat").html(
      `<p>Latitude: ${position.coords.latitude}</p>
      <p>Longitude: ${position.coords.longitude}</p>
      <p>Accuracy: ${position.coords.accuracy}m.</p>
      <p>Timestamp: ${new Date(position.timestamp)}</p>
      <p>Distance To Brussel:\n ${DistanceToBrussel(position.coords.latitude,position.coords.longitude)} metres</p>`
    );
  }
}

function DistanceToBrussel(lat2, lon2) {
  let latBrussel = 50.8504500; // Brussel Latitude: 50.8504500
  let lonBrussel = 4.3487800; // Brussel Longitude: 4.3487800

  const R = 6371e3; // metres
  const φ1 = latBrussel * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-latBrussel) * Math.PI/180;
  const Δλ = (lon2-lonBrussel) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres

  return d;
}


function positionError(error) {
  console.log('Error occurred. Error code: ' + error.code);
  // error.code can be:
  //   0: unknown error
  //   1: permission denied
  //   2: position unavailable (error response from location provider)
  //   3: timed out
  switch(error.code){
      case 0:
          // unknown error
          app.dialog.alert('Onbekend probleem bij het bepalen van je positie. Zorg er voor dat de positiebepaling van je toestel actief is.', 'Positie probleem');
      case 1:
          // permission denied
          app.dialog.alert('Het spijt me, maar ik ga je moeten blijven pesten als je geen toestemming geeft om je positie te zien. Als je wilt, kan je de pagina herladen en eventueel de geschiedenis van je browser wissen. Het laatste uur is meer dan voldoende. <b>iPhone</b> : zorg er voor dat je locatie toestemming in het algemeen EN locatie toestemming aan Safari geeft.', 'Positie toelating probleem');
      case 2:
          // position unavailable (error response from location provider)
          app.dialog.alert('Je positie is niet beschikbaar. Zorg er voor dat de positiebepaling van je toestel actief is.', 'Positie niet beschikbaar');
      case 3:
          // timed out
          app.dialog.alert('Het duurt te lang om je positie te vinden. Zit je in een tunnel? Of zit je nog in de school? Op een heel aantal toestellen kan de positie sneller bepaald worden als je ook je wifi aanzet.', 'Positie timeout');
  }

};

// ---------- uitbreiding voorbeeld stap-4 gegevens ---------------- //

let apiAddress = "http://mydomain-lingxu.be/WM/les2/deel2/testdb.php?";

let opties = {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "omit", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
};

function getList() {

  opties.body = JSON.stringify({
    bewerking: "get",
    table: "producten2",
    format: "json"
  }); 

  fetch(apiAddress, opties)
  .then(function(response) {
      return response.json();
  })
  .then(function(responseData){
      // de verwerking van de data
      var list = responseData.data;
      if (list.length > 0) {
          // er zit minstens 1 item in list, we geven dit ook onmiddelijk weer
      
          let tlines ='';

          for (let i = 0, len = list.length; i < len; i++) {
              tlines += 
              `<div class='row'>
                <span class='col'>${list[i].PR_naam}</span>
                <span class='col'>Price: ${list[i].prijs}</span>
                <button onClick='DeleteProduct(${list[i].PR_ID});' class='button button-fill button-raised button-small color-orange col'>x</button>
              </div>`;
          }
          $$("#pList").html(tlines);
      } else {
          app.dialog.alert("Server data kon niet opgevraagd worden");
      }
  })
  .catch(function(error) {
      // verwerk de fout
      app.dialog.alert("fout : " + error);
  });

  return true;
}

function DeleteProduct(id) {
  // onze php api verwacht een paar parameters
  // we voegen deze toe aan de body van de opties
  // body data type must match "Content-Type" header

  opties.body = JSON.stringify({
    id: id,
    bewerking: "delete",
    table: "producten2",
    format: "json"
  }); 

  fetch(apiAddress, opties)
  .then(function(response) {
    return response.json();
  })
  .then(function(responseData){
    if (responseData.error == undefined){
      app.dialog.alert(responseData.message + " - STATUS: " + responseData.status);
      getList();
    }else {
      app.dialog.alert("fout : " + responseData.error);
    }
  })
  .catch(function(error) {
      // verwerk de fout
      app.dialog.alert("fout : " + errorThrown)
  });
}

function voegToe() {
  // onze php api verwacht een paar parameters
  // we voegen deze toe aan de body van de opties
  // body data type must match "Content-Type" header
    let cat = $$('input[name=categorie]:checked').val();
    opties.body = JSON.stringify({
    PR_CT_ID: (cat == "fruit" ? 1 : 2),
    PR_naam: $$("#PR_naam").val(),
    prijs: $$("#prijs").val(),
    bewerking: "add",
    table: "producten2",
    format: "json"
  }); 

  // test de api
  fetch(apiAddress, opties)
  .then(function(response) {
    return response.json();
  })
  .then(function(responseData){
    if (responseData.status === "fail") {
      app.dialog.alert("Sorry, probeer nog een keer met meer data ...", responseData.error);
    } else {
      app.dialog.alert(responseData.message);
    }
    getList();
         
  })
  .catch(function(error) {
    // verwerk de fout
    app.dialog.alert('POST failed. :' + errorThrown, "Toevoegen is niet gelukt");
  });
}

// ---------- extra plugin ---------------- //



function takePicture() {
  var options = {
    // Some common settings are 20, 50, and 100
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    // In this app, dynamically set the picture source, Camera or photo gallery
    sourceType: Camera.PictureSourceType.CAMERA,
    encodingType: Camera.EncodingType.PNG,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: false,
    correctOrientation: true
  }
  
  navigator.camera.getPicture(
    function ftw(imageUri) {
      $$("#cameraResultaat").html(`<img id="camImg" src="${imageUri}" alt="" style="height:600px;width:315px;" >`);
    }, 
    
  function wtf(imgUri){
    app.dialog.alert("error"); 
    console.log(imageUri);
  },
   options);
}


