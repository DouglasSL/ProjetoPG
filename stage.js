/*
 * Global constants
*/
const POINT_COLOR = 'black';
const POINT_RADIUS = 5;
const PATH_COLOR = 'blue';
const PATH_STROKE = 1;
const BEZIER_COLOR = 'red';
const BEZIER_STROKE = 5;
const T_BEZIER_COLOR = 'pink';
const T_BEZIER_STROKE = 2;


/*
 * Global variables
*/
var evaluations = 500; //default value
var sb = 20; //default value
var countPoints = 0;
var paths = [];
var bezier_curves = [];
var c_bezier_curves = [];
var all_points = [[], [], [], []];
for(i = 0; i < 4; i++){
  paths.push(new Path().stroke(PATH_COLOR, PATH_STROKE).addTo(stage));
  bezier_curves.push(new Path().stroke(BEZIER_COLOR, BEZIER_STROKE).addTo(stage));
}

/* Sends the default evaluations value to HTML */
stage.sendMessage('here', {eval: evaluations});

/*
 * Global functions
*/

function create_c_bezier(){
  for(i = 0; i <= sb; i++){
  	c_bezier_curves.push(new Path().stroke(T_BEZIER_COLOR, T_BEZIER_STROKE).addTo(stage));
  }
}

/* Draws original bezier curves */
function drawBezierCurve(i) {
  var n, x, y;
  if(paths[i].segments().length < 2) return;
  var points = paths[i].segments();

  bezier_curves[i].segments(Array(0));

  bezier_curves[i].moveTo(points[0][1], points[0][2]);
  n = points.length - 1;
  x = 0, y = 0;

  for(t = 1/evaluations; t < 1; t += 1/evaluations, x = 0, y = 0) {
    for(p = 1; p < points.length; p++){
      for(c = 0; c < points.length - p; c++){
        points[c][1] = (1 - t) * points[c][1] + t * points[c + 1][1];
        points[c][2] = (1 - t) * points[c][2] + t * points[c + 1][2];
      }
    }
    x = points[0][1];
    y = points[0][2];

    bezier_curves[i].lineTo(x, y);
  }

  bezier_curves[i].lineTo(points[n][1], points[n][2]);
}

/* Draws the t_bezier_curves based on points (faster) */
function draw_by_points(){
  create_c_bezier();
  var controlPoints = [];
  var count = 0;
  var aux = paths[3].segments();
  for (q = 0; q < 1.001; q += 1/sb) {
    var tpoints = [];
    for (i = 0; i < 4; i++){
      controlPoints[0] = paths[0].segments()[i];
      controlPoints[1] = paths[1].segments()[i];
      controlPoints[2] = paths[2].segments()[i];
      controlPoints[3] = paths[3].segments()[i];

      for(var pt = 1; pt < controlPoints.length; pt++) {
        for(var ct = 0; ct < controlPoints.length - pt; ct++) {
          controlPoints[ct][1] = (1 - q) * controlPoints[ct][1] + q * controlPoints[ct + 1][1];
          controlPoints[ct][2] = (1 - q) * controlPoints[ct][2] + q * controlPoints[ct + 1][2];
        }
      }
      tpoints.push(controlPoints[0]);
    }
	drawBezierCurve_n(count, tpoints);
	count++;
  }
}

/* Auxiliar function */
function drawBezierCurve_n(i, points) {
  var n, x, y;
  c_bezier_curves[i].segments(Array(0));

  c_bezier_curves[i].moveTo(points[0][1], points[0][2]);
  n = points.length - 1;
  x = 0, y = 0;

  for(t = 1/evaluations; t < 1; t += 1/evaluations, x = 0, y = 0) {
    for(p = 1; p < points.length; p++){
      for(c = 0; c < points.length - p; c++){
        points[c][1] = (1 - t) * points[c][1] + t * points[c + 1][1];
        points[c][2] = (1 - t) * points[c][2] + t * points[c + 1][2];
      }
    }
    x = points[0][1];
    y = points[0][2];

    c_bezier_curves[i].lineTo(x, y);
  }
   c_bezier_curves[i].moveTo(points[n][1], points[n][2]);
}


