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
var evaluations = 500;
var sb = 20;

var countPoints = 0;

var paths = [];
var bezier_curves = [];

var c_bezier_curves = [];

for(i = 0; i < 4; i++){
  paths.push(new Path().stroke(PATH_COLOR, PATH_STROKE).addTo(stage));
  bezier_curves.push(new Path().stroke(BEZIER_COLOR, BEZIER_STROKE).addTo(stage));
}

for(i = 0; i <= sb; i++){
	c_bezier_curves.push(new Path().stroke(T_BEZIER_COLOR, T_BEZIER_STROKE).addTo(stage));
}

var all_points = [[], [], [], []];

stage.on('message', function(data){
  evaluations = parseInt(data.eval);
  bezier_curves.forEach(function(bc, ie){
    drawBezierCurve(ie);
  });
});

stage.sendMessage('here', {eval: evaluations});

/*
 * All the code
*/

stage.on('click', function(clickEvent) {

  stage.sendMessage('ready', {});

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
    });

    all_points.forEach(function(points, i){
      if(points.includes(point.id)) {
        if(paths[i].segments().length === 0) paths[i].moveTo(x, y);
        else paths[i].lineTo(x, y);
        drawBezierCurve(i);
      }
    });

    if(countPoints == 16) {
      stage.sendMessage("sixteen", {});
      draw_by_points();
    }
  }
});

stage.on('message:draw', function(data) {
  sb = data.t;
  t_bezier_curves = [];
  draw();
});

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

function draw_by_points(){
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
  
  //drawBezierCurve_n(count, aux);
   
}


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

function draw_by_bezier(){
  var controlPoints = [];
  var curve = 0;
  for (t = 0; t <= 1; t += 1/sb) {
    var tpoints = [];
    for (i = 0; i < evaluations; i++){
      controlPoints[0] = bezier_curves[0].segments()[i];
      controlPoints[1] = bezier_curves[1].segments()[i];
      controlPoints[2] = bezier_curves[2].segments()[i];
      controlPoints[3] = bezier_curves[3].segments()[i];

      for(var p = 1; p < 4; p++) {
        for(var c = 0; c < 4 - p; c++) {
          controlPoints[c][1] = (1 - t) * controlPoints[c][1] + t * controlPoints[c + 1][1];
          controlPoints[c][2] = (1 - t) * controlPoints[c][2] + t * controlPoints[c + 1][2];
        }
      }
      tpoints.push(controlPoints[0]);
    }

    t_bezier_curves[curve] = new Path().stroke(T_BEZIER_COLOR, T_BEZIER_STROKE).addTo(stage);
    t_bezier_curves[curve].moveTo(tpoints[0][1], tpoints[0][2]);

    for (tp = 1; tp < tpoints.length - 1; tp++){
      t_bezier_curves[curve].lineTo(tpoints[tp][1], tpoints[tp][2]);
    }

    t_bezier_curves[curve].moveTo(tpoints[tpoints.length - 1][1], tpoints[tpoints.length - 1][2]);
    curve++;
  }
}