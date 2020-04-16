let center = {
    lat: -23.561526,
    lng: -46.660127
  };

function startMap() {
    
   map = new google.maps.Map(
      
    document.getElementById('map'), {
    zoom: 13,
    center: center
  }
 
  ); //closes map



    console.log(window.location.href)
    let page = window.location.href.split('/');
    page = page[page.length -1];
    // console.log(page)
    
    axios
      .get('/api')
      .then(data => {
        // console.log(data.data[1]._id)
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

