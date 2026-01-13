const WINS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];



function getTerminalState(board, ai, player, depth) {
    for (let w of WINS) {
        let [a,b,c] = w;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === ai
                ? 1000 - depth
                : depth - 1000;
        }
    }
    if (!board.includes("")) return 0; // draw
    return null;
}

function checkWinner(board) {
    for (let w of WINS) {
        let [a,b,c] = w;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}



function boardToFeatures(board, ai, player) {
    let aiCount = 0, playerCount = 0;
    let aiTwo = 0, playerTwo = 0;

    for (let cell of board) {
        if (cell === ai) aiCount++;
        if (cell === player) playerCount++;
    }

    for (let w of WINS) {
        let line = w.map(i => board[i]);
        if (line.filter(c => c === ai).length === 2 && line.includes("")) aiTwo++;
        if (line.filter(c => c === player).length === 2 && line.includes("")) playerTwo++;
    }

    let center = board[4] === ai ? 1 : board[4] === player ? -1 : 0;

    return [aiCount, playerCount, aiTwo, playerTwo, center];
}



function classicalScore(board, ai, player, difficulty) {
    let score = 0;

    // ضعيف في Easy – قوي في Normal
    let winScore    = (difficulty === "easy") ? 30 : 100;
    let twoScore    = (difficulty === "easy") ? 3  : 10;
    let centerScore = (difficulty === "easy") ? 1  : 3;

    for (let w of WINS) {
        let line = w.map(i => board[i]);

        if (line.filter(c => c === ai).length === 3) score += winScore;
        if (line.filter(c => c === ai).length === 2 && line.includes("")) score += twoScore;

        if (line.filter(c => c === player).length === 3) score -= winScore;
        if (line.filter(c => c === player).length === 2 && line.includes("")) score -= twoScore;
    }

    if (board[4] === ai) score += centerScore;
    if (board[4] === player) score -= centerScore;

    return score;
}

function evaluateBoard(board, ai, player, evalType, difficulty) {
    if (evalType === "ml") {
        return mlEvaluate(boardToFeatures(board, ai, player));
    }
    return classicalScore(board, ai, player, difficulty);
}



function minimax(board, ai, player, depth, maxDepth, maximizing, evalType, difficulty, alpha, beta) {

    let terminal = getTerminalState(board, ai, player, depth);
    if (terminal !== null) return terminal;

    if (depth === maxDepth) {

        if (maxDepth === 9) return 0;
        return evaluateBoard(board, ai, player, evalType, difficulty);
    }

    if (maximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = ai;
                best = Math.max(
                    best,
                    minimax(board, ai, player, depth + 1, maxDepth, false, evalType, difficulty, alpha, beta)
                );
                board[i] = "";
                alpha = Math.max(alpha, best);
                if (beta <= alpha) break;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = player;
                best = Math.min(
                    best,
                    minimax(board, ai, player, depth + 1, maxDepth, true, evalType, difficulty, alpha, beta)
                );
                board[i] = "";
                beta = Math.min(beta, best);
                if (beta <= alpha) break;
            }
        }
        return best;
    }
}



function getBestMove(board, ai, player, difficulty, evalType) {

    const depthMap = {
        easy: 0,
        normal: 3,
        hard: 9
    };

    let maxDepth = depthMap[difficulty];


    if (difficulty === "hard") evalType = "none";

    let scores = {};

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = ai;
            scores[i] = minimax(
                board,
                ai,
                player,
                0,
                maxDepth,
                false,
                evalType,
                difficulty,
                -Infinity,
                Infinity
            );
            board[i] = "";
        }
    }

    let bestMove = Object.keys(scores)
        .reduce((a, b) => scores[a] > scores[b] ? a : b);

    return {
        index: parseInt(bestMove),
        scores
    };
}
