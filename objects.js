class Player {
  constructor() {
    this.x=200, this.y=400; // start position
    this.speed;
  }

  display() {
    push();
    imageMode(CENTER);
    if (keyIsDown(LEFT_ARROW)) {
      push();
      fill('blue');
      stroke(0);
      //ellipse(this.x,this.y,20,20);
      image(nihofieldl,this.x,this.y);
      pop();
      } else if (keyIsDown(RIGHT_ARROW)) {
      push();
      fill('red');
      stroke(0);
      //ellipse(this.x,this.y,20,20);
      image(nihofieldr,this.x,this.y);
      pop();
    } else if (keyIsDown(UP_ARROW)) {
      push();
      fill('white');
      stroke(0);
      //ellipse(this.x,this.y,20,20);
      image(nihofield0,this.x,this.y);
      pop();
    } else if (keyIsDown(DOWN_ARROW)) {
      push();
      fill('black');
      stroke(0);
      //ellipse(this.x,this.y,20,20);
      image(nihofield0,this.x,this.y);
      pop();
    }
    else {
      push();
      fill('green');
      stroke(0);
      //ellipse(this.x,this.y,20,20);
      image(nihofield0,this.x,this.y);
      pop();
    }
    pop();
    push();
    fill('red');
    stroke('white');
    ellipse(this.x,this.y,8,8);
    pop(); // niho hitbox

  }

  movement() {
  if (keyIsDown(LEFT_ARROW)&&this.x>8) {
      this.x-=this.speed;
    } 
  if (keyIsDown(RIGHT_ARROW)&&this.x<400-8) {
      this.x+=this.speed;
    } 
  if (keyIsDown(UP_ARROW)&&this.y>8) {
      this.y-=this.speed;
    } 
  if (keyIsDown(DOWN_ARROW)&&this.y<480-8) {
      this.y+=this.speed;
    }
  }

  miss() {
    for (var i=0; i<eBulletsSpawned.length; i++) {
      if (dist(this.x,this.y,eBulletsSpawned[i].x,eBulletsSpawned[i].y)<8) {
        eBulletsSpawned.splice(i,1);
        return true;
      }
    }
    for (var i=0; i<enemiesSpawned.length; i++) {
      if (dist(enemiesSpawned[i].active==true&&this.x,this.y,enemiesSpawned[i].x,enemiesSpawned[i].y)<14) {
        return true;
      }
    }
    return false;
  }

  graze() {
    for (var i=0; i<eBulletsSpawned.length; i++) {
      if (8<dist(this.x,this.y,eBulletsSpawned[i].x,eBulletsSpawned[i].y)&&dist(this.x,this.y,eBulletsSpawned[i].x,eBulletsSpawned[i].y)<30&&eBulletsSpawned[i].grazed==false) {
          eBulletsSpawned[i].grazed=true;
            return true;
        }
      }
    return false;
  }

}

class Enemy {

  constructor(x,y,xVel,yVel,xAcc,yAcc,type) {
    this.x=x, this.y=y;
    this.xVel=xVel, this.yVel=yVel;
    this.xAcc=xAcc, this.yAcc=yAcc;
    this.active=false;
    this.type=type;
    this.hit=0;
    if (this.type==0) {
      this.hitPoints=8;
      this.hitBox=20
    }
    if (this.type==1) {
      this.hitPoints=40;
      this.hitBox=30;
    }
    if (this.type==2) {
      this.hitPoints=300;
      this.hitBox=30;
    }
    if (this.type==3) {
      this.hitPoints=999999;
      this.hitBox=30;
    }
  }

  display() {
    push();
    imageMode(CENTER);
    if (this.type==0) {
      image(enemy0,this.x,this.y);
      // push();
      // stroke(255);
      // fill('green');
      // ellipse(this.x,this.y,20,20);
      // pop();
    }
    if (this.type==1) {
      image(enemy1,this.x,this.y);
      // push();
      // stroke(255)
      // fill('blue');
      // ellipse(this.x,this.y,30,30);
      // pop();
    }
    if (this.type==2) {
      image(enemy2,this.x,this.y);
      // push();
      // stroke(255)
      // fill('red');
      // ellipse(this.x,this.y,30,30);
      // pop();
    }
    if (this.type==3) {
      image(anenefield,this.x,this.y);
      // push();
      // stroke('red')
      // fill('white');
      // ellipse(this.x,this.y,30,30);
      // pop();
    }
    pop();
  }

  update() {
    this.x+=this.xVel;
    this.y+=this.yVel;
  }

  offScreen() {
    return(this.x>430||this.x<-30||this.y>510||this.y<-30);
  }

  miss() {
    for (var i=0;i<pBulletsSpawned.length; i++) {
      if (dist(this.x,this.y,pBulletsSpawned[i].x,pBulletsSpawned[i].y)<this.hitBox) {
        this.hit++;
        pBulletsSpawned[i].hit=true;
      }
    }
    for (var i=0; i<pBombsSpawned.length; i++) {
      if (dist(this.x,this.y,pBombsSpawned[i].x,pBombsSpawned[i].y)<this.hitBox+pBombsSpawned[i].r/2) {
        this.hit+=42;
      }
    }
    if (this.hit>this.hitPoints) {
      return true;
    }
  }

}

class Shot {

  constructor(x,y,type,speed,theta) {
    this.speed=speed;
    this.theta=theta;
    this.x=x;
    this.y=y;
    this.type=type;
    this.grazed=false;
    this.hit=false;
  }

  display() {
    if (this.type==0) {
      push();
      stroke('red');
      fill(255);
      ellipse(this.x,this.y,8,8);
      pop();
    }
    if (this.type==1) {
      push();
      stroke('blue');
      fill(255);
      ellipse(this.x,this.y,8,8);
      pop();
    }
    if (this.type==2) {
      push();
      stroke('green');
      fill(255);
      ellipse(this.x,this.y,12,12);
      pop();
    }
  }

  update() {
    this.xVel=this.speed*cos(this.theta);
    this.yVel=this.speed*sin(this.theta);
    this.x+=this.xVel;
    this.y+=this.yVel;
  }

  miss() {
    for (var i=0; i<pBombsSpawned.length; i++) {
      if (dist(this.x,this.y,pBombsSpawned[i].x,pBombsSpawned[i].y)<10+pBombsSpawned[i].r/2) {
        return true;
      }
    }
    return false;
  }

  offScreen() {
    return(this.x>430||this.x<-30||this.y>510||this.y<-30);
  }
}

class Bomb {

  constructor(x,y) {
      this.x=x;
      this.y=y;
      this.r=0;
      this.alpha=255;
  }

  display() {
      push();
      noFill();
      stroke(0,0,255,this.alpha-42);
      strokeWeight(3);
      ellipse(this.x,this.y,this.r);
      stroke(255,this.alpha-28);
      strokeWeight(2.8);
      ellipse(this.x,this.y,this.r);
      stroke(0,0,255,this.alpha-30);
      strokeWeight(3);
      ellipse(this.x,this.y,this.r-16);
      stroke(255,this.alpha-16);
      strokeWeight(2.8);
      ellipse(this.x,this.y,this.r-16);
      stroke(0,0,255,this.alpha-14);
      strokeWeight(3);
      ellipse(this.x,this.y,this.r-28);
      stroke(255,this.alpha);
      strokeWeight(2.8);
      ellipse(this.x,this.y,this.r-28);
      pop();
  }

  update() {
      this.r+=8;
      this.alpha-=4;
  }

  end() {
      return (this.r>400);
  }

}