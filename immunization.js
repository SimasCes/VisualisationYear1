function Immunization() 
{
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Immunization';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'immunization';
    
    // Title to display / draw above the plot.
    this.title = 'Immunization rates per borough, in the UK, in 2012-13';

    // Layout object to store all common plot layout parameters and
    // methods.
    this.layout = 
    {
        // Locations of margin positions. Left and bottom have double margin
        // size due to axis and tick labels.
        leftMargin: 130,
        rightMargin: width,
        topMargin: 30,
        bottomMargin: height,
        pad: 5,
        //For the % lines (drawn vertically)
        pad2: 30,
        //For the % labels on the bottom 
        pad3: 25,

        plotWidth: function() 
        {
            return this.rightMargin - this.leftMargin;
        },

    };

    // 70% of the plot line, in proportion to mapping  
    this.X70 = (this.layout.plotWidth() / 4) + this.layout.leftMargin;
    
    // 80% of the plot line, in proportion to mapping   
    this.X80 = (this.layout.plotWidth() / 2) + this.layout.leftMargin;
    
    // 90% of the plot line, in proportion to mapping 
    this.X90 = (this.layout.plotWidth() / 4 * 3) + this.layout.leftMargin;

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() 
    {
        var self = this;
        this.data = loadTable(
          './data/immunization/immunization.csv', 'csv', 'header',
          // Callback function to set the value
          // this.loaded to true.
            function(table) 
            {
                self.loaded = true;
            });
    };

    this.setup = function() 
    {
        
    };

    this.destroy = function() 
    {
        
    };

    //Size for all the plot points
    this.circlePlotSize = 10;
    
    //Colours for the plot points
    this.mmrColour = color(255, 0, 0, 180);
    this.mencColour = color(86, 114, 228, 180);
    
    
    this.draw = function() 
    {
        
        //To draw the title
        this.drawTitle();
        
        //Draws the boxes saying what the colours represent
        this.boxes();
        
        // Will say data is not loaded in the console, when the data has not leaded yet
        if (!this.loaded) 
        {
            console.log('Data not yet loaded');
            return;
        }
        
        //Text default
        textSize(16);
        
        // Draw Female/Male labels at the top of the plot.
        this.drawCategoryLabels();
        
        //Draws the category label lines (for the %)
        this.drawCategoryLabelsLine();

        var lineHeight = (height - this.layout.topMargin) /
            this.data.getRowCount();
     
        
        for (var i = 0; i < this.data.getRowCount(); i++) 
        {
            
            // Calculate the y position for each Area.
            var lineY = (lineHeight * i / 1.05) + this.layout.topMargin;

            // Create an object that stores data from the current row.
            var dataStore = 
            {
                // Convert strings to numbers.
                'name': this.data.getString(i, 'Area'),
                'mmr': this.data.getNum(i, 'MMR'),
                'menc': this.data.getNum(i, 'MenC'),
            };

            // Draw the Area names in the left margin.
            fill(0);
            noStroke();
            textSize(11);
            textAlign('right', 'top');
            text(dataStore.name,
                this.layout.leftMargin - this.layout.pad,
                lineY);

            // Draw the gray horizontal lines.
            stroke(150);
            line(this.layout.leftMargin,
                lineY + 4,
                this.layout.rightMargin,
                lineY + 4);
            
            //Map the mmr and menc values to the canvas size
            //Maps from 60% to 100%, as there is no low values
            this.mapmmr = map(dataStore.mmr,
                              60,
                              100,
                              this.layout.leftMargin, this.layout.rightMargin);
            
            this.mapmenc = map(dataStore.menc,
                               60,
                               100,
                               this.layout.leftMargin, this.layout.rightMargin);

            
            //Draw circles - plot points for mmr
            noStroke();
            fill(this.mmrColour);
            ellipse(this.mapmmr,
                    lineY + 4,
                    this.circlePlotSize);
            
            //Draw circles - plot points for menc
            fill(this.mencColour);
            ellipse(this.mapmenc,
                    lineY + 4,
                    this.circlePlotSize);
            
            //This function is used to draw the big numbers in the
            //middle of the chart
            //lineY and dataStore are passed to it, so it can still
            //access these parameters outside the loop
            this.drawNumber(lineY, dataStore);   
        }
    };
    
    //This function is used to draw the big numbers in the
    //middle of the chart
    this.drawNumber = function(lineY, dataStore)
    {
        //This is used to make text appear when your mouse goes
        //Over the mmr coloured dots(red)
        if(mouseX >= this.mapmmr - this.circlePlotSize / 2 
           &&
           mouseX <= this.mapmmr + this.circlePlotSize / 2
           &&
           mouseY >= lineY + 4 - this.circlePlotSize / 2 
           &&
           mouseY <= lineY + 4 + this.circlePlotSize / 2)
        {
            fill(this.mmrColour);
            textSize(320);
            //parseFloat means it will always show to 1 s.f.
            text(parseFloat(dataStore.mmr).toFixed(1),
                 width / 1.2,
                 height / 4);
        }

        
        //This is used to make text appear when your mouse goes
        //Over the menc coloured dots(blue)
        if(mouseX >= this.mapmenc - this.circlePlotSize / 2 
           &&
           mouseX <= this.mapmenc + this.circlePlotSize / 2
           &&
           mouseY >= lineY + 4 - this.circlePlotSize / 2 
           &&
           mouseY <= lineY + 4 + this.circlePlotSize / 2)
        {
            fill(this.mencColour);
            textSize(320);
            //parseFloat means it will always show to 1 s.f.
            text(parseFloat(dataStore.menc).toFixed(1),
                 width / 1.2,
                 height / 4);
        }
    };
    
    //To draw the lines for the 0 - 100% labels
    this.drawCategoryLabelsLine = function()
    {
        // Draw 60% line
        stroke(150);
        strokeWeight(1);
        line(this.layout.leftMargin,
            this.layout.topMargin,
            this.layout.leftMargin,
            this.layout.bottomMargin - this.layout.pad2);
        
        // Draw 70% line
        line(this.X70,
             this.layout.topMargin,
             this.X70,
             this.layout.bottomMargin - this.layout.pad2);
        
        //Draw 80% line
        line(this.X80,
             this.layout.topMargin,
             this.X80,
             this.layout.bottomMargin - this.layout.pad2);

        // Draw 90% line
        line(this.X90,
             this.layout.topMargin,
             this.X90,
             this.layout.bottomMargin - this.layout.pad2);
        
        //Draw 100% line
        line(this.layout.rightMargin - 1,
            this.layout.topMargin,
            this.layout.rightMargin - 1,
            this.layout.bottomMargin - this.layout.pad2);
    };

    //To draw the category labels of 0 - 100% (go below the line)
    this.drawCategoryLabels = function() 
    {
        fill(0);
        noStroke();
        textAlign('left', 'top');
        text('60%',
             this.layout.leftMargin,
             this.layout.bottomMargin - this.layout.pad3);
        textAlign('center', 'top');
        text('70%',
             this.X70,
             this.layout.bottomMargin - this.layout.pad3);
        text('80%',
             this.X80,
             this.layout.bottomMargin - this.layout.pad3);
        text('90%',
             this.X90,
             this.layout.bottomMargin - this.layout.pad3);
        textAlign('right', 'top');
        text('100%',
             this.layout.rightMargin,
             this.layout.bottomMargin - this.layout.pad3);
    };
    
    //To draw the title
    this.drawTitle = function() 
    {
        //This is used to draw the main title
        fill(0);
        noStroke();
        textAlign('center', 'center');
        textSize(20);
        text(this.title,
             (this.layout.plotWidth() / 3) + this.layout.leftMargin,
             this.layout.topMargin - 20);
        //This is all used to set the underlign for the title
        stroke(0);
        strokeWeight(1.5);
        line(185, 24, 670, 24);
        //Used to set back the 'normal' conditions
        strokeWeight(1);
        noStroke();
    };
    
    this.boxes = function()
    {
        push();
        textSize(13);
        //Draws a box around the colours so it stands out more 
        fill(255);
        stroke(0);
        rect(690, 0, 300, 25);
        
        //Draws the box for MMR colour indicator
        noStroke();
        fill(this.mmrColour);
        rect(700, 6, 15, 15);
        fill(0);
        text('MMR vaccinated %', 775, 14);
        
        //Draws the box for MenC colour indicator
        fill(this.mencColour);
        rect(850, 6, 15, 15);
        fill(0);
        text('MenC vaccinated %', 927, 14);
        pop();
    };
}














