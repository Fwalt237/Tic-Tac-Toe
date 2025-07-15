//**********GameBoard Module************

const GameBoard = (function(){
    let board = ["","","","","","","","",""];
    
    const getBoard = () => board.slice();
    
    const setMark = (index,mark)=> {
        if(board[index]===""){
            board[index] = mark;
            return true;
        }
        return false;
    };

    const reset = () => {for (let i = 0; i < board.length; i++) {
                            board[i] = "";
                        }
    };

    return {getBoard, setMark, reset};
})();

//**********Player Factory************

const Player = (name,mark) => {return{name,mark};};

//**********Game Controller Module************

const GameController = (function(){
    let players=[];
    let CurrentPlayerIndex=0;
    let gameOver = false;

    const start = (name1, name2) => {
        players=[Player(name1,"X"), Player(name2,"O")];
        CurrentPlayerIndex = 0;
        gameOver = false;
        GameBoard.reset();
    };

    const playRound = (index) => {
        if(gameOver) return;
        if(GameBoard.setMark(index,getCurrentPlayer().mark)){
            if(checkWin()){
                gameOver = true;
                return `${getCurrentPlayer().name} wins!`;
            }
            if(checkTie()){
                gameOver = true;
                return "It's a tie!";
            }
            CurrentPlayerIndex = 1-CurrentPlayerIndex;
        }
        return null;
    };

    const getCurrentPlayer = () => players[CurrentPlayerIndex];

    const checkWin = () => {
        const winPatterns = [[0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8], [0,4,8],[2,4,6]];
        const board = GameBoard.getBoard();
        return winPatterns.some(pattern=>pattern.every(i=>board[i]===getCurrentPlayer().mark));
    };

    const checkTie = () => GameBoard.getBoard().every(cell => cell !=="");

    return {start, playRound, getCurrentPlayer};
})();

//**********DOM and Display Logic************

const DisplayController = (function() {
    const boardElement = document.querySelector(".board");
    const messageElement = document.querySelector(".message");
    const startButton = document.querySelector("#start");
    const nameInputs = [document.querySelector("#player1"), document.querySelector("#player2")];

    const render = () => {
        const board = GameBoard.getBoard();
        boardElement.innerHTML = "";
        board.forEach((mark, idx) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = mark;
            cell.addEventListener("click", () => handleCellClick(idx));
            boardElement.appendChild(cell);
        });
    };

    const handleCellClick = (idx) => {
        const result = GameController.playRound(idx);
        render();
        if (result) {
            messageElement.textContent = result;
        } else {
            messageElement.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
        }
    };

    const startGame = () => {
        GameController.start(nameInputs[0].value, nameInputs[1].value);
        render();
        messageElement.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
    };

    startButton.addEventListener("click", startGame);

    return { render };
})();
