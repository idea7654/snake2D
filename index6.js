'use strict';
var vcanvas, ctx;
var snake = {
    x: null,
    y: null,
    d: 0,
    scl: 30,
    dspeed: 0,
    speed: 10
};
var tail = [];
var food = {
    x: 500,
    y: 500,
    scl: 10
};
var flag = 0;
var degree = 0;
var mouse = {
    x: null,
    y: null,
    scl: 3
};
var collider = {
    x: null,
    y: null,
    scl: 5
};

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
    if (flag === 0) {
        snake.d = degree / 180 * Math.PI;
        snake.x += snake.speed * Math.cos(snake.d);
        snake.y += snake.speed * Math.sin(snake.d);
        mouse.x += snake.speed * Math.cos(snake.d);
        mouse.y += snake.speed * Math.sin(snake.d);
    }

    if (flag === 1) {
        degree -= 10;
        snake.d = degree / 180 * Math.PI;
        snake.x += snake.speed * Math.cos(snake.d);
        snake.y += snake.speed * Math.sin(snake.d);
        mouse.x += snake.speed * Math.cos(snake.d);
        mouse.y += snake.speed * Math.sin(snake.d);
    }

    if (flag === 2) { //right
        degree += 10;
        snake.d = degree / 180 * Math.PI;
        snake.x += snake.speed * Math.cos(snake.d);
        snake.y += snake.speed * Math.sin(snake.d);
        mouse.x += snake.speed * Math.cos(snake.d);
        mouse.y += snake.speed * Math.sin(snake.d);
    }

    collider.x = snake.x + collider.scl * (snake.speed * Math.cos(snake.d));
    collider.y = snake.y + collider.scl * (snake.speed * Math.sin(snake.d));
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
    var radian = Math.atan2(collider.y - food.y, collider.x - food.x);

    a = 20 + food.scl;
    x = collider.x - food.x;
    y = collider.y - food.y;

    if (a > Math.sqrt((x * x) + (y * y))) {
        var scl, xx, yy;

        scl = snake.scl + food.scl;
        xx = snake.x - food.x;
        yy = snake.y - food.y;

        food.x += Math.round(Math.cos(radian) * 5);
        food.y += Math.round(Math.sin(radian) * 5);

        if (scl > Math.sqrt((xx * xx) + (yy * yy))) {
            tail.push({
                x: null,
                y: null
            });
            return true;
        }
    } else {
        return false;
    }
}

function drawSnake() {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(0, 0, snake.scl, 0, Math.PI * 2);
    ctx.fill();
    //head
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(15, -15, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(15, 15, 5, 0, Math.PI * 2);
    ctx.fill();
    //eyes
}

function drawMouse() {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(31, 7, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(33, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(31, -7, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawTail() {
    var i;

    for (i = tail.length - 1; i > 0; i--) {
        ctx.beginPath();
        ctx.fillStyle = `rgb(${Math.floor(42.5 * (i-1))}, ${Math.floor(42.5 * (i-1))}, 255)`;
        ctx.arc(tail[i].x, tail[i].y, snake.scl, 0, Math.PI * 2);
        ctx.fill();
    }
}

function draw() {
    ctx.save();
    ctx.translate(mouse.x, mouse.y);
    ctx.rotate(snake.d);
    drawMouse();
    ctx.restore();
    ctx.save();
    ctx.translate(snake.x, snake.y);
    ctx.rotate(snake.d);
    drawSnake();
    ctx.restore();
}

function gameLoop() {
    ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
    update();
    updateTail();
    if (eat(food)) {
        pickLocation();
    }
    drawFood();
    draw();
    drawTail();
    
}

function init() {
    vcanvas = document.getElementById("myCanvas");
    ctx = vcanvas.getContext("2d");
    snake.x = vcanvas.width / 2;
    snake.y = vcanvas.height / 2;
    mouse.x = vcanvas.width / 2;
    mouse.y = vcanvas.height / 2;
    pickLocation();
    setInterval(gameLoop, 80);
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
