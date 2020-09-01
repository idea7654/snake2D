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
    dspeed: 5
};
var client = {
    x: null,
    y: null
};

function update() {
    var radian = trigo(client.x - snake.x, client.y - snake.y); //역탄젠트 값
    
    snake.d = radian;
    
    snake.x += snake.xspeed * Math.cos(radian) * snake.dspeed;
    snake.y += snake.yspeed * Math.sin(radian) * snake.dspeed;
    //현재 문제 - snake.x값이 소수점 nn자리로 나오기 때문에 멈추질 못하고 계속 움직임.
    //2가지 해결책
    //1. 반올림 또는 버림을 이용한 1픽셀씩 따지기 - 전부 곱한 snake.xspeed * Math.cos(radian) * 10
    //의 값이 1이 안될수도 있고, 비교적 정확한 위치에 가지 못함.
    //2. 현재 스네이크의 위치를 기준으로 사분면으로 나누어 if분기 - client 위치에 도착하기 직전에 멈추기.
    //코드가 길어지나, 비교적 정확한 위치에 갈 수 있음. 또한 멈춤판정은 반드시 스피드보다 커야함.
    //일단 2번으로 구현.
    
    if(snake.x < client.x && snake.y > client.y){
        //1사분면
        if(snake.x > client.x - snake.dspeed){
            snake.xspeed = 0;
            snake.yspeed = 0;
        }
    }
    if(snake.x > client.x && snake.y > client.y){
        //2사분면
        if(snake.x < client.x + snake.dspeed){
            snake.xspeed = 0;
            snake.yspeed = 0;
        }
    }
    if(snake.x > client.x && snake.y < client.y){
        //3사분면
        if(snake.x < client.x + snake.dspeed){
            snake.xspeed = 0;
            snake.yspeed = 0;
        }
    }
    if(snake.x < client.x && snake.y < client.y){
        //4사분면
        if(snake.x > client.x - snake.dspeed){
            snake.xspeed = 0;
            snake.yspeed = 0;
        }
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
    draw();
}

function init() {
    vcanvas = document.getElementById("myCanvas");
    vcanvas.ontouchstart = set_key;
    ctx = vcanvas.getContext("2d");
    snake.x = vcanvas.width / 2;
    snake.y = vcanvas.height / 2;
    setInterval(gameLoop, 100);
}

// key control

function set_key(evt) {
    client.x = evt.touches[0].clientX;
    client.y = evt.touches[0].clientY;

    snake.xspeed = 1;
    snake.yspeed = 1;
}

function trigo(x, y) {
    var radian = Math.atan2(y, x);
    //var degree = radian * 180 / Math.PI;
    return radian;
}
