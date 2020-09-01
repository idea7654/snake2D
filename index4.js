'use strict';
var vcanvas, ctx;
var snake = {
    x: null,
    y: null,
    d: 0,
    scl: 30,
    dspeed: 0,
    speed: 5
};
var tail = [];
var client = {
    x: null,
    y: null
};
var food = {
    x: 500,
    y: 500,
    scl: 10
};
var circle = {
    x: null,
    y: null,
    radius: 100,
    angle: 0
};
var flag = 0;

function pickLocation() {
    var cols, rows;

    cols = Math.floor(vcanvas.width / food.scl);
    rows = Math.floor(vcanvas.height / food.scl);

    food.x = Math.floor(Math.random() * cols) * food.scl;
    food.y = Math.floor(Math.random() * rows) * food.scl;
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x, food.y, food.scl, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
}

function update() {
    //var radian = trigo(client.x - snake.x, client.y - snake.y); //역탄젠트 값

    if (flag === 0) {
        snake.dspeed = 0;
    }

    if (flag === 1) {
        snake.dspeed = -0.01;
    }

    if (flag === 2) {
        snake.dspeed = 0.01;
    }

    snake.x = Math.cos(circle.angle) * circle.radius;
    snake.y = Math.sin(circle.angle) * circle.radius;

    circle.angle += snake.dspeed;

    snake.d = circle.angle;
    
    console.log(snake.x);
}

function updateSt() {
    snake.x += snake.speed * Math.cos(snake.d);
    snake.y += snake.speed * Math.sin(snake.d);
}

function updateTail() {
    var i;

    for (i = tail.length - 1; i > 0; i -= 1) {
        tail[i] = tail[i - 1];
    }
    tail[0] = {
        x: snake.x,
        y: snake.y
    };
}

function eat(pos) {
    var a, x, y;

    a = snake.scl + food.scl;
    x = snake.x - food.x;
    y = snake.y - food.y;

    if (a > Math.sqrt((x * x) + (y * y))) {
        tail.push({
            x: null,
            y: null
        });
        return true;
    } else {
        return false;
    }
}

function drawSnake() {
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(0, 0, snake.scl, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(15, -15, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(15, 15, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
}

function drawTail() {
    var i;

    ctx.fillStyle = 'orange';
    for (i = tail.length - 1; i > 0; i--) {
        ctx.beginPath();
        ctx.arc(tail[i].x, tail[i].y, snake.scl, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
    }
}

function draw() {
    ctx.save();
    ctx.translate(snake.x, snake.y);
    ctx.rotate(snake.d);
    drawSnake();
    ctx.restore();
}

function gameLoop() {
    ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
    if(flag === 0) {
        updateSt();
    }else{
        update();
    }
    updateTail();
    if (eat(food)) {
        pickLocation();
    }
    drawFood();
    drawTail();
    draw();
}

function init() {
    vcanvas = document.getElementById("myCanvas");
    //vcanvas.ontouchstart = set_touch;
    ctx = vcanvas.getContext("2d");
    snake.x = vcanvas.width / 2;
    snake.y = vcanvas.height / 2;
    pickLocation();
    circle.x = snake.x + 5;
    circle.y = snake.y;
    setInterval(gameLoop, 100);
}

// key control
function set_key() {
    if (event.keyCode === 37) {
        flag = 1;
    }
    if (event.keyCode === 39) {
        flag = 2;
    }
}

function set_key_up() {
    if (event.keyCode === 37) {
        flag = 0;
    }
    if (event.keyCode === 39) {
        flag = 0;
    }
}

document.onkeydown = set_key;
document.onkeyup = set_key_up;

function trigo(x, y) {
    var radian = Math.atan2(y, x);
    //var degree = radian * 180 / Math.PI;
    return radian;
}
