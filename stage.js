const POINT_COLOR = 'black';
const POINT_RADIUS = 5;
const PATH_COLOR = 'blue';
const PATH_STROKE = 1;
const BEZIER_COLOR = 'red';
const BEZIER_STROKE = 5;

var EVALUATIONS = 500;

var path1 = new Path().stroke(PATH_COLOR, PATH_STROKE).addTo(stage);
var path2 = new Path().stroke(PATH_COLOR, PATH_STROKE).addTo(stage);
var path3 = new Path().stroke(PATH_COLOR, PATH_STROKE).addTo(stage);
var path4 = new Path().stroke(PATH_COLOR, PATH_STROKE).addTo(stage);

var bezier_curve1 = new Path().stroke(BEZIER_COLOR, BEZIER_STROKE).addTo(stage);
var bezier_curve2 = new Path().stroke(BEZIER_COLOR, BEZIER_STROKE).addTo(stage);
var bezier_curve3 = new Path().stroke(BEZIER_COLOR, BEZIER_STROKE).addTo(stage);
var bezier_curve4 = new Path().stroke(BEZIER_COLOR, BEZIER_STROKE).addTo(stage);

var points1 = [];
var points2 = [];
var points3 = [];
var points4 = [];

var whichPoints;
var countPoints = 0;

stage.on('click', function(clickEvent) {

    target = clickEvent.target;

    if(target.id <= 2 && 'id' in target && countPoints < 16){
        x = clickEvent.x;
        y = clickEvent.y;

        point = new Circle(x, y, POINT_RADIUS).fill(POINT_COLOR).addTo(stage);

        if(points1.length < 4){
            points1.push(point.id);
        }else if(points2.length < 4){
            points2.push(point.id);
        }else if(points3.length < 4){
            points3.push(point.id);
        }else if(points4.length < 4){
            points4.push(point.id);
        }
        
        countPoints++;
        
        point.on('drag', function(dragEvent){
            this.attr({"x": dragEvent.x, "y": dragEvent.y});

            point_id = this.id;

            if(points1.includes(point_id)){
                segments = path1.segments();

                segments[points1.indexOf(point_id)][1] = this.attr("x");
                segments[points1.indexOf(point_id)][2] = this.attr("y");

                path1.segments(segments);
                drawBezierCurve1();

            }else if(points2.includes(point_id)){
                segments = path2.segments();

                segments[points2.indexOf(point_id)][1] = this.attr("x");
                segments[points2.indexOf(point_id)][2] = this.attr("y");

                path2.segments(segments);
                drawBezierCurve2();

            }else if(points3.includes(point_id)){
                segments = path3.segments();

                segments[points3.indexOf(point_id)][1] = this.attr("x");
                segments[points3.indexOf(point_id)][2] = this.attr("y");

                path3.segments(segments);
                drawBezierCurve3();

            }else if(points4.includes(point_id)){
                segments = path4.segments();

                segments[points4.indexOf(point_id)][1] = this.attr("x");
                segments[points4.indexOf(point_id)][2] = this.attr("y");

                path4.segments(segments);
                drawBezierCurve4();
            }

        });

        point.on('doubleclick', function(dragEvent){

            point_removed = this.id;
            stage.removeChild(this);
            
            countPoints --;
            
            if(points1.includes(point_removed)){
                segments = path1.segments();
                index = points1.indexOf(point_removed);
                whichPoints = 1;

            }else if(points2.includes(point_removed)){
                segments = path2.segments();
                index = points2.indexOf(point_removed);
                whichPoints = 2;

            }else if(points3.includes(point_removed)){
                segments = path3.segments();
                index = points3.indexOf(point_removed);
                whichPoints = 3;

            }else if(points4.includes(point_removed)){
                segments = path4.segments();
                index = points4.indexOf(point_removed);
                whichPoints = 4;
            }

            for(var i = index; i < segments.length - 1; i++) {
                segments[i] = segments[i + 1];

                if(i === 0){
                    segments[0][0] = "moveTo";
                }
            }

            segments = segments.splice(0, segments.length - 1);

            if(whichPoints === 1){
                path1.segments(segments);

                for(i = index; i < points1.length - 1; i++){
                    points1[i] = points1[i + 1];
                }
                points1.pop();
                drawBezierCurve1();

            }else if(whichPoints === 2){
                path2.segments(segments);
                for(i = index; i < points2.length - 1; i++){
                    points2[i] = points2[i + 1];
                }
                points2.pop();
                drawBezierCurve2();

            }else if(whichPoints === 3){
                path3.segments(segments);

                for(i = index; i < points3.length - 1; i++){
                    points3[i] = points3[i + 1];
                }
                points3.pop();
                drawBezierCurve3();

            }else if(whichPoints === 4){
                path4.segments(segments);

                for(i = index; i < points4.length - 1; i++){
                    points4[i] = points4[i + 1];
                }
                points4.pop();
                drawBezierCurve4();
            }

        });


        if(points1.includes(point.id)) {
            if(path1.segments().length === 0) {
                path1.moveTo(x, y);
            } else {
                path1.lineTo(x, y);
            }
            drawBezierCurve1();

        }else if(points2.includes(point.id)) {
            if(path2.segments().length === 0) {
                path2.moveTo(x, y);
            } else {
                path2.lineTo(x, y);
            }
            drawBezierCurve2();


        }else if(points3.includes(point.id)) {
            if(path3.segments().length === 0) {
                path3.moveTo(x, y);
            } else {
                path3.lineTo(x, y);
            }
            drawBezierCurve3();

        }else if(points4.includes(point.id)) {
            if(path4.segments().length === 0) {
                path4.moveTo(x, y);
            } else {
                path4.lineTo(x, y);
            }
            drawBezierCurve4();
        }


    }
});

