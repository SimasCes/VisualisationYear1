function TechDiversityRace() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Tech Diversity: Race';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'tech-diversity-race';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/tech-diversity/race-2018.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Create a select DOM element.
    this.select = createSelect();
    this.select.position(265, 20);

    // Fill the options with all company names.
    var companies = this.data.columns;
    // First entry is empty.
    for (let i = 1; i < companies.length; i++) {
      this.select.option(companies[i]);
    }
  };

  this.destroy = function() {
    removeElements();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    var companyName = this.select.value();

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(companyName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['blue', 'red', 'green', 'pink', 'purple', 'yellow'];

    // Make a title.
    var title = 'Employee diversity at ' + companyName;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
      
      
    // to set the boundries, so mouseX and mouseY only activates within the 
    //pie/donut chart and not with other colours on the screen
    if(mouseX >= width / 2 - width * 0.2 
       &&
       mouseY >= height / 2 - width * 0.2 
       &&
       mouseX <= width / 2 + width * 0.2
       &&
       mouseY <= height / 2 + width * 0.2)
    {
        //creates an array of the colour values as strings so "[0,0,255,255]" is the
        // same as blue pixels
        var colourVals = ['[0,0,255,255]', '[255,0,0,255]', '[0,128,0,255]',
                          '[255,192,203,255]', '[128,0,128,255]', '[255,255,0,255]'];  

        //loop through the colourVals array and if the colour detected matches the
        //colour value, you print the data for that colour to the screen (to the middle
        // of the donut chart)
        for(var i = 0; i < colourVals.length; i++)
        {
            if(JSON.stringify(get(mouseX, mouseY)) === colourVals[i])
            {
                text(col[i].toFixed(2) + '%', width / 2, height / 2);
            }
        }
        
    } 
    //So there is directions on how to get the % sign up when hovering over the colours
    else 
    { 
        push();
        fill(100);
        textSize(18);
        text('Hover over a colour to get a %', width / 2, height / 2); 
        textSize(13);
        text('May take a couple of seconds', width / 2, height / 2 + 20); 
        pop();
    }
  };
}













