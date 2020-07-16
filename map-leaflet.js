//We used leaflet to construct this map

function LeafletMap() {
    this.name = 'Population map (leaflet)';
  
    this.id = 'map-leaflet';
  
    // Property to represent whether data has been loaded.
    this.loaded = false;
  
    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() 
    {
        var self = this;
        
        this.data = loadTable(
          './data/cities/worldcities.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function(table) 
            {
                self.loaded = true;
            });
    };
  
    this.setup = function() {
      if (!this.loaded) {
        console.log('Data not yet loaded');
        return;
      }

      // Map initialisation
      // Hide the canvas
      $('canvas').css('display', 'none');
      // Create a div to contain the map
      $('.container').append('<div id="map" class="map" style="width: 1024px; height: 576px;" width="2048" height="1152"></div>');

      // Create the map using Leaflet and centre it on London
      this.map = L.map('map').setView([51.505, -0.09], 3);
      
      // Add the tile layer for the map using Mapbox
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 2,
        maxZoom: 10,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZGNvc2IwMDEiLCJhIjoiY2p0cmNodjVmMG1oeTRkcjBtMTc1bmkxaCJ9.9sclwlCJowNGZYksa3ifDQ'
        }).addTo(this.map);

        this.makeMap();
    };
  
    this.destroy = function() {
      // Unhide the canvas and destroy the map div
      $('canvas').css('display', '');
      $('.map').remove();
    };

    this.draw = function() {

    };

    //Used to visualise the data onto the map 
    this.makeMap = function() {
        
        //Used when multiple data points are selected, so all the names of the cities don't overlap and are displyed to the screen
        this.displayY = 20;
        
        //Used to change the coulour of each dot and city name when it is drawn to the screen
        this.colour_b = 80;
        this.colour_r = 80;
        
        // Will say data is not loaded in the console, when the data has not leaded yet
        if (!this.loaded) 
        {
            console.log('Data not yet loaded');
            return;
        }
        
        for(var i = 0; i < this.data.getRowCount(); i++)
        {    
            // Create an object that stores data from the current row.
            let dataStore = 
            {
            // Convert strings to numbers.
            'name': this.data.getString(i, 'city'),
            'lat': this.data.getNum(i, 'lat'),
            'lng': this.data.getNum(i, 'lng'),
            'population': this.data.getNum(i, 'population'),
            };
            
            //Map the mass data of each city (population)
            let populationSize = map(dataStore.population,
                                 20000,
                                 35676000,
                                 1,
                                 30);
            
            let dataPoint = L.circleMarker([dataStore.lat, dataStore.lng], {
                            color: 'rgba(255, 0, 0, 0.5)',
                            radius: populationSize}).addTo(this.map);
            dataPoint.bindTooltip(dataStore.name + ': ' + int(dataStore.population).toLocaleString());
        }
      };
}
