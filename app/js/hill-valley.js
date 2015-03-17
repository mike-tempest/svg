'use strict';

var s = new Snap('.hill-valley'),
  hillValley,
  initialise,
  setupClouds,
  cloud,
  clouds,
  tree,
  leaves,
  treeDim = [],
  leavesDim = [],
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
  tree = s.selectAll('.tree');
  leaves = s.selectAll('.leaves');

  cloud = s.select('.cloud');
  setupClouds();

  for (var i = 0; i < tree.length; i++) {
    treeDim.push(tree[i].getBBox());
  };

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

  // leaves.transform('r0,0,0');

  // leaves.animate({
  //   transform: 'r-10,' + (leaves.getBBox().x + (leaves.getBBox().width / 2)) + ',' + (leaves.getBBox().y + leaves.getBBox().height)
  // }, 2000, function () {
  //   leaves.animate({
  //     transform: 'r25,' + (leaves.getBBox().x + (leaves.getBBox().width / 2)) + ',' + (leaves.getBBox().y + leaves.getBBox().height)
  //   }, 20, mina.easeinout, function (){
  //     leaves.animate({
  //       transform: 'r0,' + (leaves.getBBox().x + (leaves.getBBox().width / 2)) + ',' + (leaves.getBBox().y + leaves.getBBox().height)
  //     }, 1000, mina.elastic);
  //   });
  // });

  for (var i = tree.length - 1; i >= 0; i--) {
    tree[i].animate({
      transform: 'r-5,' + (treeDim[i].x + (treeDim[i].width / 2)) + ',' + (treeDim[i].y + treeDim[i].height)
    }, 2000, function (obj, b) {
      console.log(this);
      s.select('#' + this.id).animate({
        transform: 'r0,0,0'
      }, 1000, mina.elastic);
    });
  };
};

