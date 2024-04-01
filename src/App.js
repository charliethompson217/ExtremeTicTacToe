import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameLevel, setGameLevel] = useState(null);
  const [board, setBoard] = useState([]);

  const startGame = (level) => {
    setGameLevel(level);
    initializeGameBoard(level);
  };
  const resetGame = () => {
    setCurrentPlayer('X');
    setGameLevel(null);
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

  const handleClick = (cellIndex, subIndex = null, ssubIndex = null) => {

    /* 
      **ToDo**
      ensure player clicked in an allowed cell 
    */

    let playerWon = false;

    setBoard(prevBoard => {
      // Create a deep copy of the board to avoid mutating the state directly
      let newBoard = JSON.parse(JSON.stringify(prevBoard));

      if (gameLevel === 'Easy' && newBoard[cellIndex] === null) {
        newBoard[cellIndex] = currentPlayer;
      }

      if (gameLevel === 'Medium' && subIndex !== null) {
        if (newBoard[cellIndex].subBoard[subIndex] === null) {
          newBoard[cellIndex].subBoard[subIndex] = currentPlayer;
        }
      }

      if (gameLevel === 'Hard' && subIndex !== null && ssubIndex !== null) {
        if (newBoard[cellIndex].subBoard[subIndex].ssubBoard[ssubIndex] === null) {
          newBoard[cellIndex].subBoard[subIndex].ssubBoard[ssubIndex] = currentPlayer;
        }
      }
      /*
        **ToDo**
        rest of the logic for handeling wins
      */
      return newBoard;
    });

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

    // final win
    if (playerWon) {
      alert(`player ${currentPlayer} won`)
      resetGame();
    }
  };

  const renderSSubCell = (ssubCell, ssubIndex, cellIndex, subIndex) => {
    return (
      <div key={ssubIndex} className="ssub-cell" onClick={() => handleClick(cellIndex, subIndex, ssubIndex)}>
        {ssubCell}
      </div>
    );
  };

  const renderSubCell = (subCell, subIndex, cellIndex, level) => {
    if (level === 'Hard') {
      return (
        <div key={subIndex} className="ssub-board">
          {subCell.ssubBoard.map((ssubCell, ssubIndex) => renderSSubCell(ssubCell, ssubIndex, cellIndex, subIndex))}
        </div>
      );
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
      return (
        <div key={cellIndex} className="sub-board">
          {cell.subBoard.map((subCell, subIndex) => renderSubCell(subCell, subIndex, cellIndex, level))}
        </div>
      );
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
    </div>
  );
}

export default App;
