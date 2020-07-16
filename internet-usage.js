function InternetUsage() 
{
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Internet Usage';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'internet_usage';
    
    var marginSize = 35;
    
    //The title of the plot
    this.title = 'Percentage of internet usage, by age group and sex, in the UK';
    
    //Set standard colours for the circles
    var male_2012_colour = color(147, 203, 123, 170);
    var female_2012_colour= color(230, 0, 0, 170);
    var male_2017_colour = color(255, 165, 0, 170);
    var female_2017_colour = color(254, 127, 156, 170);
    
    // Layout object to store all common plot layout parameters and
    // methods.
    this.layout = 
    {
        marginSize: marginSize,

        // Locations of margin positions. Left and bottom have double margin
        // size due to axis and tick labels.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,

        plotWidth: function() 
        {
            return this.rightMargin - this.leftMargin;
        },

        plotHeight: function() 
        {
            return this.bottomMargin - this.topMargin;
        },

        // Boolean to enable/disable background grid.
        grid: true,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 20,
        numYTickLabels: 10,
    };
    
    
    this.preload = function() 
    {
        var self = this;
        
        //For the 2012 data values
        this.data = loadTable( 
            './data/internet-usage/internet_2012.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function(table) 
            {
                self.loaded = true;
            });
        
        //For the 2017 data values
        this.data2 = loadTable( 
            './data/internet-usage/internet_2017.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function(table) 
            {
                self.loaded = true;
            });
    };
    

    //Creates 2 arrays to store values of the 2 coloured bubbles
    var male_2012_arr = [];
    var female_2012_arr = [];
    var male_2017_arr = [];
    var female_2017_arr = [];
    
    this.setup = function() 
    {   
        //Sets a standard font size and stroke for each time the
        //sketch is loaded
        noStroke();
        textSize(18);
        
        //for the 2012 bubble values
        for(let i = 0; i < this.data.getRowCount(); i++)
        {
            
            //Uses the CircleMaker constructor to make bubbles
            //For the male 2012 data set
            male_2012_arr.push(new CircleMaker(random(60, width - 60),
                                              random(60, height - 60),
                                              this.data.getNum(i, 'Male'),
                                              random(0.8, 2),
                                              random(0.8, 2),
                                              random(-1, 1),
                                              random(-1, 1),
                                              this.data.getString(i, 'Age')));
            
            //Uses the CircleMaker constructor to make bubbles
            //For the female 2012 data set
            female_2012_arr.push(new CircleMaker(random(60, width - 60),
                                              random(60, height - 60),
                                              this.data.getNum(i, 'Female'),
                                              random(0.8, 2),
                                              random(0.8, 2),
                                              random(-1, 1),
                                              random(-1, 1),
                                               this.data.getString(i, 'Age')));
        } 
        
        //for the 2017 bubble values
        for(let j = 0; j < this.data2.getRowCount(); j++)
        {
            //Uses the CircleMaker constructor to make bubbles
            //For the male 2012 data set
            male_2017_arr.push(new CircleMaker(random(60, width - 60),
                                              random(60, height - 60),
                                              this.data.getNum(j, 'Male'),
                                              random(0.8, 2),
                                              random(0.8, 2),
                                              random(-1, 1),
                                              random(-1, 1),
                                              this.data.getString(j, 'Age')));
            
            //Uses the CircleMaker constructor to make bubbles
            //For the female 2012 data set
            female_2017_arr.push(new CircleMaker(random(60, width - 60),
                                              random(60, height - 60),
                                              this.data.getNum(j, 'Female'),
                                              random(0.8, 2),
                                              random(0.8, 2),
                                              random(-1, 1),
                                              random(-1, 1),
                                               this.data.getString(j, 'Age')));
        }  
    };
    
    
    //Makes sure the circles do not just keep getting drawn
    // Each time the window is clicked (otherwise circles would only be made, never destroyed)
    this.destroy = function() 
    {
        male_2012_arr = [];
        female_2012_arr = [];
        male_2017_arr = [];
        female_2017_arr = [];
    };
    
    this.draw = function() 
    {   
        
        //Calls the function that stops and starts the bubbles moving
        this.spacebarStop();
        
        //For the 2012 data set
        for(let i = 0; i < male_2012_arr.length; i++)
        {
            //Calls the CircleMaker constructor to draw bubbles to the
            //screen, update them (so they move), and make sure they
            //don't go off the edge of the screen. It also colours them
            //And adds text to them
            
            //This is for male 2012 data set
            fill(male_2012_colour);
            male_2012_arr[i].draw();
            //Used to stop and start the bubbles from moving
            if(stopDraw == true)
            {
                male_2012_arr[i].update();
            }
            male_2012_arr[i].check();
            fill(0);
            male_2012_arr[i].drawText();
            
            //This is for female 2012 data set
            fill(female_2012_colour);
            female_2012_arr[i].draw();
            //Used to stop and start the bubbles from moving
            if(stopDraw == true)
            {
                female_2012_arr[i].update();
            }
            female_2012_arr[i].check();
            fill(0);
            female_2012_arr[i].drawText();
        }
        
        //For the 2017 data set
        for(let j = 0; j < male_2017_arr.length; j++)
        {
            //Calls the CircleMaker constructor to draw bubbles to the
            //screen, update them (so they move), and make sure they
            //don't go off the edge of the screen. It also colours them
            //And adds text to them
            
            //This is for male 2012 data set
            fill(male_2017_colour);
            male_2017_arr[j].draw();
            //Used to stop and start the bubbles from moving
            if(stopDraw == true)
            {
                male_2017_arr[j].update();
            }
            male_2017_arr[j].check();
            fill(0);
            male_2017_arr[j].drawText();
            
            //This is for female 2012 data set
            fill(female_2017_colour);
            female_2017_arr[j].draw();
            //Used to stop and start the bubbles from moving
            if(stopDraw == true)
            {
                female_2017_arr[j].update();
            }
            female_2017_arr[j].check();
            fill(0);
            female_2017_arr[j].drawText();
        }
        
        //Draw the title
        this.drawTitle();
        
        //Draws the boxes saying what the colours represent
        this.boxes();
    };
    
    //Initialise variables for the bubbles to stop moving function
    var stopDraw = true;
    var previousKeyPressed = false;
    
    //Uses the spacebar to stop the bubbles from moving, and if
    //the spacebar is pressed gain the bubbles move again
    this.spacebarStop = function()
    {   
        if(keyIsPressed)
        {
            if(!previousKeyPressed)
            {
                previousKeyPressed = true;
            
                if(keyCode === 32)
                {
                    stopDraw = !stopDraw;
                }
            }
        }
        else
        {
            previousKeyPressed = false;
        }
    };
    
    this.drawTitle = function() 
    {
        //This is used to draw the main title
        textAlign('center', 'center');
        text(this.title, 300, 20);
        //This is for the small text under the title
        //Used to tell individuals you can press space 
        //to stop/start the bubbles
        fill(150);
        textSize(13);
        text('press space to start/stop the bubbles', 300, 40);
        //Sets back the text size to be 18 (which most other things are)
        textSize(18);
        //This is all used to set the underlign for the title
        fill(0);
        stroke(0);
        strokeWeight(1.5);
        line(50, 28, 550, 28);
        //Used to set back the 'normal' conditions
        strokeWeight(1);
        noStroke();
    };
    
    this.boxes = function()
    {
        push();
        textSize(13);
        //Draws a box around the colours so it stands out more 
        //It also means bubbles that go over it actually go under this, 
        //so it is not obscured
        fill(255);
        stroke(0);
        rect(590, 3, 425, 34);
        
        //Draws the box for 2012 male colour indicator
        noStroke();
        fill(male_2012_colour);
        rect(600, 10, 20, 20);
        fill(0);
        text('Male 2012', 655, 21);
        
        //Draws the box for 2012 female colour indicator
        fill(female_2012_colour);
        rect(700, 10, 20, 20);
        fill(0);
        text('Female 2012', 762, 21);
        
        //Draws the box for 2017 male colour indicator
        noStroke();
        fill(male_2017_colour);
        rect(815, 10, 20, 20);
        fill(0);
        text('Male 2017', 870, 21);
        
        //Draws the box for 2017 female colour indicator
        fill(female_2017_colour);
        rect(910, 10, 20, 20);
        fill(0);
        text('Female 2017', 972, 21);
        pop();
    };
}














