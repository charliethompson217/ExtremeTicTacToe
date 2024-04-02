import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameLevel, setGameLevel] = useState(null);
  const [board, setBoard] = useState([]);
  var playerWon = false;

  const startGame = (level) => {
    setGameLevel(level);
    initializeGameBoard(level);
  };
  const resetGame = () => {
    setCurrentPlayer('X');
    setGameLevel(null);
    setBoard([]);
    playerWon = false;
  };

  const initializeGameBoard = (level) => {
    // Initialize a basic board for "Easy" difficulty
    let newBoard = Array(9).fill(null);

    if (level === 'Medium' || level === 'Hard') {
      // For "Medium" and "Hard", add a nested structure
      newBoard = newBoard.map(() => ({
        value: null,
        subBoard: Array(9).fill(null)
      }));

      if (level === 'Hard') {
        // For "Hard", add another layer of nesting
        newBoard = newBoard.map(cell => ({
          ...cell,
          subBoard: cell.subBoard.map(() => ({
            value: null,
            ssubBoard: Array(9).fill(null)
          }))
        }));
      }
    }

    setBoard(newBoard);
  };

  function updateBoard(prevBoard, cellIndex, subIndex = null, ssubIndex = null) {
    // Create a deep copy of the board to avoid mutating the state directly
    let newBoard = JSON.parse(JSON.stringify(prevBoard));

    if (gameLevel === 'Easy' && newBoard[cellIndex] === null) {
      newBoard[cellIndex] = currentPlayer;
      if (checkWinner(newBoard, currentPlayer)) {
        playerWon = true;
      }
    }

    if (gameLevel === 'Medium' && subIndex !== null) {
      if (newBoard[cellIndex].subBoard[subIndex] === null) {
        newBoard[cellIndex].subBoard[subIndex] = currentPlayer;
        if (checkWinner(newBoard[cellIndex].subBoard, currentPlayer)) {
          newBoard[cellIndex].value = currentPlayer;
        }
        if (checkWinner(newBoard, currentPlayer)) {
          playerWon = true;
        }
      }
    }

    if (gameLevel === 'Hard' && subIndex !== null && ssubIndex !== null) {
      if (newBoard[cellIndex].subBoard[subIndex].ssubBoard[ssubIndex] === null) {
        newBoard[cellIndex].subBoard[subIndex].ssubBoard[ssubIndex] = currentPlayer;
        if (checkWinner(newBoard[cellIndex].subBoard[subIndex].ssubBoard, currentPlayer)) {
          newBoard[cellIndex].subBoard[subIndex].value = currentPlayer;
        }
        if (checkWinner(newBoard[cellIndex].subBoard, currentPlayer)) {
          newBoard[cellIndex].value = currentPlayer;
        }
        if (checkWinner(newBoard, currentPlayer)) {
          playerWon = true;
        }
      }
    }
    return newBoard;
  }

  const handleClick = (cellIndex, subIndex = null, ssubIndex = null) => {

    /* 
      **ToDo**
      ensure player clicked in an allowed cell 
    */

    let newBoard = updateBoard(board, cellIndex, subIndex, ssubIndex);

    setBoard(prevBoard => newBoard);

    if (playerWon) {
      alert(`player ${currentPlayer} won`)
      resetGame();
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  function checkWinner(board, lastPlayer) {
    const winningCombinations = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal from top-left to bottom-right
      [2, 4, 6]  // Diagonal from top-right to bottom-left
    ];

    const getValue = (cell) => {
      return typeof cell === 'object' && cell !== null ? cell.value : cell;
    };

    for (let combo of winningCombinations) {
      if (combo.every(index => getValue(board[index]) === lastPlayer)) {
        return true;
      }
    }
    return false;
  }


  const renderSSubCell = (ssubCell, ssubIndex, cellIndex, subIndex) => {
    return (
      <div key={ssubIndex} className="ssub-cell" onClick={() => handleClick(cellIndex, subIndex, ssubIndex)}>
        {ssubCell}
      </div>
    );
  };

  const renderSubCell = (subCell, subIndex, cellIndex, level) => {
    if (level === 'Hard') {
      if (subCell.value) {
        return (
          <div key={subIndex} className="sub-cell" onClick={() => handleClick(cellIndex, subIndex)}>
            {subCell.value}
          </div>
        );
      }
      else {
        return (
          <div key={subIndex} className="ssub-board">
            {subCell.ssubBoard.map((ssubCell, ssubIndex) => renderSSubCell(ssubCell, ssubIndex, cellIndex, subIndex))}
          </div>
        );
      }
    } else {
      return (
        <div key={subIndex} className="sub-cell" onClick={() => handleClick(cellIndex, subIndex)}>
          {subCell}
        </div>
      );
    }
  };

  const renderCell = (cell, cellIndex, level) => {
    if (level === 'Easy') {
      return (
        <div key={cellIndex} className="cell" onClick={() => handleClick(cellIndex)}>
          {cell}
        </div>
      );
    } else {
      if (cell.value) {
        return (
          <div key={cellIndex} className="cell" onClick={() => handleClick(cellIndex)}>
            {cell.value}
          </div>
        );
      }
      else {
        return (
          <div key={cellIndex} className="sub-board">
            {cell.subBoard.map((subCell, subIndex) => renderSubCell(subCell, subIndex, cellIndex, level))}
          </div>
        );
      }
    }
  };

  const renderGameBoard = () => {
    return board.map((cell, cellIndex) => renderCell(cell, cellIndex, gameLevel));
  };

  return (
    <div className="App">
      {!gameLevel && (
        <>
          <button onClick={() => startGame('Easy')}>Easy</button>
          <button onClick={() => startGame('Medium')}>Medium</button>
          <button onClick={() => startGame('Hard')}>Hard</button>
        </>
      )}
      <div id="game-board" className={gameLevel ? `level-${gameLevel.toLowerCase()}` : ''}>
        {renderGameBoard()}
        
      </div>
      {gameLevel && (
        <div>
          Player {currentPlayer}'s turn
        </div>
      )}
    </div>
  );
}

export default App;
