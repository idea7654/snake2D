'use strict';
var vcanvas, ctx;
var r_left, r_right, r_up, r_down, sp;
var s;
var scl = 20;
var food = {
    x: null,
    y: null
};
var client = {
    x: 0,
    y: 0
};

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xspeed = 1;
    this.yspeed = 1;
    this.tail = []; // new

    this.update = function () {
        var radian = trigo(client.x - this.x, client.y - this.y);

        this.x += this.xspeed * Math.cos(radian) * scl;
        this.y += this.yspeed * Math.sin(radian) * scl;
        // -----------------------

        if (this.x - scl < 0) {
            this.x = scl;
        }
        if (this.x + scl > vcanvas.width) {
            this.x = vcanvas.width - scl;
        }
        if (this.y - scl < 0) {
            this.y = scl;
        }
        if (this.y + scl > vcanvas.height) {
            this.y = vcanvas.height - scl;
        }
    };

    this.eat = function (pos) {
        var dx = this.x - pos.x,
            dy = this.y - pos.y,
            d;

        d = Math.sqrt(dx * dx + dy * dy);
        if (d < 1) {
            this.tail.push({
                x: null,
                y: null
            }); // new
            return true;
        } else {
            return false;
        }
    };

    this.dir = function (x, y) {
        this.xspeed = x;
        this.yspeed = y;
    };
}

function drawSnake() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(s.x, s.y, scl, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(s.x + 10, s.y - 10, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s.x + 10, s.y + 10, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function draw() {
    var angle = trigo(client.x - s.x, client.y - s.y) * 180 / Math.PI;
    if (angle > 0) {
        angle = angle;
    }
    if (angle < 0) {
        angle = angle + 360;
    }
    ctx.save();
    ctx.translate(s.x, s.y);
    console.log(angle);
    ctx.rotate(0);
    drawSnake();
    ctx.restore();
}

function clearCanvas() {
    ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
}

function pickLocation() {
    var cols, rows;

    cols = Math.floor(vcanvas.width / scl);
    rows = Math.floor(vcanvas.height / scl);

    food.x = Math.floor(Math.random() * cols) * scl;
    food.y = Math.floor(Math.random() * rows) * scl;
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, scl, scl);
}

function update() {
    if (s.x < client.x) {
        s.dir(1);
    }
    if (s.x > client.x) {
        s.dir(-1);
    }
}

function gameLoop() {
    clearCanvas();
    //update();
    s.update();
    //if (s.eat(food)) { pickLocation(); }
    drawFood();
    drawSnake();
}

function init() {
    vcanvas = document.getElementById("myCanvas");
    vcanvas.ontouchstart = set_key;
    ctx = vcanvas.getContext("2d");
    s = new Snake();
    //pickLocation();
    setInterval(gameLoop, 80);
}

// key control

function set_key(evt) {
    client.x = evt.touches[0].clientX;
    client.y = evt.touches[0].clientY;
}

function trigo(x, y) {
    var radian = Math.atan2(y, x);
    //var degree = radian * 180 / Math.PI;
    return radian;
}
