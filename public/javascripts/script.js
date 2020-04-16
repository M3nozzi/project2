let center = {
    lat: -23.561526,
    lng: -46.660127
  };
  
  function startMap() {
    const map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 13,
        center: center
      }

      
    );
  
    console.log(window.location.href)
    let page = window.location.href.split('/');
    page = page[page.length -1];
    console.log(page)
    
    axios
      .get('/api')
      .then(data => {
        console.log(data.data[1]._id)
        data.data.forEach(element => {
          if (page === element._id) {
          new google.maps.Marker({
            animation:google.maps.Animation.BOUNCE,
            position: {
              lat: element.location.coordinates[1],
              lng: element.location.coordinates[0]
            },
            map: map,
            title: element.name,
          });
        }
        else if (page === "places") {
          new google.maps.Marker({
            animation:google.maps.Animation.BOUNCE,
            position: {
              lat: element.location.coordinates[1],
              lng: element.location.coordinates[0]
            },
            map: map,
            title: element.name,
          });
        }
        });
      })
      .catch(err => console.log(err))

  }

 
  startMap()

// const geocoder = new google.maps.Geocoder();

// document.getElementById('submit').addEventListener('click', function () {
//   geocodeAddress(geocoder, map);
// });

// function geocodeAddress(geocoder, resultsMap) {
//   let address = document.getElementById('address').value;

//   geocoder.geocode({ 'address': address }, function (results, status) {

//     if (status === 'OK') {
//       resultsMap.setCenter(results[0].geometry.location);
//       let marker = new google.maps.Marker({
//         map: resultsMap,
//         position: results[0].geometry.location
//       });
//       document.getElementById('latitude').value = results[0].geometry.location.lat();
//       document.getElementById('longitude').value = results[0].geometry.location.lng();
//     } else {
//       alert('Geocode was not successful for the following reason: ' + status);
//     }
//   });
// }