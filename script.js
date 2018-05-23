$(document).ready(function(){
  document.querySelector('.welcome').style.display = "block";
});

let origBoard,
    huPlayer = '',
    aiPlayer = '',
    level = "",
    yourScore = 0,
    aiScore = 0;
const   winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2],
      ],
      cells = document.querySelectorAll('.cell'),
      XBtn = document.getElementById('X'),
      OBtn = document.getElementById('O'),
      easyBtn = document.getElementById('easy'),
      mediumBtn = document.getElementById('medium'),
      hardBtn = document.getElementById('hard'),
      startBtn = document.getElementById('startBtn'),
      settingsBtn = document.getElementById('settings'),
      levelName = document.getElementById('levelName');
      

XBtn.addEventListener('click', function(){
  huPlayer = 'X';
  aiPlayer = 'O';
  document.querySelector('.turnMessage').style.display = 'block';
});

OBtn.addEventListener('click', function(){
  huPlayer = 'O';
  aiPlayer = 'X';
  document.querySelector('.turnMessage').style.display = 'block';
});

easyBtn.addEventListener('click', function(){
  level = "easy";
  levelName.innerText = " "+ "Easy";
});

mediumBtn.addEventListener('click', function(){
  level = "medium";
  levelName.innerText = " " + "Medium";
});

hardBtn.addEventListener('click', function(){
  level = "hard";
  levelName.innerText = " " + "Hard";
});

startBtn.addEventListener('click', function(){
  document.querySelector('.welcome').style.display = "none";
  startGame();
});

settingsBtn.addEventListener('click', function(){
  document.querySelector('.endGame').style.display = 'none';
  document.querySelector('.welcome').style.display = "block";
  document.getElementById('aiScore').innerText= 0;
  document.getElementById('yourScore').innerText= 0;
});


function startGame(){
  document.querySelector('.endGame').style.display = 'none';
  document.querySelector('.turnMessage').style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++){
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
};

function turnClick(square){

  if(typeof origBoard[square.target.id] == 'number'){
   
  
    turn(square.target.id, huPlayer);
    if(!checkWin(origBoard, huPlayer) && !checkTie()) 
    
    if(level === "easy"){
      turn(easy(), aiPlayer);
    } else if (level === "medium"){
      turn(medium(), aiPlayer);
    } else{
      turn(hard(), aiPlayer);
    }

  }
};

function turn(squareId, player){
 origBoard[squareId] = player;
 document.getElementById(squareId).innerText = player;
  
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);

};

function checkWin (board, player){
  let plays = board.reduce ((a, e, i) => 
  (e === player) ? a.concat(i) : a, []);

  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem)> -1)){
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
};

function gameOver(gameWon){
 
  for (let index of winCombos[gameWon.index]){               
    document.getElementById(index).style.backgroundColor =    
    gameWon.player == huPlayer ? "#0c6ea3" : "#849974";             
  }
  
  for (let i = 0; i < cells.length; i++){                    
    cells[i].removeEventListener('click', turnClick, false); 
  }
  declareWinner(gameWon.player === huPlayer ? 'You win!' : 'You lose.');
};

function declareWinner(who){
  document.querySelector('.endGame').style.display = 'block';
  document.querySelector('.endGameText').innerText = who;
  
  if(who === "You win!"){
    yourScore +=1;
    document.getElementById('yourScore').innerText = yourScore;
  }else if(who === "You lose."){
    aiScore +=1;
    document.getElementById('aiScore').innerText = aiScore;
  }
};

function emptySquares(){
  return origBoard.filter( s => typeof s == 'number'); 
};

function easy(){
  return emptySquares()[0];  // get the first empty square
};

function medium(){
  return minimaxMed(origBoard, aiPlayer).index;
};

function hard(){
  return minimaxHard(origBoard, aiPlayer).index;
};

function checkTie(){
  if (emptySquares().length == 0){
    for (let i = 0; i < cells.length; i++){
      cells[i].style.backgroundColor = '#E3BAB3';
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner('Tie Game!');
    return true;  
  }
  return false; 
};

function minimaxMed(newBoard, player){
  let availSpots = emptySquares();   

  if(checkWin(newBoard, player)){          
    return {score:-10};                      
  }else if (checkWin(newBoard, aiPlayer)){   
    return {score:10};                       
  }else if (availSpots.length === 0){       
    return {score: 0};
  }

  let moves = [];
  for (let i = 0; i <availSpots.length; i++){
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if(player == aiPlayer){
      let result = minimaxMed(newBoard, huPlayer);
      move.score = result.score;
    } else {
      let result = minimaxMed(newBoard, aiPlayer);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

    let bestMove;
    if(player === aiPlayer){
      let bestScore = -10000;
      for ( let i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
}


function minimaxHard(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimaxHard(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimaxHard(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}