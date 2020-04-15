
  const center = {
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

    axios
      .get('/api')
      .then(data => {
        data.data.forEach(element => {
          new google.maps.Marker({
            position: {
              lat: element.location.coordinates[1],
              lng: element.location.coordinates[0]
            },
            animation: google.maps.Animation.BOUNCE,
            map: map,
            title: element[name],
          });
        }); 
          
  
      })
      .catch(err => console.log(err))
    
  }//closes startMap function

  startMap()
