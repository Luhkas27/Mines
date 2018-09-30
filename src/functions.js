// Função que cria nosso Tabuleiro

const createBoard = (rows, columns) => {
    return Array(rows).fill(0).map((_, row) => {
        return Array(columns).fill(0).map((_,column) => {
            return {
                row,
                column,
                opened: false,
                flagged: false,
                mined: false,
                exploded: false,
                nearMines: 0
            }
        })
    })
}

// Função que espalha as Minas 

const spreadMines = (board, minesAmount) => {
    const rows = board.length
    const columns = board[0].length
    let minesPlanted = 0

    while (minesPlanted < minesAmount) {
        const rowSel = parseInt(Math.random() * rows, 10)
        const columnSel = parseInt(Math.random() * columns, 10)
    
        if (!board[rowSel][columnSel].mined) {
            board[rowSel][columnSel].mined = true
            minesPlanted++
        }
    }
}

// Cria o Tabuleiro já com as Minas plantadas
const createMinedBoard = (rows, columns, minesAmount) => {
    const board = createBoard(rows, columns)
    spreadMines(board, minesAmount)
    return board
}

// Função responsavel por clonar todo o estado do Tabuleiro
const cloneBoard = board => {
    return board.map(rows => {
        return rows.map(field => {
            return { ...field }
        })
    })
}

//Função para pegar os campos vizinhos no Tabuleiro
const getNeighbors = (board, row, column) => {
    const neighbors = []
    const rows = [row - 1, row, row + 1]
    const columns = [column - 1, column, column + 1]
    rows.forEach(r => {
        columns.forEach(c => {
            const different = r !== row || c !== column // Valida se coluna e linha são diferentes
            const validRow = r >= 0 && r < board.length // Verifica e Valida uma Linha Valida
            const validColumn = c >= 0 && c < board[0].length // Verifica e Valida uma Coluna Valida
            if (different & validRow && validColumn) {
                neighbors.push(board[r][c])
            }
        })
    })
    return neighbors;
}

// Função criada para verificar se a vizinhança é segura do Tabuleiro
const safeNeighborhood = (board, row, column) => {
    const safes = (result, neighbor) => result && !neighbor.mined // Função usada com a lógica do Reduce para saber se o vizinho está ou não minado
    return getNeighbors(board, row, column).reduce(safes, true)
}

// Funcção responsável por abrir um campo no Tabuleiro quando clicarmos no Campo
const openField = (board, row, column) => {
    const field = board[row][column]
    if (!field.opened) { 
        field.opened = true
        if (field.mined) {
            field.exploded = true
        } else if (safeNeighborhood(board, row, column)) {
            getNeighbors(board, row, column)
                .forEach(n => openField(board, n.row, n.column))
        } else {
            const neighbors = getNeighbors(board, row, column)
            field.nearMines = neighbors.filter(n => n.mined).length // Filtra os vizinhos e pega apenas os que estão minados e depois pega a quantidade de vizinhos com mina 
        }
    }
}

// Função para percorrer todos os campos do Tabuleiro
const fields = board => [].concat(...board)
const hadExplosion = board => fields(board)
    .filter(field => field.exploded).length > 0
const pendding = field => (field.mined && !field.flagged)
    || (!field.mined && !field.opened)
const wonGame = board => fields(board).filter(pendding).length === 0 // Função para verificar e ver se há ou não pendência para ver o ganhador do jogo
const showMines = board => fields(board).filter(field => field.mined) // Função para quando o usuario perder o jogo, todas as minas serem exibidas no Tabuleiro
    .forEach(field => field.opened = true)

// Função para marcar um determinado campo com a bandeira 
const invertFlag = (board, row, column) => {
        const field = board[row][column]
        field.flagged = !field.flagged
}

// Função para calcular quantas Flags já foram usadas no jogo
const flagsUsed = board => fields(board)
    .filter(field => field.flagged).length

export {
    createMinedBoard,
    cloneBoard,
    openField,
    hadExplosion,
    wonGame,
    showMines, 
    invertFlag,
    flagsUsed,
}