'use strict';
var vcanvas, ctx;
var food = [];
var flag = 0;
var degree = 0;
var s;

function Snake() {
    this.x = vcanvas.width / 2;
    this.y = vcanvas.height / 2;
    this.d = 0;
    this.scl = 15;
    this.speed = 8;
    this.tail = [];
    this.mouse = {
        x: vcanvas.width / 2,
        y: vcanvas.height / 2,
        scl: 2
    };
    this.collider = {
        x: null,
        y: null,
        scl: 2.5
    };
    this.nowFlag = false;
    this.nowAngle = 0;

    this.eat = function (pos) {
        var a, x, y;
        food.forEach((i, index) => {
            var radian = Math.atan2(this.collider.y - i.y, this.collider.x - i.x);
            a = 10 + i.scl;
            x = this.collider.x - i.x;
            y = this.collider.y - i.y;

            if (a > Math.sqrt((x * x) + (y * y))) {
                var scl, xx, yy;
                scl = this.scl + i.scl;
                xx = this.x - i.x;
                yy = this.y - i.y;

                i.x += Math.cos(radian) * 10;
                i.y += Math.sin(radian) * 10;

                if (scl > Math.sqrt((xx * xx) + (yy * yy))) {
                    this.tail.push({
                        x: null,
                        y: null
                    });
                    food.splice(index, 1);
                    return true;
                }
            } else {
                return false;
            }
        });
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
        var bouncePoint = 40;

        if (degree < 0) {
            degree = degree + 360;
        }
        if (degree > 360) {
            degree = degree - 360;
        }
        
        if (this.x + this.scl > vcanvas.width - bouncePoint) {
            if (this.x + this.scl < vcanvas.width - bouncePoint + 10 && this.nowFlag === false) {
                this.nowAngle = degree;
                this.nowFlag = true;
            } else {
                this.nowFlag = false;
            }
            if (degree % 360 < 180 && degree % 360 > 0) {
                if (this.x + this.scl > vcanvas.width - ((this.nowAngle - 90) * (this.nowAngle - 90) / 405 * 2 + 3)) {
                    degree += 10;
                }
                //위에서 아래
            } else {
                if (this.x + this.scl > vcanvas.width - ((this.nowAngle - 270) * (this.nowAngle - 270) / 405 * 2 + 3)) {
                    degree -= 10;
                }
                //아래에서 위
            } //오른쪽벽
        }

        if (this.x - this.scl < bouncePoint) {
            if (this.x - this.scl > bouncePoint - 10 && this.nowFlag === false) {
                this.nowAngle = degree;
                this.nowFlag = true;
            } else {
                this.nowFlag = false;
            }
            if (degree % 360 > 180 && degree % 360 < 360) {
                if (this.x - this.scl < (this.nowAngle - 270) * (this.nowAngle - 270) / 405 * 2 + 3) {
                    degree += 10;
                }
            } else {
                if (this.x - this.scl < (this.nowAngle - 90) * (this.nowAngle - 90) / 405 * 2 + 3) {
                    degree -= 10;
                }
            } //왼쪽 벽
        }


        if (this.y + this.scl > vcanvas.height - bouncePoint) {
            if (this.y + this.scl < vcanvas.height - bouncePoint + 10 && this.nowFlag === false) {
                this.nowAngle = degree;
                this.nowFlag = true;
            } else {
                this.nowFlag = false;
            }
            if (degree % 360 < 270 && degree % 360 > 90) {
                if(this.y + this.scl > vcanvas.height - ((this.nowAngle - 180) * (this.nowAngle - 180) / 405 * 2 + 3)){
                    degree += 10;
                }
            } else {
                if(this.y + this.scl > vcanvas.height - ((this.nowAngle) * (this.nowAngle) / 405 * 2 + 3)){
                    degree -= 10;
                }
            }
        } //아래쪽 벽

        if (this.y - this.scl < bouncePoint) {
            if (this.y - this.scl > bouncePoint - 10 && this.nowFlag === false) {
                this.nowAngle = degree;
                this.nowFlag = true;
            } else {
                this.nowFlag = false;
            }
            if (degree % 360 < 270 && degree % 360 > 90) {
                if(this.y - this.scl < (this.nowAngle - 180) * (this.nowAngle - 180) / 405 * 2 + 3){
                    degree -= 10;
                }
            } else {
                if(this.y - this.scl < (this.nowAngle - 360) * (this.nowAngle - 360) / 405 * 2 + 3){
                    degree += 10;
                }
            }
        } //위쪽 벽, 여기만 고치면 됨
    }

    this.drawSnake = function () {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(0, 0, this.scl, 0, Math.PI * 2);
        ctx.fill();
        //head
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(7.5, -7.5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(7.5, 7.5, 4, 0, Math.PI * 2);
        ctx.fill();
        //eyes
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(10, -6, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(10, 6, 3, 0, Math.PI * 2);
        ctx.fill();
    };

    this.drawMouse = function () {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(15.5, 3.5, this.mouse.scl, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(16.5, 0, this.mouse.scl, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(15.5, -3.5, this.mouse.scl, 0, Math.PI * 2);
        ctx.fill();
    };

    this.drawTail = function () {
        var i;

        for (i = this.tail.length - 1; i > 0; i--) {
            ctx.beginPath();
            ctx.fillStyle = `rgb(0, ${Math.floor(10 * (i-1))}, 255)`;
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

function createFood() {
    var x, y, scl;
    x = Math.floor(Math.random() * vcanvas.width);
    y = Math.floor(Math.random() * vcanvas.height);
    scl = 5;

    if (food.length < 10) {
        food.push({
            x: x,
            y: y,
            scl: scl
        });
    }
}

function drawFood() {
    for (var i = 0; i < food.length; i++) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(food[i].x, food[i].y, food[i].scl, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
    s.bounce();
    s.update();
    s.updateTail();
    s.eat();
    createFood();
    drawFood();
    s.draw();
    s.drawTail();
}

function init() {
    vcanvas = document.getElementById("myCanvas");
    ctx = vcanvas.getContext("2d");
    s = new Snake();
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
