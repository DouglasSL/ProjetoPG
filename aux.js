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

// Deactivate buttons when there aren't 16 points
stage.sendMessage("deactivate", {});
