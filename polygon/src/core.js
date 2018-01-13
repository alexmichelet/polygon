/**
 * @param {string} physicsKey
 * @param {PolygonPoint[]} points
 * @constructor
 */
var PolygonCore = function(physicsKey, points) {
  this.physicsKey = physicsKey;
  this.points = points;
};

/**
 * @param {PolygonPoint} point
 */
PolygonCore.prototype.addPoint = function(point) {
  this.points.push(point);
};

/**
 * @returns {string}
 */
PolygonCore.prototype.getJSON = function() {
  var pointsCdt2d = [];

  for (var i = 0; i < this.points.length; i++) {
    pointsCdt2d[i] = this.points[i].toArray();
  }

  var cdt2dTriangles = cdt2d(pointsCdt2d);

  var triangles = [];

  for (var j = 0; j < cdt2dTriangles.length; j++) {
    triangles[j] = {
      'shape': [
        this.points[cdt2dTriangles[j][0]].x,
        this.points[cdt2dTriangles[j][0]].y,
        this.points[cdt2dTriangles[j][1]].x,
        this.points[cdt2dTriangles[j][1]].y,
        this.points[cdt2dTriangles[j][2]].x,
        this.points[cdt2dTriangles[j][2]].y,
      ],
    };
  }

  var out = {};
  out[this.physicsKey] = triangles;

  return JSON.stringify(out, null, 2);
};