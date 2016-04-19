var toggled = false;
var draw_zone = false;
var currentBackground = undefined;
var zone_path = undefined;
var zone_to = undefined;
var zone_from = undefined;
var get_cords = false;
// in-memory storage to hold all my circle objects
var circles = new Array();
var rectangles = new Array();


// these functions are our interface to the outside world and can be called from external JS sources
// ---- begin interface section ----

// toggle the draw_zone flag
this.setDrawZone = function(state) {
  draw_zone = state;  
};

this.setGetCoords = function(state) {
  get_cords = state;  
};

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

// add a rectangle to the map
// parameters: id, from_x, from_y, to_x, to_y, color
this.addRectangle = function(id, from_x, from_y, to_x, to_y, color) {
    var from = new Point(from_x, from_y);
    var to = new Point(to_x, to_y);
    var rectangle = new Path.Rectangle(from, to);
    rectangle.strokeColor = color;
    
    rectangles[id] = rectangle;
};

// remove a rectangle from the map
// parameters: id
this.removeRectangle = function(id) {
    var rectangle = rectangles[id];
    rectangle.remove();
    rectangles[id] = undefined;
    
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
    if (currentBackground) {
        currentBackground.remove();
    }
    currentBackground = new Raster(img_name);

    // Move the raster to the center of the view
    currentBackground.position = view.center;  
    currentBackground.sendToBack();
};

function onMouseDown(event) {
	// The mouse was clicked, so let's return x,y
    if (get_cords) {
        $(window).trigger("map_click", [ event.point.x, event.point.y ]);   
    }
    if (draw_zone) {
        zone_from = new Point(event.point.x, event.point.y);
        zone_to = new Point(event.point.x+10, event.point.y+10);
        zone_path = new Path.Rectangle(zone_from, zone_to);
        zone_path.strokeColor = 'black';
    }
};

function onMouseMove(event) {
    if (draw_zone) {
        console.log('onMouseMove');
        zone_to = event.point;
        zone_path.remove();
        zone_path = new Path.Rectangle(zone_from, zone_to);
        zone_path.strokeColor = 'red'; 
    }
};

function onMouseUp(event) {
    if (draw_zone) {
        console.log('onMouseUp');
        zone_to = event.point;
        zone_path.remove();
        zone_path = new Path.Rectangle(zone_from, zone_to);
        zone_path.strokeColor = 'red';   
        draw_zone = false;
        
        $(window).trigger('zone_added', [zone_from.x, zone_from.y, zone_to.x, zone_to.y]);
    }
}


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
