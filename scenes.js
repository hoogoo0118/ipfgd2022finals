function titleScreen() {
    image(titleScreenTemp,0,0);

    image(newGameButton,20,360,240,75);
    if (mouseIsPressed==true&&mouseX>20&&mouseX<260&&mouseY>360&&mouseY<435) {
        gameStartTime=int(millis()/1000);
        clearsound.play();
        gameScene=1; // moves on to actual game
        gameStartFrame=frameCount;
    }
}

function inGame() {
    if (textOn==false&&frameCount%10==0) {
        score++;
    }
    readMainScript(gameScriptTest);
    //------------------------------Background----------------------------------
    image(bg0,0,bg0y,400,3600);
    image(bg1,0,bg1y,400,800);
    image(bg1,0,bg2y,400,800);
    bg0y+=bg0yScroll; // layer 0 scroll
    bg1y+=bg1yScroll; // layer 1 scroll
    if (scrollCheck==1&&bg0yScroll<=1.2&&bg1yScroll<=2.0) { // start scrolling
        bg0yScroll+=0.005;
        bg1yScroll+=0.02;
    } else if (scrollCheck==2&&bg0yScroll>0&&bg1yScroll>0) { // stop scrolling
        bg0yScroll-=0.005;
        bg1yScroll-=0.02;
    }

    if (bg1y>800) { // layer 1 loop
        bg1y=0;
    }
    bg2y=bg1y-800;

    // if (musicPlaying==true) {
    //     currentMusic.loop();
    // } else {
    //     currentMusic.pause();
    // }

    if (nihoHitboxOn==true) {
        niho.display();
    } else if (nihoHitboxOn==false) { // flashing after hit
        if (frameCount%4==0) {
            niho.display(); // display before enemy elements
        }
    }

    //------------------------------Enemy --------------------------------
    for (var i=0;i<enemiesSpawned.length;i++) {
        if (enemiesSpawned[i].active==true) {
            enemiesSpawned[i].display();
            enemiesSpawned[i].update();
            if (enemiesSpawned[i].miss()) {
                enemiesSpawned[i].active=false;
                if (enemiesSpawned[i].type==0) {
                    score+=80;
                }
                if (enemiesSpawned[i].type==1) {
                    score+=120;
                }
                if (enemiesSpawned[i].type==0) {
                    score+=200;
                }
                console.log("Enemy killed");
            }
            if (enemiesSpawned[i].offScreen()) {
                enemiesSpawned[i].active=false;
            }
        }
    }

    for (var i=0;i<eBulletsSpawned.length;i++) { // enemy bullets
        eBulletsSpawned[i].display();
        eBulletsSpawned[i].update();
        if (eBulletsSpawned[i].offScreen()||eBulletsSpawned[i].miss()) {
            eBulletsSpawned.splice(i,1);
        }
    }

    //------------------------------Niho----------------------------------

    if (keyIsDown(16)) {
        niho.speed=2.4;
    } else {
        niho.speed=5;
    } // speed check (shooter mode)
    niho.movement();
    
    if (niho.miss()&&nihoHitboxOn==true) { // hit check
        misssound.play();
        lifeCount-=1;
        totalMissed++;
        bombCount=3;
        missFrame=frameCount;
        nihoHitboxOn=false;
        console.log("Missed!");
    }
    if (lifeCount<1) {
        currentMusic.pause();
        gameEndTime=int(millis()/1000);
        gameoversound.play();
        gameScene=3; // game over
    }
    if ((frameCount-missFrame)>100) { // 100 frame invulnerability after hit
        nihoHitboxOn=true;
    }
    if (niho.graze()) { // graze check 
        grazesound.play();
        totalGrazed++;
        score+=16;
        console.log("Grazed!");
    }

    if (keyIsDown(90)&&frameCount%8==0&&textOn==false) {
        shotsound2.play();
        if (keyIsDown(16)) { // slowmode shot
            for (let i=0; i<4; i++) {
                newShot=new Shot(niho.x,niho.y,1,6,264+4*i);
                pBulletsSpawned.push(newShot);
            }
        } else { // normal shot
            for (let i=0; i<4; i++) {
                newShot=new Shot(niho.x,niho.y,1,6,246+16*i);
                pBulletsSpawned.push(newShot);
            }
        }
        score+=0.02*scoreMultiplier;
    }
    for (var i=0; i<pBulletsSpawned.length; i++) { // display bullets
        pBulletsSpawned[i].display();
        pBulletsSpawned[i].update();
        if (pBulletsSpawned[i].offScreen()||pBulletsSpawned[i].hit==true) {
            pBulletsSpawned.splice(i,1);
        }
    }

    //------------------------------Bomb   --------------------------------
    if (keyIsDown(88)&&bombActive==false&&bombCount>0&&textOn==false) {
        bombsound.play();
        newBomb=new Bomb(niho.x,niho.y);
        pBombsSpawned.push(newBomb);
        bombActive=true
        nihoHitboxOn=false;
        bombCount-=1;
        totalBombed++;
    }
    for (var i=0;i<pBombsSpawned.length;i++) {
        pBombsSpawned[i].display();
        pBombsSpawned[i].update();
        if (pBombsSpawned[i].end()) {
            pBombsSpawned.splice(i,1);
            bombActive=false;
            nihoHitboxOn=true;
        }
    }

    //------------------------------Text   ------------------------------
    if (textOn==true) {
        readTextScript(currentTextFile);
    } else {
        return;
    }

}

