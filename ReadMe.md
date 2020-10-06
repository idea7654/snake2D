# Snake2D

___

- 1단계 - 터치 이벤트로 움직이는 동그란 스네이크
- 2단계 - 1단계에서 먹이를 추가
- 3단계 - 입 추가, 터치 -> 키이벤트로 변경
- 4단계 - 키 입력이 없을 때 직진 구현
- 5단계 - Collider 구현
- 6단계 - 꼬리 그라데이션, 눈매 구현
- 7단계 - 벽 충돌 구현, 클래스화
- 8단계 - 다중 먹이 구현
- 9단계 - 벽 충돌 판정 업데이트
- 10단계 - 미러링

___

## 1단계

기존의 터치이벤트를 기반으로 클릭하면 해당 위치로 이동하는 스네이크

```javascript
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

function trigo(x, y) {
    var radian = Math.atan2(y, x);
    //var degree = radian * 180 / Math.PI;
    return radian;
}
```

___

## 2단계

___

1단계를 바탕으로 기존 스네이크 게임에 먹이를 추가

다만, 먹이의 충돌이 사각형&사각형에서 원&원으로 바뀜

```javascript
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
```

___

## 3단계

___

스네이크에 입을 달아주고 키 이벤트로 바꾸어주었다.

오른쪽이나 왼쪽 키 이벤트가 발생하면 지속적으로 각도를 + 또는 -하여 회전하며 전진하도록 만들었다.

또한, 입은 얼굴과 같은 각도로 움직여야 하므로 drawSnake안에서 그리고 draw함수에서 회전시켰다.

```javascript
function update() {
    if (flag === 1) {
        degree -= 10;
        snake.d = degree / 180 * Math.PI;
        snake.x += snake.speed * Math.cos(snake.d);
        snake.y += snake.speed * Math.sin(snake.d);
    }
    
    if (flag === 2) { //right
        degree += 10;
        snake.d = degree / 180 * Math.PI;
        snake.x += snake.speed * Math.cos(snake.d);
        snake.y += snake.speed * Math.sin(snake.d);
    }
}

function drawSnake() {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(31, 7, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(33, 0, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(31, -7, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    //mouse
}

function draw() {
    ctx.save();
    ctx.translate(snake.x, snake.y);
    ctx.rotate(snake.d);
    drawSnake();
    ctx.restore();
}

function set_key() {
    if (event.keyCode === 37) {
        flag = 1;
    }
    if (event.keyCode === 39) {
        flag = 2;
    }
}

document.onkeydown = set_key;
```

___

## 4단계

___

스네이크가 오른쪽 키나 왼쪽 키가 눌려있지 않을 때 직진하도록 만들었다.

기존의 스네이크는 직진으로 가는게 너무 어려웠기 때문이다.

키 이벤트 입력을 감지하는 flag에 onkeyup이벤트를 붙여 0 값을 주고, 0값이 되면 현재 각도로 전진하도록 만들었다.

또한, 입 그리는 것을 drawSnake에서 빼내어 drawMouse 안으로 이동시켰다.

```javascript
function update() {
    if (flag === 0) { //noting
        snake.d = degree / 180 * Math.PI;
        snake.x += snake.speed * Math.cos(snake.d);
        snake.y += snake.speed * Math.sin(snake.d);
        mouse.x += snake.speed * Math.cos(snake.d);
        mouse.y += snake.speed * Math.sin(snake.d);
    }

    if (flag === 1) { //left
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
}
```

___

## 5단계

___

먹이에 가까이 다가가면 먹이가 스네이크의 입으로 빨려들어가는 연출을 구현하였다.

스네이크와 함께 움직이며 스네이크의 입보다 20만큼 앞에서 충돌을 판정하는 원형 collider를 만들고,

해당 collider에서 충돌판정이 일어나면 Snake쪽으로 이동하도록 하였다.

```javascript 
var collider = {
    x: null,
    y: null,
    scl: 5
};
//snake 오브젝트 생성
function eat(pos) {
    var a, x, y;
    var radian = Math.atan2(collider.y - food.y, collider.x - food.x);
		//collider와 food의 역탄젠트값
    a = 20 + food.scl;
    x = collider.x - food.x;
    y = collider.y - food.y;

    if (a > Math.sqrt((x * x) + (y * y))) {
        var scl, xx, yy;
        
        scl = snake.scl + food.scl;
        xx = snake.x - food.x;
        yy = snake.y - food.y;
				//collider와 food가 충돌하면
        food.x += Math.round(Math.cos(radian) * 5);
        food.y += Math.round(Math.sin(radian) * 5);
				//food가 이동
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

function update() {
    //...
    collider.x = snake.x + collider.scl * (snake.speed * Math.cos(snake.d));
    collider.y = snake.y + collider.scl * (snake.speed * Math.sin(snake.d));
  //collider도 스네이크와 함께 회전
}
```

