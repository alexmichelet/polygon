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

  decomp.makeCCW(pointsCdt2d);
  var decompShapes = decomp.quickDecomp(pointsCdt2d);

  var shapes = [];

  for (var j = 0; j < decompShapes.length; j++) {
    var shapeArray = [];
    for (var k = 0; k < decompShapes[j].length; k++) {
      var point = decompShapes[j][k];
      shapeArray.push(point[0]);
      shapeArray.push(point[1]);
    }

    shapes[j] = {
      'shape': shapeArray
    }
  }

  var json = {};
  json[this.physicsKey] = shapes;

  return JSON.stringify(json, null, 2);
};