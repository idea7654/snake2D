'use strict';
var vcanvas, ctx;
var food = {
    x: 500,
    y: 500,
    scl: 10
};
var flag = 0;
var degree = 0;
var s;

function Snake() {
    this.x = vcanvas.width / 2;
    this.y = vcanvas.height / 2;
    this.d = 0;
    this.scl = 30;
    this.speed = 10;
    this.tail = [];
    this.mouse = {
        x: vcanvas.width / 2,
        y: vcanvas.height / 2,
        scl: 3
    };
    this.collider = {
        x: null,
        y: null,
        scl: 5
    };

    this.eat = function (pos) {
        var a, x, y;
        var radian = Math.atan2(this.collider.y - food.y, this.collider.x - food.x);

        a = 20 + food.scl;
        x = this.collider.x - food.x;
        y = this.collider.y - food.y;

        if (a > Math.sqrt((x * x) + (y * y))) {
            var scl, xx, yy;

            scl = this.scl + food.scl;
            xx = this.x - food.x;
            yy = this.y - food.y;

            food.x += Math.cos(radian) * 11;
            food.y += Math.sin(radian) * 11;

            if (scl > Math.sqrt((xx * xx) + (yy * yy))) {
                this.tail.push({
                    x: null,
                    y: null
                });
                return true;
            }
        } else {
            return false;
        }
    };

    this.updateTail = function () {
        var i;

        for (i = this.tail.length - 1; i > 0; i -= 1) {
            this.tail[i] = this.tail[i - 1];
        }
        this.tail[0] = {
            x: this.x,
            y: this.y
        };
    };

    this.update = function () {
        if (flag === 0) {
            this.d = degree / 180 * Math.PI;
            this.x += this.speed * Math.cos(this.d);
            this.y += this.speed * Math.sin(this.d);
            this.mouse.x += this.speed * Math.cos(this.d);
            this.mouse.y += this.speed * Math.sin(this.d);
        }

        if (flag === 1) {
            degree -= 10;
            this.d = degree / 180 * Math.PI;
            this.x += this.speed * Math.cos(this.d);
            this.y += this.speed * Math.sin(this.d);
            this.mouse.x += this.speed * Math.cos(this.d);
            this.mouse.y += this.speed * Math.sin(this.d);
        }

        if (flag === 2) { //right
            degree += 10;
            this.d = degree / 180 * Math.PI;
            this.x += this.speed * Math.cos(this.d);
            this.y += this.speed * Math.sin(this.d);
            this.mouse.x += this.speed * Math.cos(this.d);
            this.mouse.y += this.speed * Math.sin(this.d);
        }

        this.collider.x = this.x + this.collider.scl * (this.speed * Math.cos(this.d));
        this.collider.y = this.y + this.collider.scl * (this.speed * Math.sin(this.d));
        //먹이 흡수
    };

    this.bounce = function () {
        var verAngle = (180 - degree);
        var horAngle = (360 - degree);

        if (this.x + this.scl > vcanvas.width) {
            degree = verAngle;
        }
        
        if(this.x - this.scl < 0) {
            degree = verAngle;
        }
        
        if(this.y + this.scl > vcanvas.height) {
            degree = horAngle;
        }
        
        if(this.y - this.scl < 0) {
            degree = horAngle;
        }
    }

    this.drawSnake = function () {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(0, 0, this.scl, 0, Math.PI * 2);
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
    };

    this.drawMouse = function () {
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
    };

    this.drawTail = function () {
        var i;

        for (i = this.tail.length - 1; i > 0; i--) {
            ctx.beginPath();
            ctx.fillStyle = `rgb(${Math.floor(42.5 * (i-1))}, ${Math.floor(42.5 * (i-1))}, 255)`;
            ctx.arc(this.tail[i].x, this.tail[i].y, this.scl, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    this.draw = function () {
        ctx.save();
        ctx.translate(this.mouse.x, this.mouse.y);
        ctx.rotate(this.d);
        this.drawMouse();
        ctx.restore();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.d);
        this.drawSnake();
        ctx.restore();
    };
}

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

function gameLoop() {
    ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
    s.bounce();
    s.update();
    s.updateTail();
    if (s.eat(food)) {
        pickLocation();
    }
    drawFood();
    s.draw();
    s.drawTail();
    console.log(s.d * 180 / Math.PI);
}

function init() {
    vcanvas = document.getElementById("myCanvas");
    ctx = vcanvas.getContext("2d");
    s = new Snake();
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
