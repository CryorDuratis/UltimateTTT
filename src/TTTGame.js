import React from 'react';
import ReactDOM from 'react-dom/client';
import './TTTGame.css';
import reportWebVitals from './reportWebVitals';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Section(props) {
  function renderSquare(i, j) { // when this method is called, the square tagged is assigned these variables. squares and onClick props need to be passed to the Section component
    return (
      <Square
        value={props.squares[j][i]}
        onClick={() => props.onClick(i,j)} // this means that the function passed in as props will accept the i and j here as arguments.
      />
    );
  }
     // The Section component is formed from 9 squares, using a for loop. class and sect props need to be passed to the Section component
    return (
        <div className={props.class}>
            {Array.from({ length: 9 }, (_, i) => renderSquare(i, props.sect))}
        </div>
    )
}

class Board extends React.Component {

  renderSection(j) {
    return (
      <Section
      class={`section ${(this.props.clickable === j || this.props.step === 0 || this.props.squares[this.props.clickable][9] !== null) && this.props.stop === null ? 'clickable':''} ${this.props.squares[j][9] !== null ? 'check' + this.props.squares[j][9]:''}`}
      sect={j}
      squares={this.props.squares}
      onClick={(i,j) => this.props.onClick(i,j)} // this means that the function passed in as props will accept some other i and j as arguments
      />
    )
  }

  render() {
    return (
      <div className='board'>
        {Array.from({ length: 9 }, (_, i) => this.renderSection(i))}
      </div>
    )
  }
}

class Game extends React.Component {

  static LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  constructor(props) { // creates the state structure
    super(props);
    const numSquares = 10;
    const numSections = 9;

    const boardstate = Array.from({ length: numSections }, () =>
    Array.from({ length: numSquares }).fill(null));

    this.state = {
      history: [
        {
          squares: boardstate,
          sections: 0
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // history only gets rewritten when new move occurs, depending on which move we are currently at
    const current = history[history.length - 1];
    const squares = current.squares.map(a => [...a]);
    
    // checks if its an invalid click
    if (realWinner(squares) || squares[j][i] || (j!==current.sections && this.state.stepNumber>0 && squares[current.sections][9]===null)) {
      return;
    }
    
    // fills in the player symbol where click occurred
    squares[j][i] = this.state.xIsNext ? "X" : "O";

    // checks if a win occurs in that section
    if (miniWinner(squares,j) && squares[j][9] === null) {
      squares[j][9] = this.state.xIsNext ? "X" : "O";
    }

    // updates state
    this.setState({
      history: history.concat([
        {
          squares: squares,
          sections: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) { // determines which move we are currently at
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    
    const winner = realWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i,j) => this.handleClick(i,j)} // this means that this handleclick function passed in as props will accept some other i and j as arguments
            clickable={current.sections}
            step={this.state.stepNumber}
            stop={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function miniWinner(squares,j) {
  
  if (j === undefined) {
    alert('j is undefined');
    return null;
  }
  
  for (let i = 0; i < Game.LINES.length; i++) {
    const [a, b, c] = Game.LINES[i];
    if (squares[j][a] && squares[j][a] === squares[j][b] && squares[j][a] === squares[j][c]) {
      return squares[j][a];
    }
  }
  return null;
}

function realWinner(squares) {
  
  for (let i = 0; i < Game.LINES.length; i++) {
    const [a, b, c] = Game.LINES[i];
    if (squares[a][9] && squares[a][9] === squares[b][9] && squares[a][9] === squares[c][9]) {
      return squares[a][9];
    }
  }
  return null;
}

export default Game;