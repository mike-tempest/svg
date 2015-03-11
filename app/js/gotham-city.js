'use strict';

var s = new Snap('.gotham-city'),
  gothamCity,
  initialise,
  loopAnimation,
  rotateElems,
  setupLightAnim;


// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();

Snap.load('img/gotham.svg', function (response) {
  gothamCity = response;

  s.append(gothamCity);
  rotateElems = s.selectAll('.gotham__rotate');

  initialise();
});

initialise = function () {
  loopAnimation();
};

loopAnimation = function () {
  setupLightAnim();
  setTimeout(loopAnimation, 7000);
};

setupLightAnim = function () {
  rotateElems.forEach(function (elem) {
    elem.transform('r60,250,453 s0,0');
  });

  setTimeout(function () {
    window.requestAnimFrame(function () {
      rotateElems.animate({
        transform: 'r0,250,453 s1,1'
      }, 1500, mina.elastic);
    });
  }, 800);
};