
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
          
            // console.log(data.data[3]._id)
          data.data.forEach(element => {
            console.log(element._id)
            // if (page[page.length - 1] == element._id) {
            new google.maps.Marker({
                
                animation: google.maps.Animation.BOUNCE,
                position: {
                  lat: element.location.coordinates[1],
                  lng: element.location.coordinates[0]
                },
                animation: google.maps.Animation.BOUNCE,
                map: map,
                title: element.name,
              });
          //  } //closes if
          }) //closes forEach
          //   .map(element => {
          //   if (page != element._id) {
          //     show = null;
          // }})//closes map
         
              
          
        })
        .catch(err => console.log(err))
    }
  

  
  
  startMap()


