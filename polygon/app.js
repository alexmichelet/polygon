var core = new PolygonCore("test", []);
core.addPoint(new PolygonPoint(-2, -2));
core.addPoint(new PolygonPoint(-2, 2));
core.addPoint(new PolygonPoint(2, 2));
core.addPoint(new PolygonPoint(2, -2));
core.addPoint(new PolygonPoint(1, 0));
core.addPoint(new PolygonPoint(0, 1));
core.addPoint(new PolygonPoint(-1, 0));
core.addPoint(new PolygonPoint(0, -1));

console.log(core.getJSON());

// new PolygonUI(640, 640, 'phaser-renderer');