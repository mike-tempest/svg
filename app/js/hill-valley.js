'use strict';

var s = new Snap('.hill-valley'),
  hillValley,
  initialise,
  setupClouds,
  cloud,
  clouds,
  animateTrees,
  loopAnimation;


// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();

Snap.load('img/hill-valley.svg', function (response) {
  hillValley = response;

  s.append(hillValley);

  initialise();
});

initialise = function () {
  cloud = s.select('.cloud');
  setupClouds();

  loopAnimation();
};

setupClouds = function () {
  var containerHeight = s.node.offsetHeight / 4,
    containerWidth = s.select('#a').getBBox().w,
    numberOfClouds = 10;

  clouds = s.g();

  for (var i = numberOfClouds; i >= 0; i--) {
    var x = Math.floor(Math.random() * containerWidth),
        y = -Math.floor(Math.random() * containerHeight),
        newCloud = cloud.use(),
        randomScale = Math.random() * (0.9 - 0.2) + 0.2;

    newCloud.attr({
      x: x,
      y: y
    });

    newCloud.transform('s' + randomScale + ' ' + randomScale);

    clouds.add(newCloud);
  }


  s.select('.cloud').before(clouds.attr({
    class: 'hill-valley__clouds'
  }));

  s.select('.cloud').before(clouds.use().attr({
    x: containerWidth,
    opacity: 1,
    class: 'hill-valley__clouds'
  }));
  clouds.add(cloud);
};

loopAnimation = function () {
  console.log('Loop');
  animateTrees();

  setTimeout(loopAnimation, 4000);
};

animateTrees = function () {
  var tree = s.select('.tree'),
    leaves = s.select('.leaves');

  leaves.transform('r0,0,0');

  leaves.animate({
    transform: 'r-10,' + (leaves.getBBox().x + (leaves.getBBox().width / 2)) + ',' + (leaves.getBBox().y + leaves.getBBox().height)
  }, 2000, function () {
    leaves.animate({
      transform: 'r25,' + (leaves.getBBox().x + (leaves.getBBox().width / 2)) + ',' + (leaves.getBBox().y + leaves.getBBox().height)
    }, 20, mina.easeinout, function (){
      leaves.animate({
        transform: 'r0,' + (leaves.getBBox().x + (leaves.getBBox().width / 2)) + ',' + (leaves.getBBox().y + leaves.getBBox().height)
      }, 1000, mina.elastic);
    });
  });

  tree.animate({
    transform: 'r-5,' + (tree.getBBox().x + (tree.getBBox().width / 2)) + ',' + (tree.getBBox().y + tree.getBBox().height)
  }, 2000, function () {
    tree.animate({
      transform: 'r0,' + (tree.getBBox().x + (tree.getBBox().width / 2)) + ',' + (tree.getBBox().y + tree.getBBox().height)
    }, 1000, mina.elastic);
  });
};

