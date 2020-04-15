function startMap() {
    const ironhackSP = {
        lat: -23.561585,
        lng: -46.660191};
    const map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 12,
        center: ironhackSP
      }
    );
  }
  
  startMap();

