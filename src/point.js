/**
 * @param {number} x
 * @param {number} y
 * @constructor
 */
var PolygonPoint = function(x, y) {
  this.x = x;
  this.y = y;
};

/**
 * @returns {number[]}
 */
PolygonPoint.prototype.toArray = function() {
  return [this.x, this.y];
};