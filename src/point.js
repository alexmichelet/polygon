/**
 * @param {number} x
 * @param {number} y
 * @param {PolygonUI} ui
 * @constructor
 * @extends {Phaser.Sprite}
 */
var PolygonPoint = function(x, y, ui) {
  Phaser.Sprite.call(this, ui.game, x, y, 'point');
  ui.game.add.existing(this);
  this.inputEnabled = true;
  this.input.enableDrag(true);

  var point = this;

  this.events.onInputDown.add(function () {
    ui.setCurrentPoint(point);
  });
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