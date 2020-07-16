function RadarChart () {
  this.name = 'Pay gap by job 2017: radar chart';
  
  this.id = 'radar-chart';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSize = 10;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    let self = this;
    this.data = loadTable(
    './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
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
    let occupations = this.data.getColumn('job_subtype');
    for (let i = 0; i < occupations.length; i++) {
      this.select.option(occupations[i]);
    }

  };

  this.destroy = function() {
    // Remove our selector when user leaves the visualisation
    this.select.remove();
  };

  this.draw = function(){
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    // Set the number of axes and to be drawn
    const dataPoints = 6;

    // set an array populated with labels for the axes
    const axisLabels = ['Number of men in jobs', 'Median male something', 
    'Number of women in jobs', 'Median female something',
    'Proportion of women in occupation', 'Pay gap'];

    // get the row selected by the user
    let selection = this.data.findRow(this.select.value(), 'job_subtype');

    // get the data from the row
    let selectionRow = [selection.getNum('num_jobs_male'), selection.getNum('median_male'), 
    selection.getNum('num_jobs_female'), selection.getNum('median_female'), 
    selection.getNum('proportion_female'), selection.getNum('pay_gap') ];

    // If any values are negative, set them to -0.85 so the points stop at the centre of the chart.
    for (let i = 0; i < selectionRow.length; i++) {
      if (selectionRow[i] < 0) {
        selectionRow[i] = -0.85;
      }
    }

    // set the max values of each row in order to map along axes
    // would ideally be calculated by finding highest number from each column (apart from num_jobs)
    const selectionMax = [selection.getNum('num_jobs'), 30, selection.getNum('num_jobs'), 30, 100, 20];

    // Draw graph and axes
    this.addAxes(dataPoints, axisLabels);
    // Draw points and join them
    this.drawPoints(dataPoints, selectionRow, selectionMax);
  };

  this.addAxes = function (numAxes, axisLabels) {

    // text gap, fix for left and right aligned text spacing
    // positive for left aligned text, flipped to negative for right aligned text
    let textGap = 20;

    // draw concentric rings
    push();
    fill(250);
    stroke(200);
    strokeWeight(1);
    for (let i = 500; i > 0; i -= 50) {
      ellipse(width / 2, height / 2, i);
    }

    // draw axes
    stroke(0);
    for (let j = 0; j < numAxes; j++) {
      // angle calculation and vector manipulation from https://editor.p5js.org/codingtrain/sketches/ByF-2qK0X
      // calculate the angle of each line around the circle based upon how many axes we need
      let angle = j * TWO_PI / numAxes;
      // create vector from the angle, modify it to reach the outermost circle of the graph
      let lineVector = p5.Vector.fromAngle(angle);
      lineVector.mult(250);
      lineVector.add(width / 2, height / 2);
      // draw the line from the centre to the edges of the circle
      line(width / 2, height / 2, lineVector.x, lineVector.y);
      // label the axes
      push();
      noStroke();
      fill(0);
      if (j > 1 && j < 5) {
        textAlign(RIGHT);
        textGap = -20;
      } else { 
        textAlign(LEFT);
        textGap = 20;
      }
      text(axisLabels[j], lineVector.x + textGap, lineVector.y);
      pop();
    }
    pop();

    // draw dot in middle
    push();
    stroke(100);
    fill(100);
    ellipse(width / 2, height / 2, this.dotSize);
    pop();
  };

  this.drawPoints = function (dataPoints, selectionRow, selectionMax) {

    // array to store vectors for the lines
    var vArray = [];

    for (let i = 0; i < dataPoints; i++) {
      // calculate the angle of each line around the circle based upon how many axes we need
      let angle = i * TWO_PI / dataPoints;
      // create vector from the angle
      let pointVector = p5.Vector.fromAngle(angle);
      // map the point along the axis, centre being 0, outer edge being 100
      pointVector.mult(map(selectionRow[i], 0, selectionMax[i], 10, 250));
      pointVector.add(width / 2, height / 2);

      // push vectors to the array
      vArray.push(pointVector);
      // add first vector to end to complete loop
      if (i === dataPoints - 1) {
        vArray.push(vArray[0]);
      } 
    }

    // draw a line between each data point
    for (let j = 0; j < vArray.length - 1; j++) {
      push();
      strokeWeight(2);
      stroke(255, 192, 203);
      // drawn line between current and next entry in array
      line(vArray[j].x, vArray[j].y, vArray[j+1].x, vArray[j+1].y);
      pop();
    }
    
    // draw a dot for each data point and mouse-over for the value
    for (let k = 0; k < vArray.length - 1; k++) {
      push();
      strokeWeight(12);
      // change colour based on data
      // values currently hard-coded, not variable
      if (k > 1 && k < 5) {
        stroke(255, 150, 200);
      } else if (k === 5) {
        stroke(150, 250, 150);
      } else { stroke(150, 200, 255); }
      point(vArray[k].x, vArray[k].y);
      pop();

      // pop-up number info on mouse-over of points
      push();
      textSize(14);
      if (mouseX > vArray[k].x - 20
        && mouseX < vArray[k].x + 20
        && mouseY > vArray[k].y - 20
        && mouseY < vArray[k].y + 20) {
        text(parseFloat(selectionRow[k]).toFixed(2), vArray[k].x + 10, vArray[k].y);
        }
      pop();
      }
    };
}