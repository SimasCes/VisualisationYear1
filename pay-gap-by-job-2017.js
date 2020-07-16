function PayGapByJob2017() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap by job: 2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-by-job-2017';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
 
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }
    
    // Draw the axes.
    this.addAxes();

    // Get data from the table object.
    var jobs = this.data.getColumn('job_subtype');
    var propFemale = this.data.getColumn('proportion_female');
    var payGap = this.data.getColumn('pay_gap');
    var numJobs = this.data.getColumn('num_jobs');

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    // Use full 100% for x-axis (proportion of women in roles).
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    var payGapMin = -20;
    var payGapMax = 20;

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    fill(255);
    stroke(0);
    strokeWeight(1);

    for (i = 0; i < this.data.getRowCount(); i++) {
      // x = propFemale
      // y = payGap
      // size = numJobs
      // colour ellipses according to distance from center (i.e. equal pay, equal rates of employment)
      push();
      fill(
        map(dist(map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad),
        map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad), width / 2, height / 2), width / 2, height / 2, 255, 190),
        map(dist(map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad), 
        map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad), width / 2, height / 2), width / 2, height / 2, 0, 100), 0);
      // Draw an ellipse for each point.
      ellipse(
        map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad),
        map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad),
        map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax)
      );
      pop();
    }

    push();
    // label the ellipses on mouseover
    // separate for loop to draw over ellipses
    for (i = 0; i < this.data.getRowCount(); i++) {
      // calculate the endY for the line and text positioning
      let endY = map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad) + (this.pad * 3);
      // 
      let drawFlip = 0;
      let gap = -20;
      if (mouseY >= height * 0.77) {
        drawFlip = endY - map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad);
        gap = 10;
      }
      // check if the mouse is within the radius of the current element in the array
      // draw a line with a label for the selected dot
      if (mouseX
        <= (map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad)
        + (map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax) / 2))
        && mouseY
        <= (map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad) 
        + (map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax) / 2))
        && mouseX
        >= (map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad)
        - (map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax) / 2))
        && mouseY
        >= (map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad) 
        - (map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax) / 2))) {
          // push and pop so we don't affect any other objects drawn to the window
          // draw a line down from the centre of the ellipse to our label
          stroke(100);
          line(map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad), 
            map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad), 
            map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad), 
            (endY - drawFlip) + gap);
          fill(50);
          strokeWeight(1);
          stroke(255);
          textSize(18);
          // now we'll draw the label to the left if we're on the right-hand side of the window
          // or to the right if we're on the left, to make sure it fits in the window
          // falls back to centered text if for some reason it doesn't work
          if (mouseX >= width / 2) {
            textAlign(RIGHT);
          } else if (mouseX < width / 2) {
            textAlign(LEFT);
          } else { textAlign(CENTER); }
          text(jobs[i], 
            map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad), 
            endY - drawFlip);
        
          if (mouseIsPressed) {
            //call a modal and pass relevant data to it
            modal(jobs[i], Number(propFemale[i]).toFixed(2), Number(payGap[i]).toFixed(2), Number(numJobs[i]).toFixed(0));
             }
          }
        }
    pop();
    // add the labels on top of everything else so they're always on top
    this.labelAxes();
  };

  this.addAxes = function () {

    push();
    // draw background grid
    stroke(230);
    // spaces for grids
    let yGap = width / 15;
    let xGap = height / 22;
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 5; i += 1) {
      // add y-axis background grid lines
      line(0, (height / 2) + yGap * i, width, (height / 2) + yGap * i);
      line(0, (height / 2) - yGap * i, width, (height / 2) - yGap * i);
      // add numbers to grid, skipping axes
      if (i !== 0) {
        push();
        fill(100);
        textSize(12);
        text(5 * i, 0 + this.pad * 1.5, (height / 2) - yGap * i);
        text(5 * i, 0 + this.pad * 1.5, (height / 2) + yGap * i);
        pop();
      }
    }
    for (let j = 0; j < 22; j += 1) {
      // add x-axis background grid lines
      line((width / 2) + xGap * j, 0, (width / 2) + xGap * j, height);
      line((width / 2) - xGap * j, 0, (width / 2) - xGap * j, height);
      // add numbers to grid, skipping axes
      if (j !== 0 && j < 19) {
        push();
        fill(100);
        textSize(12);
        text(5 * j, (width / 2) + xGap * j, height - this.pad * 1.5);
        text(5 * j, (width / 2) - xGap * j, height - this.pad * 1.5);
        pop();
        }
    }
    pop();

    stroke(100);

    // Add vertical line.
    line(width / 2,
         0 + this.pad,
         width / 2,
         height - this.pad);

    // Add horizontal line.
    line(0 + this.pad,
         height / 2,
         width - this.pad,
         height / 2);
    
    // add some white space along the sides to tidy up the edges of the grid
    fill(255);
    noStroke();
    rect(-10, -10, width + 10, this.pad);
    rect(-10, -10, this.pad + 10, height + 10);
    rect(-10, height + 10, width + 10, - this.pad);
    rect(width - this.pad, -10, width - this.pad, height);
  };

  this.labelAxes = function () {
    // label the axes
    push();
    stroke(255);
    strokeWeight(2);
    fill(0);
    textSize(16);

    // label vertical axis
    textAlign(CENTER, TOP);
    text('Women paid more', width / 2, height - this.pad);
    textAlign(CENTER, BOTTOM);
    text('Men paid more', width / 2, this.pad);

    // label horizontal axis
    text('Fewer women in roles', this.pad * 4, height / 2);
    text('More women in roles', width - this.pad * 4, height / 2);

    // Add text for instructions
    textAlign(CENTER);
    text('Click on bubbles for more information', width * 0.20, height);
    pop();
 };
}
