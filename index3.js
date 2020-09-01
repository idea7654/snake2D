'use strict';
var vcanvas, ctx;
var r_left, r_right, r_up, r_down, sp;
var snake = {
    x: null,
    y: null,
    d: 0,
    xspeed: 0,
    yspeed: 0,
    scl: 30,
    dspeed: 10
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
var rspeed = 10;

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
    var radian = trigo(client.x - snake.x, client.y - snake.y); //역탄젠트 값
    var degree = radian * 180 / Math.PI;

    //snake.d = radian;
    
    if(degree - snake.d * 180 / Math.PI < 0){
      degree = degree + 360;
    }
    console.log(degree);
    /*
    if(degree - snake.d * 180 / Math.PI < 180){
      snake.d += rspeed * Math.PI / 180;
      if(snake.d > (degree + rspeed)* Math.PI / 180){
        //rspeed = 0;
        snake.d = radian;
      }
    }if(degree > 180){
      snake.d -= rspeed * Math.PI / 180;
      if(snake.d < (degree - rspeed) * Math.PI / 180){
        //rspeed = 0;
        snake.d = radian;
      }
    }*/
    
    if(snake.d < 180) {
        if(degree - (snake.d * 180 / Math.PI) < 180){
            snake.d += rspeed * Math.PI / 180;
            if(snake.d > (degree + rspeed)* Math.PI / 180){
            //rspeed = 0;
            snake.d = radian;
            }
        }else{
            snake.d -= rspeed * Math.PI / 180;
            if(snake.d < (degree - rspeed)* Math.PI / 180){
            //rspeed = 0;
            snake.d = radian;
            }
        }
    }//else{
       // if()
    //}

    snake.x += snake.xspeed * Math.cos(radian) * snake.dspeed;
    snake.y += snake.yspeed * Math.sin(radian) * snake.dspeed;

    if (snake.x < client.x && snake.y > client.y) {
        //1사분면
        if (snake.x > client.x - snake.dspeed) {
            snake.xspeed = 0;
            snake.yspeed = 0;
        }
    }
    if (snake.x > client.x && snake.y > client.y) {
        //2사분면
        if (snake.x < client.x + snake.dspeed) {
            snake.xspeed = 0;
            snake.yspeed = 0;
        }
    }
    if (snake.x > client.x && snake.y < client.y) {
        //3사분면
        if (snake.x < client.x + snake.dspeed) {
            snake.xspeed = 0;
            snake.yspeed = 0;
        }
    }
    if (snake.x < client.x && snake.y < client.y) {
        //4사분면
        if (snake.x > client.x - snake.dspeed) {
            snake.xspeed = 0;
            snake.yspeed = 0;
        }
    }
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
        tail.push({x: null, y: null});
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
    for (i = tail.length - 1; i > 0; i-- ){
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
    update();
    updateTail();
    if (eat(food)) { pickLocation(); }
    drawFood();
    drawTail();
    draw();
}

function init() {
    vcanvas = document.getElementById("myCanvas");
    vcanvas.ontouchstart = set_touch;
    ctx = vcanvas.getContext("2d");
    snake.x = vcanvas.width / 2;
    snake.y = vcanvas.height / 2;
    pickLocation();
    setInterval(gameLoop, 100);
}

// key control

function set_touch(evt) {
    client.x = evt.touches[0].clientX;
    client.y = evt.touches[0].clientY;

    snake.xspeed = 1;
    snake.yspeed = 1;
}

function set_key() {
    if(event.keyCode === 37) {
        snake.xspeed += 0.2;
        snake.yspeed += 0.2;
    }
    if(event.keyCode === 39) {
        if(snake.xspeed > 0.5){
            snake.xspeed -= 0.2;
            snake.yspeed -= 0.2;
        }
    }
}

document.onkeydown = set_key;

function trigo(x, y) {
    var radian = Math.atan2(y, x);
    //var degree = radian * 180 / Math.PI;
    return radian;
}
