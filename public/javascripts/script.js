window.onload = () => { startMap() }

let center = {
    lat: -23.561526,
    lng: -46.660127
  };
  function startMap() {
    const map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 11,
        center: center,
        styles: [
          {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
          }
        ]
      }
      
    );
    bounds  = new google.maps.LatLngBounds();
    
    let page = window.location.href.split('/');
    page = page[page.length -1];
    axios
      .get('/api')
      .then(data => {
        data.data.forEach(element => {
          if (page === element._id) {
        let marker =  new google.maps.Marker({
            animation:google.maps.Animation.BOUNCE,
            position: {
              lat: element.location.coordinates[1],
              lng: element.location.coordinates[0]
            },
            map:map,
            title: element.name,
        });
            
        loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        bounds.extend(loc);
            
            map.fitBounds(bounds);
            var listener = google.maps.event.addListener(map, "idle", function() { 
              if (map.getZoom() > 18) map.setZoom(18); 
              google.maps.event.removeListener(listener); 
            });    
        map.panToBounds(bounds);   
        }
          else if (page === "places") {
          
            let contentString = `<div class="inforWindow"><h1 class="element-name">${element.name}</h1><h3 class="element-address">${element.address}</h3><img class="element-img" src="${element.path}"><br><a class="element-a" href="/places/${element._id}"><b>More Details</b></a></div>`;

            let infoWindow = new google.maps.InfoWindow({
              content: contentString
            });

          let marker = new google.maps.Marker({
            animation:google.maps.Animation.BOUNCE,
            position: {
              lat: element.location.coordinates[1],
              lng: element.location.coordinates[0]
            },
            map: map,
            title: element.name,
          });
          
            marker.addListener('click', function () {
              infoWindow.open(map, marker)
            });
            
          } 
        });
      })
      .catch(err => console.log(err))
  }
  const address = document.getElementById('address');
const geocoder = new google.maps.Geocoder();
if (address) {
  address.addEventListener('focusout', function () {
    geocodeAddress(geocoder);
  });
}
function geocodeAddress(geocoder) {
  let myAddress = address.value;
  geocoder.geocode({ 'address': myAddress }, function (results, status) {
    if (status === 'OK') {
      console.log(results)
      document.getElementById('latitude').value = results[0].geometry.location.lat();
      document.getElementById('longitude').value = results[0].geometry.location.lng();
    }
    else {
      // alert('Geocode was not successful for the following reason: ' + status);
      alert('Insert a valid address')};
  });
}







  

