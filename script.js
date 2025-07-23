const cells = document.querySelectorAll('.cell');
const board = Array(9).fill(null);
const playerScore = document.getElementById('playerScore');
const computerScore = document.getElementById('computerScore');
const tieScore = document.getElementById('tieScore');
let scores = { player: 0, computer: 0, tie: 0 };
let gameOver = false;

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.dataset.index;
    if (!board[index] && !gameOver) {
      makeMove(index, 'X');
      if (!checkWinner('X') && !isBoardFull()) {
        const bestMove = getBestMove(board);
        makeMove(bestMove, 'O');
      }
    }
  });
});

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add('taken');
  if (checkWinner(player)) {
    gameOver = true;
    updateScore(player);
    setTimeout(resetBoard, 1000);
  } else if (isBoardFull()) {
    scores.tie++;
    tieScore.textContent = scores.tie;
    gameOver = true;
    setTimeout(resetBoard, 1000);
  }
}

function getBestMove(newBoard) {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!newBoard[i]) {
      newBoard[i] = 'O';
      let score = minimax(newBoard, 0, false);
      newBoard[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWinner('O')) return 10 - depth;
  if (checkWinner('X')) return depth - 10;
  if (isBoardFull(boardState)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = 'O';
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = 'X';
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = null;
      }
    }
    return best;
  }
}

function isBoardFull(state = board) {
  return state.every(cell => cell !== null);
}

function checkWinner(player) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winCombos.some(combo => combo.every(i => board[i] === player));
}

function updateScore(winner) {
  if (winner === 'X') {
    scores.player++;
    playerScore.textContent = scores.player;
  } else {
    scores.computer++;
    computerScore.textContent = scores.computer;
  }
}

function resetBoard() {
  board.fill(null);
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  gameOver = false;
}
