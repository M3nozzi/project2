function startMap() {
    const ironhackSP = {
        lat: -23.561526,
      lng: -46.660127
    };
    const map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 15,
        center: ironhackSP
      }
    );
}
  
 
  
  startMap();

