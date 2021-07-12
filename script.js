"use strict";

const Player = (symbol) => {
    let _symbol = symbol;
    const getSymbol = () => _symbol;
    return {
        getSymbol,
    }
};

const gameBoard = (() => {
    // 0,1,2
    // 3,4,5
    // 6,7,8
    const _defaultBoard = new Array(9).fill(null);

    let _board;
    let _playerTurn; // 0 or 1 (for player 1 / player 2)

    const getPlayer = () => {
        return _playerTurn;
    };

    const reset = (player1Start = true) => {
        _board = [ ..._defaultBoard ];
        _playerTurn = player1Start ? 0 : 1;
    };

    const checkWin = () => {
        // Check each possible win
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let [a, b, c] of lines) {
            if (_board[a] !== null && _board[a] === _board[b] && _board[a] === _board[c]) {
                return { result: true, line: [a, b, c] };
            }
        }
        return { result: false };
    };

    const checkBoardFull = () => {
        return _board.reduce((accum, val) => (accum && val !== null), true); // check every position not empty
    };

    const checkWinStatus = () => {
        const win = checkWin();
        const winStatus = { winLine: win.line ?? [] };
        
        if (win.result) winStatus.status = 1; // win
        else if (checkBoardFull()) winStatus.status = 0; // tie
        if (winStatus.status === undefined) winStatus.status = -1; // continue

        return winStatus;
    };

    const play = (position) => {
        const result = { 
            valid: false,
            player: _playerTurn,
            nextPlayer: _playerTurn,
            status: -1,
        };

        // Check invalid move
        if (position > 8 || position < 0 || _board[position] !== null) return result;

        // update board
        _board[position] = _playerTurn; 

        // switch player
        _playerTurn = _playerTurn ? 0 : 1; 
        result.nextPlayer = _playerTurn;

        // check for a win/tie
        const winStatus = checkWinStatus();
        result.status = winStatus.status;
        result.winLine = winStatus.winLine;
        
        result.valid = true;
        return result;
    };

    reset();

    return {
        getPlayer,
        reset,
        play,
    };
})();

const displayController = (() => {
    const squares = document.querySelectorAll(".square");

    const updateMessage = (msg) => {
        document.querySelector("#message").innerHTML = msg;  
    };

    const changePlayer = (player) => {
        updateMessage(`${player} turn`);
    };

    const win = (player, winLine) => {
        updateMessage(`${player} wins!`);
        for (const index of winLine) squares[index].classList.add("winningSquare");
    };

    const draw = () => {
        updateMessage("It is a draw!");
    };

    const updateSquare = (player, index) => {
        squares[index].innerHTML = player;
    };

    const reset = (player) => {
        squares.forEach(e => {
            e.innerHTML = "";
            e.classList.remove("winningSquare");
        });
        changePlayer(player);
    };

    return {
        changePlayer,
        win,
        draw,
        updateSquare,
        reset,
    };
})();

// Game Controller
(() => {
    let _playing = true;
    const _players = [Player("X"), Player("O")]; // Player 1 and 2

    const clickSquare = (index) => {
        if (!_playing) return;
        const result = gameBoard.play(index);
        if (result.valid) {
            const player = _players[result.player].getSymbol();
            const nextPlayer = _players[result.nextPlayer].getSymbol();
            displayController.updateSquare(player, index);
            if (result.status === -1) {
                // game continues
                displayController.changePlayer(nextPlayer);
            } else {
                // win / tie
                if (result.status) {
                    displayController.win(player, result.winLine);
                } else displayController.draw();
                _playing = false;
            }
        }
    };

    const reset = (player1Start = true) => {
        gameBoard.reset(player1Start);
        const player = _players[gameBoard.getPlayer()].getSymbol();
        displayController.reset(player);
        _playing = true;
    };

    const addEventListeners = () => {
        document.querySelector("#reset").addEventListener("click", reset);
        document.querySelectorAll(".square").forEach((e, i) => {
            e.addEventListener("click", () => {clickSquare(i)});
        });
    };

    addEventListeners();
    reset();
})();