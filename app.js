var maxWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

var maxHeight = (window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight) - 50;

var ui = new PolygonUI(maxWidth, maxHeight, 'phaser-renderer');