/* Gets the evaluation value from the front */
stage.on('message:getEval', function(data){
  evaluations = parseInt(data.eval);
  bezier_curves.forEach(function(bc, ie){
    drawBezierCurve(ie);
  });
});

/*
 * Hide points, curves and segments functions
*/
stage.on('message:hide', function(data){
  hide(data.id, data.checked);
});

function hide(id, checked){
  var transp = new color.RGBAColor(0, 0, 0, 0.0);
  var arr, col, stroke;
  if(id == 'points'){
    all_points.forEach(function(points){
      points.forEach(function(point){
        stage.children().forEach(function(e){
          if(e.id == point) {
            if(!checked) e.fill(transp);
            else e.fill(POINT_COLOR);
          }
        })
      });
    });
  } else {
    if (id == 'segments') {arr = paths; col = PATH_COLOR; stroke = PATH_STROKE;}
    else if(id == 'curves') {arr = bezier_curves; col = BEZIER_COLOR; stroke = BEZIER_STROKE;}
    else if(id == 't_curves') {arr = c_bezier_curves; col = T_BEZIER_COLOR; stroke = T_BEZIER_STROKE;}
    arr.forEach(function(el){
      if(!checked) el.stroke(transp, stroke).addTo(stage);
      else el.stroke(col, stroke).addTo(stage);
    });
  }
}

/* Gets the button press to draw t_bezier_curves */
stage.on('message:draw', function(data) {
  sb = data.t;
  draw_by_points();
});

/*
 * Click based functions
*/
stage.on('click', function(clickEvent) {

  target = clickEvent.target;

  if(target.id <= 2 && 'id' in target && countPoints < 16){
    x = clickEvent.x;
    y = clickEvent.y;

    point = new Circle(x, y, POINT_RADIUS).fill(POINT_COLOR).addTo(stage);

    if(all_points[0].length < 4) all_points[0].push(point.id);
    else if(all_points[1].length < 4) all_points[1].push(point.id);
    else if(all_points[2].length < 4) all_points[2].push(point.id);
    else if(all_points[3].length < 4) all_points[3].push(point.id);
    countPoints++;

    /*
     * Drag functions
    */
    point.on('drag', function(dragEvent){
      this.attr({"x": dragEvent.x, "y": dragEvent.y});
      point_id = this.id;
      var aux = this;
      all_points.forEach(function(points, i){
        if(points.includes(point_id)){
          segments = paths[i].segments();
          segments[points.indexOf(point_id)][1] = aux.attr("x");
          segments[points.indexOf(point_id)][2] = aux.attr("y");
          paths[i].segments(segments);
          drawBezierCurve(i);
        }
      });
      if(countPoints == 16) draw_by_points();
    });


    /*
     * Delete point functions
    */
    point.on('doubleclick', function(dragEvent){
      var segments, index, whichPoints;
      point_removed = this.id;
      stage.removeChild(this);

      countPoints--;

      all_points.forEach(function(points, i){
        if(points.includes(point_removed)){
          segments = paths[i].segments();
          index = points.indexOf(point_removed);
          whichPoints = i;
        }
      });

      for(var i = index; i < segments.length - 1; i++) {
        segments[i] = segments[i + 1];
        if(i === 0){
          segments[0][0] = "moveTo";
        }
      }

      segments = segments.splice(0, segments.length - 1);

      paths[whichPoints].segments(segments);
      for(i = index; i < all_points[whichPoints].length - 1; i++) {
        all_points[whichPoints][i] = all_points[whichPoints][i+1];
      }
      all_points[whichPoints].pop();
      drawBezierCurve(whichPoints);

      stage.sendMessage("deactivate", {});
    });


    /*
     * Draw functions
    */
    all_points.forEach(function(points, i){
      if(points.includes(point.id)) {
        if(paths[i].segments().length === 0) paths[i].moveTo(x, y);
        else paths[i].lineTo(x, y);
        drawBezierCurve(i);
      }
    });

    // Activate buttons when there aren't 16 points
    if(countPoints == 16) stage.sendMessage("activate", {});
  }
});
