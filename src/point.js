/**
 * @param {number} x
 * @param {number} y
 * @param {Phaser.Game}game
 * @constructor
 * @extends {Phaser.Sprite}
 */
var PolygonPoint = function(x, y, game) {
  Phaser.Sprite.call(this, game, x, y, 'point');
  game.add.existing(this);
  this.inputEnabled = true;
  this.input.enableDrag(true);
};

PolygonPoint.prototype = Object.create(Phaser.Sprite.prototype);
PolygonPoint.prototype.constructor = PolygonPoint;

/**
 * @param {number} zoom
 * @returns {number[]}
 */
PolygonPoint.prototype.toZoomedOutArray = function(zoom) {
  return [this.x / zoom, this.y / zoom];
};