var toggled = false;
var currentBackground = undefined;
// in-memory storage to hold all my circle objects
var circles = new Array();

// these functions are our interface to the outside world and can be called from external JS sources
// ---- begin interface section ----

// add a circle to the map
// parameters: id, x, y, radius, color
this.addCircle = function(id, x,y,radius,color) {
    var circle = new Path.Circle({
        center: new Point(x,y),
        radius: radius,
        fillColor: color
    });
    
    circles.push({
        id: id,
        circle: circle,
        destination: new Point(x,y)
    });
    
};

// move a particular circle to an arbitrary point on the map
// parameters: id, destination x, destination y
this.moveCircle = function(id, x, y) {
    
    for(var i = 0; i < circles.length; i++) {
        if (circles[i].id == id) {
            circles[i].destination=new Point(x,y);
            break;
        }
    }
    
};


this.changeBackground = function(img_name) {
    // Create a raster item using the image tag with id='mona'
    if (currentBackground) {
        currentBackground.remove();
    }
    currentBackground = new Raster(img_name);

    // Move the raster to the center of the view
    currentBackground.position = view.center;  
    currentBackground.sendToBack();
};


// ---- end interface section ----
function onFrame(event) {
	// a Paper.js function, that is called every 60s to simulate movement
    
    // loop through all circles and see if they need to be moved
    for(var i = 0; i < circles.length; i++) {
        
        if (circles[i].circle.position.equals(circles[i].destination)) {
            continue;    
        } else {

            var circle = circles[i].circle;

            // The vector is the difference between the position of
            // the circle item and the destination point:
            var vector = circles[i].destination - circle.position;

            // now that we have a vector (distance and direction), we add it to the circle.
            // we divide it by a large number so the circle doesn't "jump" and instead moves smoothly to the destination
            circle.position += vector/30;

        }  
        
    }
    
}


// Notes I found useful
// 1. Allow Paper.JS to interact with external Javascript:
// https://github.com/paperjs/paper.js/issues/17

//if (!toggled) {
    paper.install(window.mapper);
    window.init_mapper();
    toggled = true;
//}
