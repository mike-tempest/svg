'use strict';

var s = new Snap('.kings-landing'),
  animateAlongPath,
  animateGroupAlongPath,
  arrow,
  arrowsAnim,
  kingsLanding,
  cloud,
  cloudAnim,
  arrowGroup,
  sea,
  seaIn,
  seaOut,
  seaTrans,
  runAnim,
  realPath,
  setupClouds,
  setupCannon,
  triggerExplosion,
  cannonAnim,
  cannon,
  cannon2,
  setupArrows,
  initialise;

Snap.load('img/kings-landing.svg', function (response) {
  kingsLanding = response;

  s.append(kingsLanding);

  initialise();
});

initialise = function () {
  sea = s.select('.sea');
  realPath = sea.node.getAttribute('d');
  cloud = s.select('.cloud');

  s.selectAll('.scale0').forEach(function (el) {
    el.transform('s0,0');
  });

  setupClouds();
  setupCannon();
  setupArrows();

  runAnim();
};

setupClouds = function () {
  var containerHeight = s.node.offsetHeight / 3,
    containerWidth = s.node.offsetWidth * 2,
    numberOfClouds = 40;

  for (var i = numberOfClouds; i >= 0; i--) {
    var x = Math.floor(Math.random() * containerWidth),
        y = Math.floor(Math.random() * containerHeight),
        newCloud = cloud.use(),
        randomScale = Math.random() * (0.9 - 0.2) + 0.2;

    newCloud.attr({
      x: x,
      y: y
    });

    newCloud.transform('s' + randomScale + ' ' + randomScale);
  }
};

setupCannon = function () {
  cannon = s.circle(260, 234, 2);
  cannon2 = s.circle(260, 234, 2);

  s.select('.building').before(cannon, cannon2);
  s.select('.building').before(cannon2);
};

cloudAnim = function () {
  cloud.transform('t0,0');
  cloud.animate({
    transform: 't-' + s.node.offsetWidth * 2 + ',0'
  }, 60000, cloudAnim);
};

seaIn = function () {
  sea.animate({
    path: sea.node.dataset.transformPath
  }, 2000, mina.easeout, seaOut);
};

seaOut = function () {
  sea.animate({
    path: realPath
  }, 2000,  mina.easeout, seaIn);
};

seaTrans = function () {
  sea.transform('t0,0');
  sea.animate({
    transform: 't-485.28,0'
  }, 10000, seaTrans);
};

runAnim = function () {
  // initiate sea animation
  seaIn();
  seaTrans();

  cloudAnim();
  cannonAnim();
  arrowsAnim();
};

setupArrows = function () {
  var numberOfArrows = 30;

  arrowGroup = s.svg(0, 0, 600, 600, 0, 0, 379.311, 379.31);
  arrow = s.path('m200,200L210,200');

  arrow.attr({
    stroke: '#000',
    strokeWidth: 1,
    opacity: 0.5
  });

  for (var i = numberOfArrows; i >= 0; i--) {
    var x = Math.floor(Math.random() * (70 - 10) + 10),
        y = Math.floor(Math.random() * (30 - 10) + 10),
        randomAngle = Math.random() * (1 - 10) + 10,
        newArrow = arrow.use();

    newArrow.attr({
      x: x,
      y: y
    }).transform('r' + randomAngle);
    arrowGroup.add(newArrow);
  }

  console.log(arrowGroup);

  s.select('.building').before(arrowGroup);
};

arrowsAnim = function () {
  animateGroupAlongPath(s.select('.arrows-path'), arrowGroup, 0, 2000, function () {});
};

cannonAnim = function () {

  animateAlongPath(s.select('.cannon-path'), cannon, 0, 400, triggerExplosion);
  setTimeout(function () {
    animateAlongPath(s.select('.cannon-path-2'), cannon2, 0, 450, triggerExplosion);
  }, 150);

  setTimeout(cannonAnim, 5000);
};

triggerExplosion = function (element) {
  var elToAnim = s.select(element.node.dataset.transformElement),
    pathLastPoint = Snap.path.getPointAtLength(element, Snap.path.getTotalLength(element)),
    matrix = new Snap.Matrix();
  console.log('triggerExplosion', elToAnim, pathLastPoint);
  elToAnim.animate({
    transform: matrix.scale(3, 3, pathLastPoint.x, pathLastPoint.y),
    opacity: 0
  }, 1500, function () {
    elToAnim.transform('s0,0');
    elToAnim.attr({
      opacity: 1
    });
  });
};

animateGroupAlongPath = function (path, element, start, dur, callback) {
  var len = Snap.path.getTotalLength(path);

  console.log(len, path);
  Snap.animate(start, len, function (value) {
    var movePoint = Snap.path.getPointAtLength(path, value);

    element.transform('t' + movePoint.x + ', ' + -movePoint.y);
  }, dur, mina.easeinout, function () {
    callback(path);
  });
};

animateAlongPath = function (path, element, start, dur, callback) {
  var len = Snap.path.getTotalLength(path);

  console.log(len, path);
  Snap.animate(start, len, function (value) {
    var movePoint = Snap.path.getPointAtLength(path, value);


    console.log(movePoint);

    element.attr({ cx: movePoint.x, cy: movePoint.y });
  }, dur, mina.easeinout, function () {
    callback(path);
  });
};