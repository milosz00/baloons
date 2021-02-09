var gameArea = document.getElementById('gameArea');
var roundBox = document.getElementById('roundBox');
var pointsBox = document.getElementById('pointsBox');
var hitBox = document.getElementById('hitBox');
var shotsBox = document.getElementById('shootsFiredBox');
var accuracyBox = document.getElementById('accuracyBox');

var counter = 1;
var points = 0;
var hits = 0;
var shots = 0;
var name = "";

firstGame = true;

var shootHit = new Audio('sounds/shoot-bow.mp3');
var hitSound = new Audio('sounds/balloon-pop.mp3');

// load new game
function load(event){
    
    document.getElementById('end').style.visibility="hidden";
    document.getElementById('playAgainBtn').style.visibility="hidden";
    document.getElementById('playAgainBtn').removeEventListener("click",load);

    create();
    document.getElementById('circle').style.visibility="hidden";

    name = "";
    counter = 1;
    points = 0;
    hits = 0;
    shots = 0;

    while(name==""){
        name = prompt("Enter your name");
    }

    document.getElementById('nickBox').innerHTML = name;
    game();

    if(!firstGame)
        event.stopPropagation();
}


// main function of our game
function game(){
    
    prepareRound();

    if(counter>30){
        gameArea.removeEventListener("click",minusPoints);
        prepareNextGame();
        return;
    }

    create();  //create balloon
    var timeCreate = Date.now();
    const circle = document.getElementById("circle");
    roundBox.innerHTML=`${counter++}`;  //write what number of balloon we have

    circle.addEventListener("click",deleteBalloonClick); //add event which destroy balloon
    gameArea.addEventListener("click",minusPoints);
    

    gameArea.addEventListener("mouseover",changeCursor); //add event to change cursor to crosshair

    if(counter<=10)
        var stopTime = setTimeout(deleteBalloonTooLong,2000); //add event which destroy balloon after two seconds , if we don't destroy by yourself
    else if(counter>10 && counter<=20)
        var stopTime = setTimeout(deleteBalloonTooLong,1500);
    else
        var stopTime = setTimeout(deleteBalloonTooLong,1000); 
    
    
    function deleteBalloonClick(event){
        hitSound.play();
        clearTimeout(stopTime); // when we destroy balloon by yourself , we must stop function which destroy balloon after two seconds
        addPoints(timeCreate);hits+=1;shots+=1;
        gameArea.style.backgroundColor = "red";

        setTimeout(game,100);
        event.stopPropagation();
    }
    
}

function prepareRound(){
    gameArea.style.backgroundColor="white";
    document.getElementById('circle').remove();

    pointsBox.innerHTML=`${points}`; //write what number of points we get
    hitBox.innerHTML=`${hits}`; //write what number of destroyed balloons we have
    shotsBox.innerHTML=`${shots}`; //write how many we try destroy balloons
    if(shots==0)
        accuracyBox.innerHTML = `0.00`; //write percent of our accuracy
    else
        accuracyBox.innerHTML = `${(parseFloat((hits/shots))*100).toFixed(2)}`; //write percent of our accuracy
}


// function to destroy balloon when we don't destroy by yourself
function deleteBalloonTooLong(){
    points-=20;
    game();
}


//create div - balloon
function create(){
    var balloon = document.createElement('div');
    balloon.setAttribute('id','circle');
    balloon.style.top = `${getRandomInt(0,330)}px`;
    balloon.style.left = `${getRandomInt(0,800)}px`;

    var widthHeight = getRandomInt(50,100);
    balloon.style.width = `${widthHeight}px`;
    balloon.style.height=`${widthHeight}px`;

    gameArea.insertBefore(balloon,document.getElementById("highscores"));
    randomColor(getRandomInt(0,6));
}


// minus points when we won't hit the balloon
function minusPoints(){
    shootHit.play();
    points-=10;
    shots+=1;
    pointsBox.innerHTML=`${points}`;
    shotsBox.innerHTML = `${shots}`;
    accuracyBox.innerHTML = `${(parseFloat((hits/shots))*100).toFixed(2)}`;
}

function changeCursor(){
    gameArea.style.cursor="crosshair";
}


//function which add points depending on the reaction time 
function addPoints(createTime){
    var timeDestroy = Date.now();
    var diff = timeDestroy-createTime;
    if(diff<300)
        points+=50;
    else if(diff>=300 && diff<600)
        points+=40;
    else if(diff>=600 && diff<1000)
        points+=30;
    else if(diff>=1000 && diff<1500 && counter<=20)
        points+=20;
    else if(diff>=1500 && counter<=10)
        points+=10;
}

//function which return random Color of balloon background
function randomColor(number){
    switch(number){
        case 0:
            document.getElementById('circle').style.backgroundColor="black";
            break;
        case 1:
            document.getElementById('circle').style.backgroundColor="green";
            break;
        case 2:
            document.getElementById('circle').style.backgroundColor="yellow";
            break;
        case 3:
            document.getElementById('circle').style.backgroundColor="orange";
            break;
        case 4:
            document.getElementById('circle').style.backgroundColor="blue";
            break;
        case 5:
            document.getElementById('circle').style.backgroundColor="#a32f43";
            break;
        case 6:
            document.getElementById('circle').style.backgroundColor="#A9A9A9";
            break;
    }
}



//function which prepare next game , when we click playAgainButton
function prepareNextGame(){
    
    document.getElementById('end').innerHTML = `KONIEC GRY<br><br>Twój wynik to: ${points}pkt`;
    document.getElementById('end').style.visibility="visible";

    document.getElementById('playAgainBtn').style.visibility="visible";
    document.getElementById('playAgainBtn').addEventListener("click",load);
    firstGame = false;
}

//function which return random Int from min to max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}