function readMainScript(mainScript) {
    if (textOn==false) {
        currentFrame=frameCount-gameStartFrame;
    } else if (textOn==true) {
        return;
    }
    //console.log("currentFrame: "+currentFrame,"gameStartFrame: "+gameStartFrame);
    for (i=0;i<mainScript.length;i++) {
        if (mainScript[i][0]==currentFrame) {
            console.log("read line: "+i);
            // -------------------------------- scroll
            if (mainScript[i][1]=="SCROLL") {
                if (mainScript[i][2]=="START") {
                    scrollCheck=1;
                    console.log("start scroll");
                } 
                else if (mainScript[i][2]=="STOP") {
                    scrollCheck=2;
                    console.log("stop scroll");
                }
            }
            // -------------------------------- enemy spawn 
            else if (mainScript[i][1]=="ENEMYSPAWN") {
                for (j=0;j<mainScript[i][3];j++) {
                    let newEnemy=new Enemy(-25,-25,0,0,0,0,float(mainScript[i][2]));
                    enemiesSpawned.push(newEnemy);
                }
            }
            // -------------------------------- enemy movement
            else if (mainScript[i][1]=="ENEMY") {
                if (mainScript[i][2]=="SET") {
                    enemiesSpawned[mainScript[i][3]].active=true;
                    enemiesSpawned[mainScript[i][3]].x=float(mainScript[i][4]);
                    enemiesSpawned[mainScript[i][3]].y=float(mainScript[i][5]);
                    // console.log(enemiesSpawned[mainScript[i][3]].x)
                }
                else if (mainScript[i][2]=="MOVE") {
                    enemiesSpawned[mainScript[i][3]].xVel=float(mainScript[i][4]);
                    enemiesSpawned[mainScript[i][3]].yVel=float(mainScript[i][5]);
                }
                else if (mainScript[i][2]=="STOP") {
                    enemiesSpawned[mainScript[i][3]].xVel=0
                    enemiesSpawned[mainScript[i][3]].yVel=0
                }
            }
            //------------------------------ enemy shots
            else if (mainScript[i][1]=="SHOT"&&enemiesSpawned[mainScript[i][2]].active==true) {
                if (mainScript[i][3]=="0") {
                    //shotsound1.play();
                }
                if (mainScript[i][3]=="2") {
                    shotsound3.play();
                }
                let angleDiff=360/mainScript[i][6]
                for (var j=0;j<mainScript[i][6];j++) {
                    let newShot=new Shot
                    (enemiesSpawned[mainScript[i][2]].x,enemiesSpawned[mainScript[i][2]].y,
                        float(mainScript[i][3]),float(mainScript[i][4]),j*angleDiff+float(mainScript[i][5]));
                    eBulletsSpawned.push(newShot);
                }
            }
            // ------------------------------ text
            else if (mainScript[i][1]=="TEXT") {
                if (mainScript[i][2]=="text1") {
                    currentTextFile=text1;
                }
                if (mainScript[i][2]=="text2") {
                    currentTextFile=text2;
                }
                if (mainScript[i][2]=="text3") {
                    currentTextFile=text3;
                }
                textLine=0;
                textFrame=mainScript[i][0];
                textOn=true;
            }
            // ------------------------------ music
            else if (mainScript[i][1]=="BGM") {
                if (mainScript[i][2]=="SET") {
                    if (mainScript[i][3]=="0") {
                        currentMusic=fieldbg;
                    }
                    if (mainScript[i][3]=="1") {
                        currentMusic=bossbg;
                    }
                }
                if (mainScript[i][2]=="PLAY") {
                    musicPlaying=true;
                    currentMusic.loop();
                }
                if (mainScript[i][2]=="PAUSE") {
                    musicPlaying=false;
                    currentMusic.pause();
                }
            }
            //------------------------------ end
            else if (mainScript[i][1]=="GAMEEND") {
                currentMusic.pause();
                gameEndTime=int(millis()/1000);
                clearsound.play();
                gameScene=2;
            }
        }
    }
}

