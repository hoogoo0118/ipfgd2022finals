// let pX, pY, pSpeed, pHitBox=true, shotMode, shotAngle, pShots=[];
// let pBombs=[], bombR=0, bombCount=3, totalBombed=0, bombActive=false;
// let lifeCount=3, totalMissed=0;
// let score=0, grazeCount=0;

//const { __Graphics__ } = require("../../../.vscode/extensions/samplavigne.p5-vscode-1.2.8/p5types");

// let gameMode=0;
let bg0y=-3120, bg1y=0, bg2y=-800, bg0yScroll=0, bg1yScroll=0, scrollCheck=0;
let nihoSprite, aneneSprite;
let nihoSpeed=8;
let score=0, scoreMultiplier=1.0;
let lifeCount=5, bombCount=3, totalMissed=0, totalBombed=0, totalGrazed=0;
let missFrame;
let nihoHitboxOn=true, bombActive=false;
let text1, text2, gameScriptTest;
let gameScene=0, gameStartFrame, textFrame, currentTextFile;
  // gameScene: 0=title screen, 1=ingame, 2=game cleared, 3=game over
let gameStartTime, gameEndTime, gamePlayedTime;
let textOn=false, textLine=0;
let currentMusic, musicPlaying=false;
let enemiesSpawned=[], eBulletsSpawned=[], pBulletsSpawned=[], pBombsSpawned=[];

function preload() {
  let font0=loadFont('assets/MinSansVF.ttf');

  nihoSheet=loadImage('assets/images/nihosheet.png');
  nihofield0=loadImage('assets/images/nihofield0.png');
  nihofieldl=loadImage('assets/images/nihofieldl.png');
  nihofieldr=loadImage('assets/images/nihofieldr.png');
  aneneSheet=loadImage('assets/images/anenesheet.png');
  anenefield=loadImage('assets/images/anenefield.png');
  enemy0=loadImage('assets/images/enemy0.png');
  enemy1=loadImage('assets/images/enemy1.png');
  enemy2=loadImage('assets/images/enemy2.png');
  sidebar=loadImage('assets/images/sidebar2.png');
  soundlogo=loadImage('assets/images/soundlogo2.png');
  bg0=loadImage('assets/images/bg0.png');
  bg1=loadImage('assets/images/bg1.png');
  titleScreenTemp=loadImage('assets/images/menubg.png');
  gameclearedbg=loadImage('assets/images/gameclearedbg.png');
  gameoverbg=loadImage('assets/images/gameoverbg.png');
  newGameButton=loadImage('assets/images/newgamebutton.png');
  textbox=loadImage('assets/images/textbox.png');

  shotsound1=loadSound('assets/sound/shotsound1.wav');
  shotsound2=loadSound('assets/sound/shotsound2.wav');
  shotsound3=loadSound('assets/sound/shotsound3.wav');
  bombsound=loadSound('assets/sound/bombsound.wav');
  misssound=loadSound('assets/sound/misssound.wav');
  grazesound=loadSound('assets/sound/grazesound.wav');
  textsound=loadSound('assets/sound/textsound.wav');
  fieldbg=loadSound('assets/sound/fieldbg.wav');
  bossbg=loadSound('assets/sound/bossbg.wav');
  clearsound=loadSound('assets/sound/clearsound.wav');
  gameoversound=loadSound('assets/sound/gameoversound.wav');

  text1=loadStrings('assets/scripts/text1.txt');
  text2=loadStrings('assets/scripts/text2.txt');
  text3=loadStrings('assets/scripts/text3.txt');
  gameScriptTest=loadStrings('assets/scripts/gamescripttest.txt');

}

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  frameRate(60);
  imageMode(CORNER);
  rectMode(CORNER);
  angleMode(DEGREES);
  textFont("MinSansVF");

  currentMusic=fieldbg; // default music

  nihoSprite=nihoSheet.get(0,0,230,320);
  aneneSprite=aneneSheet.get(0,0,450,360); // loads default sprites

  niho=new Player();

  for (i=0;i<text1.length;i++) {
    text1[i]=split(text1[i],'&&');
  }
  for (i=0;i<text2.length;i++) {
    text2[i]=split(text2[i],'&&');
  }
  for (i=0;i<text3.length;i++) {
    text3[i]=split(text3[i],'&&');
  }
  for (i=0;i<gameScriptTest.length;i++) {
    gameScriptTest[i]=split(gameScriptTest[i],'&&');
  }
  //gameScene=2;
}

function draw() {
  //console.log("gamescene: "+gameScene)
  if (gameScene==0) {
    titleScreen();
  } else if (gameScene==1) {
    inGame();
    //------------------------------Sidebar----------------------------------
    // should be above everything in the main game screen
    image(sidebar,400,0,240,480); 
    push();
    tint(255,128);
    image(soundlogo,480,20,140,200);
    pop();
    push();
    fill(255,220);
    stroke('blue');
    textSize(16);
    text("Score: "+int(score)+"\nBombs: "+bombCount+"\nLife: "+lifeCount+"\nGraze: "+totalGrazed,420,300);
    pop();
  } else if (gameScene==2) {
    gameCleared();
  } else if (gameScene==3) {
    gameOver();
  }
  //debugText();
}

function keyPressed() {
  if (textOn==true&&keyCode==90) {
    textsound.play();
    textLine++
  }
}