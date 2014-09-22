// start slingin' some d3 here.
var gameOptions = {
  height: 600,
  width: 700,
  radiusMax: 82,
  radiusMin: 3,
  bubbles: 15,
  delay: 200,
  duration: 100,
  speed: 200,
  current: 0,
  sortPosition: 0,
  n: undefined,
  sorted: false
};

function optionChange(valName, value) {
  gameOptions[valName] = parseInt(value);
};
var body = d3.selectAll('body');
var svg = body.append('svg:svg').attr('height', gameOptions.height).attr(
  'width', gameOptions.width * 1.5);

function updateSort(data) {
  var bubbles = svg.selectAll('.bubble').data(data);
  if (gameOptions.n === undefined) {
    gameOptions.n = data.length;
  }
  data = bubbleSort(data, gameOptions.sortPosition, gameOptions.n);
  bubbles.transition().delay(gameOptions.delay).duration(gameOptions.duration)
    .attr('cx', function(d) {
      return d.x;
    }).attr('cy', function(d) {
      return d.y;
    }).attr('r', function(d) {
      return d.r;
    });
  // REMOVE sorted bubbles
  var sorted = svg.selectAll('.sorted').transition().delay(1500).duration(
    1500).attr('cy', 0 - gameOptions.radiusMax * 1.5).remove();
};

function init(data) {
  var bubbles = svg.selectAll('.bubble').data(data);
  //NEW bubbles CREATED
  bubbles.enter().append('circle').attr('class', 'bubble').attr('r', function(
    d) {
    return d.r;
  }).attr('cx', function(d) {
    return d.x;
  }).attr('cy', function(d) {
    return gameOptions.height + gameOptions.radiusMax * 1.5;
  }).transition().duration(750).attr('cy', function(d) {
    return d.y;
  });
  updateSort(data);
};
var updateInt;

function start() {
  gameOptions.n = undefined;
  init(generatePositions(gameOptions.bubbles));
  updateInt = setInterval(function() {
    var data = svg.selectAll('.bubble').data();
    updateSort(data);
  }, gameOptions.speed);
  gameOptions.current = 0;
};
start();

function generatePositions(totalBubbles) {
  var positionArray = [];
  for (var i = 0; i < totalBubbles; i++) {
    var xVal = gameOptions.width * .25 + i * (gameOptions.width /
      totalBubbles);
    var yVal = gameOptions.height / 2;
    var radius = Math.floor(Math.random() * gameOptions.radiusMax) +
      gameOptions.radiusMin;
    positionArray.push({
      x: xVal,
      y: yVal,
      r: radius,
      o: i
    });
  }
  return positionArray;
};

function bubbleSort(array, i, n) {
  i = i === undefined ? 0 : i;
  var swapped = false;
  while (!swapped && i < n - 1) {
    if (array[i].r > array[i + 1].r) {
      var temp = array[i];
      array[i] = array[i + 1];
      array[i + 1] = temp;
      temp = array[i].r;
      array[i].r = array[i + 1].r;
      array[i + 1].r = temp;
      swapped = true;
      gameOptions.current++;
      var currentScoreDiv = body.select('.current').select('span');
      currentScoreDiv.text(gameOptions.current);
    }
    i++;
  }
  if (!swapped) {
    var sorted = true;
    for (var j = 0; j < array.length - 1; j++) {
      if (array[j].r > array[j + 1].r) {
        sorted = false;
      }
    }
    if (sorted) {
      var bubbles = svg.selectAll('.bubble');
      bubbles.attr('class', 'sorted');
      clearInterval(updateInt);
      setTimeout(function() {
        start();
      }, 2000);
      array = [];
    }
  }
  gameOptions.sortPosition = i;
  if (gameOptions.sortPosition >= array.length - 1) {
    gameOptions.sortPosition = 0;
  }
  return array;
}