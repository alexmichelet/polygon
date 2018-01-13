/**
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {string} domElement
 * @constructor
 */
var PolygonUI = function(maxWidth, maxHeight, domElement) {
  /**
   * Max available width for the editor
   * @type {number}
   */
  this.maxWidth = maxWidth;

  /**
   * Max available height for the editor
   * @type {number}
   */
  this.maxHeight = maxHeight;

  /**
   * @type {Phaser.Game}
   */
  this.game = new Phaser.Game(maxWidth, maxHeight, Phaser.AUTO, domElement,
      this, true);

  /**
   * List of points defining the polygon
   * @type {PolygonPoint[]}
   */
  this.points = [];

  /**
   * Currently displayed sprite
   * @type {Phaser.Sprite}
   */
  this.sprite = null;

  /**
   * Zoom of the currently displayed sprite
   * @type {number}
   */
  this.zoom = null;

  /**
   * Graphics object displaying the polygon defined by the points
   * @type {Phaser.Graphics}
   */
  this.polygonGraphics = null;

  var ui = this;

  // Change the sprite when an image is selected by the image selector
  document.getElementById('sprite-upload').
      addEventListener('change', function(e) {
        var file = e.target.files[0];
        var fr = new FileReader();
        fr.onload = function(e) {
          var image = new Image();
          image.src = e.target.result;
          image.onload = function() {
            var spriteWidth = this.width;
            var spriteHeight = this.height;
            var loader = new Phaser.Loader(ui.game);
            loader.image('loadedSprite', e.target.result);
            loader.onLoadComplete.addOnce(function() {
              console.log(">> new sprite has been loaded");
              ui.initParams('loadedSprite', spriteWidth, spriteHeight);
            });
            loader.start();
          };
        };
        fr.readAsDataURL(file);
      }, false);
};

/**
 * Loads the default sprite
 */
PolygonUI.prototype.preload = function() {
  this.game.load.image('phaser-logo', 'assets/img/phaser-logo.png');
};

/**
 * Initialize the params and add the click listener to add points
 */
PolygonUI.prototype.create = function() {
  this.initParams('phaser-logo', 635, 545);

  this.game.input.onDown.add(function() {
    this.points.push(
        new PolygonPoint(this.game.input.x / this.zoom, this.game.input.y /
            this.zoom));
  }, this);
};

/**
 * Update the Graphics object displaying the polygon
 */
PolygonUI.prototype.update = function() {
  var pointsWithZoom = [];
  for (var i = 0; i < this.points.length; i++) {
    pointsWithZoom[i * 2] = this.points[i].x * this.zoom;
    pointsWithZoom[(i * 2) + 1] = this.points[i].y * this.zoom;
  }

  if (this.polygonGraphics != null) {
    this.polygonGraphics.destroy();
  }

  this.polygonGraphics = this.game.add.graphics(0, 0);

  this.polygonGraphics.beginFill(0x00ff00, 0.4);
  this.polygonGraphics.drawPolygon(pointsWithZoom);
  this.polygonGraphics.endFill();
};

/**
 * Initialize the params for a newly selected sprite
 *
 * @param {string} spriteKey
 * @param {number} spriteWidth
 * @param {number} spriteHeight
 */
PolygonUI.prototype.initParams = function(
    spriteKey, spriteWidth, spriteHeight) {
  if (this.sprite === null) {
    this.sprite = this.game.add.sprite(this.game.world.centerX,
        this.game.world.centerY, spriteKey);
  }

  var maxZoomX = this.maxWidth / spriteWidth;
  var maxZoomY = this.maxHeight / spriteHeight;

  this.zoom = Math.min(maxZoomX, maxZoomY);

  this.game.scale.setGameSize(spriteWidth * this.zoom, spriteHeight *
      this.zoom);

  this.sprite.loadTexture(spriteKey);
  this.sprite.x = this.game.world.centerX;
  this.sprite.y = this.game.world.centerY;
  this.sprite.height = spriteHeight * this.zoom;
  this.sprite.width = spriteWidth * this.zoom;
  this.sprite.anchor.setTo(0.5, 0.5);

  this.resetPoints();
};

/**
 * Resets the list of points
 */
PolygonUI.prototype.resetPoints = function() {
  if (this.points.length > 0) {
    console.log('>> reset list of points');
    this.points = [];
  }
};

/**
 * Exports the polygon in JSON format
 *
 * @returns {string}
 */
PolygonUI.prototype.export = function() {
  var core = new PolygonCore('key', this.points);
  return core.getJSON();
};