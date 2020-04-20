window.onload = () => { startMap() }

let center = {
    lat: -23.561526,
    lng: -46.660127
  };
  function startMap() {
    const map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 12,
        center: center
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
        map.panToBounds(bounds);   
        }
          else if (page === "places") {
          
            let contentString = `<div>${element.name}</div><h3>${element.address}</h3><a href="/places/${element._id}">More Details</a><div><img src="${element.path}"></div>`;

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







  