function readTextScript(textScript) {
    //console.log(textLine);
    if (textScript[textLine][0]=="TEXT") {
        if (textScript[textLine][1]=="ANENE") {
            if (textScript[textLine][2]=="0") {
                aneneSprite=aneneSheet.get(0,0,450,360);
            } else if (textScript[textLine][2]=="1") {
                aneneSprite=aneneSheet.get(450,0,450,360);
            } else if (textScript[textLine][2]=="2") {
                aneneSprite=aneneSheet.get(0,360,450,360);
            } else if (textScript[textLine][2]=="3") {
                aneneSprite=aneneSheet.get(450,360,450,360);
            } else if (textScript[textLine][2]=="4") {
                aneneSprite=aneneSheet.get(0,720,450,360);
            } else if (textScript[textLine][2]=="5") {
                aneneSprite=aneneSheet.get(450,720,450,360);
            }
            image(aneneSprite,-100,120);
        } else if (textScript[textLine][1]=="NIHO") {
            nihoSprite=nihoSheet.get(0,320*textScript[textLine][2],230,320);
            image(nihoSprite,160,160);
        }
        image(textbox,20,320,360,140);
        push();
        textSize(16);
        strokeWeight(3);
        stroke(0);
        fill(255);
        text(textScript[textLine][3],50,360,300,100);
        fill(0,200);
        rect(50,300,100,40);
        strokeWeight(1);
        stroke(255);
        fill(255);
        textSize(24);
        if (textScript[textLine][1]=="ANENE") {
            text("Anene", 60,330);
        } else if (textScript[textLine][1]=="NIHO") {
            text("Niho", 60,330);
        }
        pop();
        if (frameCount%80>50) {
            push();
            textSize(18);
            strokeWeight(3);
            stroke(0);
            fill(255);
            text("Z ➥",330,450);
            pop();
        }
    }
    // ------------------------------ other commands
    else if (textScript[textLine][0]=="ACTION") {
        if (textScript[textLine][1]=="TEXTEND") {
            gameStartFrame=frameCount-textFrame;
            textOn=false;
        }
    }
}

function gameOver() {
    gamePlayedTime=gameEndTime-gameStartTime;
    image(gameoverbg,0,0);
    tint(255,180);
    image(nihoSheet.get(0,960,230,320),460,265,155,215);
    push();
    textAlign(CENTER,CENTER);
    textSize(60);
    strokeWeight(5);
    stroke('red');
    fill(255);
    text("Game over...",320,120);
    textSize(30);
    strokeWeight(3);
    stroke(0);
    text("Total playtime: "+gamePlayedTime+" seconds.\nMissed: "
        +totalMissed+" times,\nBombed: " + totalBombed+" times,\nGrazed: "
         + totalGrazed+".\nScore: "+int(score)+".",320,260);
    textSize(20);
    strokeWeight(3);
    stroke(0);
    text("Better luck next time!\nRefresh the page to try again.",320,400);
    pop();
}

function gameCleared() {
    gamePlayedTime=gameEndTime-gameStartTime;
    image(gameclearedbg,0,0);
    tint(255,180);
    image(aneneSheet.get(450,720,450,360),-40,240,300,240);
    image(nihoSheet.get(0,640,230,320),460,265,155,215)
    push();
    textAlign(CENTER,CENTER);
    textSize(60);
    strokeWeight(5);
    stroke('blue');
    fill(255);
    text("Congratulations!",320,100);
    textSize(30);
    strokeWeight(3);
    stroke(0);
    text("Game Cleared!\nTotal playtime: "+gamePlayedTime+" seconds.\nMissed: "
        +totalMissed+" times,\nBombed: " + totalBombed+" times,\nGrazed: "
         + totalGrazed+".\nScore: "+int(score)+".",320,260);
    textSize(40);
    strokeWeight(4);
    stroke('blue');
    text("Thank you for playing!",320,400);
    pop();
}

function optionsScreen() {

}

function debugText() {
    push();
    textAlign(RIGHT,BOTTOM);
    textSize(12);
    fill(220);
    text("testing\nframerate: " +round(frameRate(),2)+"\ncurrentframe: "+frameCount,width,height);
    pop();
}
