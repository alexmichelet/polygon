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
   * Is the editor currently showing the triangles (if so, prevents from doing
   * anything else)
   * @type {boolean}
   */
  this.isTesting = false;

  /**
   * Sprite displaying the generated triangles in the P2 Physics System
   * @type {Phaser.Sprite}
   */
  this.spriteTest = null;

  /**
   * Graphics object displaying the polygon defined by the points
   * @type {Phaser.Graphics}
   */
  this.polygonGraphics = null;

  var ui = this;

  // Change the sprite when an image is selected by the image selector
  document.getElementById('sprite-upload').
      addEventListener('change', function(e) {
        if (!ui.isTesting) {
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
                console.log('>> new sprite has been loaded');
                ui.initParams('loadedSprite', spriteWidth, spriteHeight);
              });
              loader.start();
            };
          };
          fr.readAsDataURL(file);
        }
      }, false);

  // Change the mode (editor/test)
  document.addEventListener('click', function (e) {
    if(e.target && (e.target.id === 'button-test' || e.target.parentElement.id === 'button-test')) {
      var btn;
      if (e.target.tagName === "I" || e.target.tagName === "i") {
        btn = e.target.parentElement;
      } else {
        btn = e.target;
      }
      if (btn.getAttribute('data-action') === 'showTest') {
        ui.test();
        btn.outerHTML = '<button id="button-test" data-action="hideTest">' +
            '       <i class="fa fa-pencil" aria-hidden="true"></i>' +
            '    </button>';
      } else {
        ui.stopTest();
        btn.outerHTML = '<button id="button-test" data-action="showTest">' +
            '      <i class="fa fa-eye" aria-hidden="true"></i>' +
            '    </button>';
      }
    }
  });

  // Export the JSON file
  document.getElementById('button-save').addEventListener('click', function () {
    ui.export();
  });
};

/**
 * Loads the default sprite
 */
PolygonUI.prototype.preload = function() {
  this.game.load.image('phaser-logo', 'assets/img/phaser-logo.png');
  this.game.load.image('point', 'assets/img/point.png');
};

/**
 * Initialize the params and add the click listener to add points
 */
PolygonUI.prototype.create = function() {
  this.initParams('phaser-logo', 635, 545);

  this.game.input.onDown.add(function() {
    if (!this.isTesting) {
      if (this.isAValidClick(this.game.input.x, this.game.input.y)) {
        this.points.push(
            new PolygonPoint(this.game.input.x, this.game.input.y, this.game));
      }
    }
  }, this);
};

/**
 * Determines if a click is valid to add a new point, or if it is a click to
 * start a dragging
 *
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
PolygonUI.prototype.isAValidClick = function(x, y) {
  var clickedPoints = this.points.filter(function(point) {
    return point.getBounds().contains(x, y);
  });

  return clickedPoints.length === 0;
};

/**
 * Update the Graphics object displaying the polygon
 */
PolygonUI.prototype.update = function() {
  var simplePoints = [];
  for (var i = 0; i < this.points.length; i++) {
    simplePoints[i * 2] = this.points[i].x;
    simplePoints[(i * 2) + 1] = this.points[i].y;
  }

  if (this.polygonGraphics != null && this.polygonGraphics.visible === false) {
    return;
  }

  if (this.polygonGraphics != null) {
    this.polygonGraphics.destroy();
  }

  this.polygonGraphics = this.game.add.graphics(0, 0);

  this.polygonGraphics.beginFill(0x00ff00, 0.4);
  this.polygonGraphics.drawPolygon(simplePoints);
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
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].destroy();
    }
    this.points = [];
  }
};

/**
 * Exports the polygon in JSON format
 *
 * @returns {string}
 */
PolygonUI.prototype.export = function() {
  var core = new PolygonCore('key', this.points, this.zoom);
  console.log(core.getJSON());
};

/**
 * Show the generated triangles
 */
PolygonUI.prototype.test = function() {
  this.isTesting = true;

  this.sprite.visible = false;
  this.polygonGraphics.visible = false;
  for (var i = 0; i < this.points.length; i++) {
    this.points[i].visible = false;
  }

  var core = new PolygonCore('key', this.points, this.zoom);
  var data = JSON.parse(core.getJSON());

  this.game.physics.startSystem(Phaser.Physics.P2JS);
  this.spriteTest = this.game.add.sprite(this.game.world.centerX,
      this.game.world.centerY, 'phaser-logo');
  this.spriteTest.width = this.sprite.width / this.zoom;
  this.spriteTest.height = this.sprite.height / this.zoom;
  this.game.physics.p2.enable(this.spriteTest, true);
  this.spriteTest.visible = false;
  this.spriteTest.body.clearShapes();
  this.spriteTest.body.loadPolygon(null, data.key);
};

/**
 * Gets back to the normal view
 */
PolygonUI.prototype.stopTest = function () {
  this.spriteTest.destroy();

  this.sprite.visible = true;
  this.polygonGraphics.visible = true;
  for (var i = 0; i < this.points.length; i++) {
    this.points[i].visible = true;
  }

  this.isTesting = false;
};