//We used mappa.js to help us construct the map. Some of the code form the examples was integrated in (the code that is essential and cannot be changed, because that is how the library is constructed and has specific commands you need to use). Nevertheless, this is the link to the site we used: https://mappa.js.org/ and https://mappa.js.org/docs/simple-map.html

function MappaMap(canvas) {
  this.name = 'Population map (mappa)';

  this.id = 'map-mappa';

  // Property to represent whether data has been loaded.
  this.loaded = false;
  
  // Map initialisation
  this.mappa = new Mappa('Leaflet');

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
    // Map options
    this.options = { 
      lat: 0,
      lng: 0,
      zoom: 3,
      style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    };

    this.myMap = this.mappa.tileMap(this.options);
    this.myMap.overlay(canvas);
  };

  this.destroy = function() {
    // Unwrap canvas from Leaflet containers without destroying it and remove Leaflet containers.
    // Vital to ensure other features work after viewing map
    $('canvas').unwrap();
    $('canvas').unwrap();
    $('canvas').unwrap();
    $('canvas').unwrap();
    $('canvas').css('transform', 'none');
    $('.leaflet-pane').remove();
    $('.leaflet-container').remove();
    $('.leaflet-control-container').remove();
    $('.leaflet-proxy').remove();
  };

  this.draw = function() {
      clear();
      
      //Calls the data draw function, to draw the dots on the map and call the mouse-over function
      this.dataDraw();
  };
  
  //Used to visualise the data onto the map 
  this.dataDraw = function() {
      
      //Used when multiple data points are selected, so all the names of the cities don't overlap and are displyed to the screen
      this.displayY = 20;
      
      //Used to change the coulour of each dot and city name when it is drawn to the screen
      this.colour_b = 80;
      this.colour_r = 80;
      
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
          
          
          fill(50, 200, 150, 120);
          noStroke();
          
          //Map the mass data of each city (population)
          let populationSize = map(dataStore.population,
                               20000,
                               35676000,
                               1,
                               40) + this.myMap.zoom(); 
          //.zoom() is added to make the circles correct size for when the map is zoomed in/out (they are bigger and visible when zooming out)
          
          let dataPoint = this.myMap.latLngToPixel(dataStore.lat, dataStore.lng);
          
          //Used to draw the names of the cities when hovering over the data
          //Also because it is before the elipse is draw, when you hover over the circle (city population/plot point) it will change colour to the colour of the text (making it easier to see which circle you are hovering over)
          this.drawName(dataPoint, populationSize, dataStore);
          
          //ellipse used to draw the plot points (city populations)
          ellipse(dataPoint.x, dataPoint.y, populationSize);
      }
  };
  
  //Ued to draw text to the screen when your mouse hovers over a city (plot point)
  this.drawName = function(dataPoint, populationSize, dataStore){
      //Checks if the mouse is over the plot point (circle)
      if(mouseX >= dataPoint.x - populationSize / 2  
         &&
         mouseX <= dataPoint.x + populationSize / 2 
         &&
         mouseY >= dataPoint.y - populationSize / 2 
         &&
         mouseY <= dataPoint.y + populationSize / 2 )
         {
              //This if, it else, and else statement is used to allign the text depending on where we are on the screen. If you are on the right-hand side, the text will be diplayed to the left and visa versa. This is useful so the text does not go off the screen when it is being displayed
              if(mouseX >= width / 2)
              {
                  textAlign(RIGHT);
              } 
              else if(mouseX < width / 2) 
              {
                  textAlign(LEFT);
              } 
              else 
              { 
                  textAlign(CENTER); 
              }
             
             //This if statement is used for the height of the screen and where the text will be displayed 
             if(mouseY >= height / 2)
              {
                  //Used when multiple data points are selected, so all the names of the cities don't overlap and are displyed to the screen
                  this.displayY += 30;
              } 
              else if(mouseY < height / 2) 
              {
                  //Used when multiple data points are selected, so all the names of the cities don't overlap and are displyed to the screen
                  this.displayY -= 30;
              } 
             
  
              //The fill is made to be see-through, so the dots(data points) are still seen, when one of them is highlighted, also they changed colour so if your mouse if not in the way you can identify the name colour with the colour of the dot.
              //The this.colour_b and this.colour_r are used to change the coulour of each dot and city name when it is drawn to the screen
              fill(this.colour_r, 0, this.colour_b, 160);
              textSize(25);
              //Shows the name of the city when you hover over the plot point(which is the size of that cities population) and shows the population density(how manyt poeple there are in that city)
              //The extra +30 means the text does not appear on the mouse when values are near the top of the canvas (so text is appearing below the mouse, and not exactly on the mouse itself)
              text(dataStore.name + ': ' + int(dataStore.population).toLocaleString(), mouseX, mouseY - this.displayY + 40);
              //Used to change the coulour of each dot and city name when it is drawn to the screen(the more city names that appear, the lighter the colour gets (closer to pink))
              this.colour_b += 30;
              this.colour_r += 30;
         }
  };
}

