___

## 6단계

____

배경색을 검은색으로 바꾸고 꼬리와 Head의 그리는 순서를 바꾸어 꼬리가 먼저 그려지게 함.

이로 인해 눈이 꼬리에 조금 가려지게 되면서 눈이 사나워보이는 효과를 얻을 수 있었다.

또한, 꼬리가 생성될 때마다 색깔을 조금씩 옅게 만들어 그라데이션 효과를 얻었다.

```html
<canvas id="myCanvas" width="600" height="600" style="border:1px solid #000000; background-color: black;">
      이 브라우져는 HTML5 canvas 태그를 제공하기 않습니다.
   </canvas>
```

```javascript
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

function drawTail() {
    var i;

    for (i = tail.length - 1; i > 0; i--) {
        ctx.beginPath();
        ctx.fillStyle = `rgb(${Math.floor(42.5 * (i-1))}, ${Math.floor(42.5 * (i-1))}, 255)`; //색깔 바꾸기
        ctx.arc(tail[i].x, tail[i].y, snake.scl, 0, Math.PI * 2);
        ctx.fill();
    }
}
```

___

## 7단계

___

벽 충돌 판정을 구현하였다.

현재는 스네이크의 Head가 벽에 충돌하게 되면 입사각에 따른 반사각을 새로운 각도로 입력하여

마치 공이 튕기듯이 튕기도록 구현하였다.

또한, 기존에 만들었던 코드들을 class화 하였다.

```javascript
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
```

___

## 8단계

___

스네이크의 크기를 줄이고, 먹이를 10개까지 생성하였다.

먹이가 사라지게 되면 자동으로 다시 생성되며, 수를 10개로 제한하였다.

```javascript
var food = []; //생성된 먹이를 관리하기 위해 배열에 값을 할당하였다.

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
                    food.splice(index, 1);//충돌할경우 충돌한 먹이를 삭제
                    console.log(index);
                    return true;
                }
            } else {
                return false;
            }
        });//모든 먹이에 대해 충돌판정을 검사
    };

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
        });//Food의 개수가 10개가 넘지 않도록 관리
    } 
}

function drawFood() {
    for (var i = 0; i < food.length; i++) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(food[i].x, food[i].y, food[i].scl, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
    } //현재 배열에 담겨있는 Food들을 그림
}
```

___

## 9단계(미완성)

___

Snake의 벽 충돌판정을 공 튀기기처럼 즉각적인 반응이 아닌, 부드럽게 회전하는 물리법칙을 사용하고자 하였다.

우선, 서서히 꺾는 판정은 입사-반사각과 달리 한 면에서도 어느쪽에서 접근하는지 알아야했기에 if문으로 분기하였다.

이후로 현재는 상수로 값을 지정하여 어떤 각도를 입사각으로 받아도 똑같은 속도로 움직이나,

벽에 충돌하지 않고 이를 해결하기 위해서는

매 틱마다 회전하는 각도의 크기는 「각도의 크기」와 반비례하여야 한다.

```javascript
this.bounce = function () {
        var verAngle = (180 - degree);
        var horAngle = (360 - degree);
        if (degree < 0) {
            degree = degree + 360;
        }
        if (degree > 360) {
            degree = degree - 360;
        }
        if(horAngle < 0){
            horAngle = horAngle + 360;
        }

        if (this.x + this.scl > vcanvas.width - 10) {
            if(degree % 360 < 180 && degree % 360 > 0) {
                degree += 10;
            }
            else{
                degree -= 10;
            }
        }

        if (this.x - this.scl < 10) {
            console.log(degree);
            if(degree % 360 > 180 && degree % 360 < 360){
                //degree += Math.abs(verAngle - degree) / (각도의 크기);
                degree += 10;
            }else{
                degree -= 10;
            }
        }

        if (this.y + this.scl > vcanvas.height - 10) {
            console.log(degree);
            if(degree % 360 < 270 && degree % 360 > 90) {
                degree += 10;
            }
            else{
                degree -= 10;
            }
        }

        if (this.y - this.scl < 10) {
            if(degree % 360 < 270 && degree % 360 > 90) {
                degree -= 10;
            }
            else{
                degree += 10;
            }
        }
    }
```

___

## 10단계(미완성)

___

MultiSnake에서 했던 것처럼 2D Snake도 Node.js의 Socket.io를 사용하여 미러링을 구현하고자 한다.