function drawBezierCurve1() {

  if(path1.segments().length < 2) {
    return;
  }

  var points = path1.segments();

  bezier_curve1.segments(Array(0));

  bezier_curve1.moveTo(points[0][1], points[0][2]);
  var n = points.length - 1;
  var x = 0, y = 0;

  for(var t = 1 / EVALUATIONS; t < 1; t += 1 / EVALUATIONS, x = 0, y = 0) {
      for(var p = 1; p < points.length; p++) {
        for(var c = 0; c < points.length - p; c++) {
          points[c][1] = (1 - t) * points[c][1] + t * points[c + 1][1];
          points[c][2] = (1 - t) * points[c][2] + t * points[c + 1][2];
        }
      }

      x = points[0][1];
      y = points[0][2];

    bezier_curve1.lineTo(x, y);
  }

  bezier_curve1.lineTo(points[n][1], points[n][2]);
}

function drawBezierCurve2() {
  if(path2.segments().length < 2) {
    return;
  }

  var points = path2.segments();

  bezier_curve2.segments(Array(0));

  bezier_curve2.moveTo(points[0][1], points[0][2]);

  var n = points.length - 1;
  var x = 0, y = 0;

  for(var t = 1 / EVALUATIONS; t < 1; t += 1 / EVALUATIONS, x = 0, y = 0) {
      for(var p = 1; p < points.length; p++) {
        for(var c = 0; c < points.length - p; c++) {
          points[c][1] = (1 - t) * points[c][1] + t * points[c + 1][1];
          points[c][2] = (1 - t) * points[c][2] + t * points[c + 1][2];
        }
      }

      x = points[0][1];
      y = points[0][2];

    bezier_curve2.lineTo(x, y);
  }

  bezier_curve2.lineTo(points[n][1], points[n][2]);
}

function drawBezierCurve3() {

  if(path3.segments().length < 2) {
    return;
  }

  var points = path3.segments();

  bezier_curve3.segments(Array(0));

  bezier_curve3.moveTo(points[0][1], points[0][2]);

  var n = points.length - 1;
  var x = 0, y = 0;

  for(var t = 1 / EVALUATIONS; t < 1; t += 1 / EVALUATIONS, x = 0, y = 0) {
      for(var p = 1; p < points.length; p++) {
        for(var c = 0; c < points.length - p; c++) {
          points[c][1] = (1 - t) * points[c][1] + t * points[c + 1][1];
          points[c][2] = (1 - t) * points[c][2] + t * points[c + 1][2];
        }
      }

      x = points[0][1];
      y = points[0][2];

    bezier_curve3.lineTo(x, y);
  }

  bezier_curve3.lineTo(points[n][1], points[n][2]);
}

function drawBezierCurve4() {

  if(path4.segments().length < 2) {
    return;
  }

  var points = path4.segments();

  bezier_curve4.segments(Array(0));

  bezier_curve4.moveTo(points[0][1], points[0][2]);

  var n = points.length - 1;
  var x = 0, y = 0;

  for(var t = 1 / EVALUATIONS; t < 1; t += 1 / EVALUATIONS, x = 0, y = 0) {
      for(var p = 1; p < points.length; p++) {
        for(var c = 0; c < points.length - p; c++) {
          points[c][1] = (1 - t) * points[c][1] + t * points[c + 1][1];
          points[c][2] = (1 - t) * points[c][2] + t * points[c + 1][2];
        }
      }

      x = points[0][1];
      y = points[0][2];

    bezier_curve4.lineTo(x, y);
  }

  bezier_curve4.lineTo(points[n][1], points[n][2]);
}
