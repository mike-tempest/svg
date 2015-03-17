'use strict';

var s = new Snap('.hill-valley'),
  hillValley,
  initialise,
  setupClouds,
  animateText,
  textElems,
  cloudWidth,
  cloud,
  clouds,
  cloudsCont,
  tree,
  leaves,
  treeDim = [],
  leavesDim = [],
  car,
  animateClouds,
  animateCar,
  carStartMatrix = new Snap.Matrix(),
  carMidMatrix = new Snap.Matrix(),
  carEndMatrix = new Snap.Matrix(),
  animateTrees,
  treeAnim,
  leavesAnim,
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
  car = s.select('.car');
  cloudsCont = s.select('.hill-valley__clouds');
  textElems = s.selectAll('.text');

  cloud = s.select('.cloud');

  setupClouds();

  carStartMatrix.rotate(10);
  carStartMatrix.translate(0,-50);
  carMidMatrix.rotate(-15);
  carMidMatrix.translate(300,-20);
  carEndMatrix.rotate(-10);
  carEndMatrix.translate(-20,10);

  for (var i = 0; i < tree.length; i++) {
    treeDim.push(tree[i].getBBox());
    leavesDim.push(leaves[i].getBBox());
  };

  loopAnimation();
};

setupClouds = function () {
  var containerHeight = s.node.offsetHeight / 4,
    numberOfClouds = 10;

  cloudWidth = s.select('#a').getBBox().w;

  clouds = s.g();

  for (var i = numberOfClouds; i >= 0; i--) {
    var x = Math.floor(Math.random() * cloudWidth),
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


  cloudsCont.append(clouds);

  for (var i = 0; i < 5; i++) {
    cloudsCont.append(clouds.use().attr({
      x: cloudWidth * (i + 1),
      opacity: 1
    }));
  }
  clouds.add(cloud);
};

animateText = function () {
  var amount = 20/textElems.length;

  setTimeout(function () {
    for (var i = 1; i < textElems.length; i++) {
      textElems[i].animate({
        'transform': 't' + (amount * i) + ',-' + (amount * i)
      }, 250, mina.easeinout, function () {
        setTimeout(function () {
          textElems.animate({
            transform: 't0,0'
          }, 750, mina.easeinout);
        }, 500);
      });
    };
  }, 1250);
};

loopAnimation = function () {
  animateTrees();
  animateCar();
  animateClouds();
  animateText();

  setTimeout(loopAnimation, 4000);
};

animateCar = function () {
  car.animate({
    transform: carStartMatrix
  }, 1250, mina.easeinout, function () {
    car.animate({
      transform: carMidMatrix
    }, 250, function () {
      car.transform('t-300,-150');
      setTimeout(function () {
        car.animate({
          transform: carEndMatrix
        }, 750, mina.backout, function () {
          car.animate({
            transform: 't0,0'
          }, 750)
        });
      }, 500);
    });
  });
};

animateClouds = function () {
  cloudsCont.transform('t0,0');
  cloudsCont.animate({
    transform: 't-25,0'
  }, 1250, function () {
    cloudsCont.animate({
      transform: 't-' +  ((cloudWidth * 5) - 50) + ',0'
    }, 750, mina.easein, function () {
      cloudsCont.animate({
        transform: 't-' +  (cloudWidth * 5) + ',0'
      }, 1750);
    });
  });
};

animateTrees = function () {
  for (var i = tree.length - 1; i >= 0; i--) {
    treeAnim(i);
    leavesAnim(i);
  };
};

leavesAnim = function (index) {
  leaves[index].animate({
    transform: 'r-10,' + (leavesDim[index].x + (leavesDim[index].width / 2)) + ',' + (leavesDim[index].y + leavesDim[index].height)
  }, 1250, function () {
    leaves[index].animate({
      transform: 'r25,' + (leavesDim[index].x + (leavesDim[index].width / 2)) + ',' + (leavesDim[index].y + leavesDim[index].height)
    }, 20, mina.easeinout, function (){
      leaves[index].animate({
        transform: 'r0,' + (leavesDim[index].x + (leavesDim[index].width / 2)) + ',' + (leavesDim[index].y + leavesDim[index].height)
      }, 1000, mina.elastic);
    });
  });

};

treeAnim = function (index) {
  tree[index].animate({
    transform: 'r-5,' + (treeDim[index].x + (treeDim[index].width / 2)) + ',' + (treeDim[index].y + treeDim[index].height)
  }, 1250, function () {
    tree[index].animate({
      transform: 'r0,0,0'
    }, 1000, mina.elastic, function () {
      tree[index].animate({
        transform: 'r8,' + (treeDim[index].x + (treeDim[index].width / 2)) + ',' + (treeDim[index].y + treeDim[index].height)
      }, 150, function () {
        tree[index].animate({
          transform: 'r0,' + (treeDim[index].x + (treeDim[index].width / 2)) + ',' + (treeDim[index].y + treeDim[index].height)
        }, 1000, mina.elastic);
      });
    });
  });
};