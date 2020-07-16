function CircleMaker(x, y, size, xSpeed, ySpeed, xDirection, yDirection, text_)
{ 
    this.x = x;
    this.y = y;
    this.size = size;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.xDirection = xDirection;
    this.yDirection = yDirection;
    this.text_ = text_;
    
    //Updates the location of the circles so they can move
    this.update = function()
    {
        this.x = this.x + this.xSpeed * this.xDirection;
        
        this.y = this.y + this.ySpeed * this.yDirection;
    };
    
    //Draws the circles to the canvas/screen
    this.draw = function()
    {
        ellipse(this.x, this.y, this.size);
    };
    
    //Adds text to the circles
    this.drawText = function()
    {
        text(this.text_, this.x, this.y);
    };
    
    var rad = 60;
    
    //Checks if the cicles are at the edge of the screen and
    //if so makes them go back into the boundries
    this.check = function()
    {
        if(this.x > width - rad || this.x < rad) 
        {
            this.xDirection *= -1;
        }
        if(this.y > height - rad || this.y < rad) 
        {
            this.yDirection *= -1;
        }
    };   
}