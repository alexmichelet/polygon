/**
 * @param {string} physicsKey
 * @param {PolygonPoint[]} points
 * @param {number} zoom
 * @constructor
 */
var PolygonCore = function(physicsKey, points, zoom) {
  this.physicsKey = physicsKey;
  this.points = points;
  this.zoom = zoom;
};

/**
 * @returns {string}
 */
PolygonCore.prototype.getJSON = function() {
  var pointsCdt2d = [];

  for (var i = 0; i < this.points.length; i++) {
    pointsCdt2d[i] = this.points[i].toZoomedOutArray(this.zoom);
  }

  var edges = [];
  for (var k = 0; k < pointsCdt2d.length - 1; k++) {
    edges.push([k, k+1]);
  }

  edges.push([k, 0]);

  var cdt2dTriangles = cdt2d(pointsCdt2d, edges, {exterior: false});

  var triangles = [];

  for (var j = 0; j < cdt2dTriangles.length; j++) {
    var point1 = this.points[cdt2dTriangles[j][0]].toZoomedOutArray(this.zoom);
    var point2 = this.points[cdt2dTriangles[j][1]].toZoomedOutArray(this.zoom);
    var point3 = this.points[cdt2dTriangles[j][2]].toZoomedOutArray(this.zoom);
    triangles[j] = {
      'shape': [
        point1[0],
        point1[1],
        point2[0],
        point2[1],
        point3[0],
        point3[1],
      ],
    };
  }

  var out = {};
  out[this.physicsKey] = triangles;

  return JSON.stringify(out, null, 2);
};