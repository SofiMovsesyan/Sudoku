let container = document.getElementById("container")
let game = document.getElementById("game")
let table, tr, td, numBtn
let matrix = Array.from({ length: 9 }, () => {
    return Array(9).fill(0)
})
console.log(matrix);


gameStart()

function gameStart() {
    // btn.innerHTML = "REFRESH"
    // win = false
    // min = 0
    // s = 0
    // ms = 0
    // timer()

    createSudokuTable()
    numberSelect()
}

function createSudokuTable() {
    fillSudoku(0, 0)
    let rowBorder = 0
    let colBorder = 0
    table = game.getElementsByTagName("table")
    if (table.length > 0) {
        table[0].remove()
    }
    table = document.createElement("table")
    game.appendChild(table)
    for (let i = 0; i < 9; i++) {
        tr = document.createElement("tr")
        rowBorder++
        if (rowBorder === 3) {
            tr.style.borderBottom = "3px solid rgb(1, 1, 65)"
            rowBorder = 0
        } else if (i === 0) {
            tr.style.borderTop = "3px solid rgb(1, 1, 65)"
        }
        for (let j = 0; j < 9; j++) {
            td = document.createElement("td")
            colBorder++
            if (colBorder === 3) {
                td.style.borderRight = "3px solid rgb(1, 1, 65)"
                colBorder = 0
            } else if (j === 0) {
                td.style.borderLeft = "3px solid rgb(1, 1, 65)"
            }
            td.innerHTML = matrix[i][j]
            //         index++
            td.style.textAlign = "center"
            tr.appendChild(td)
        }
        table.appendChild(tr)
        numBtn = document.createElement("button")
        numBtn.classList.add("numBtn");

        numBtn.innerHTML = i + 1
        game.append(numBtn)
    }

}

function isValid(num, row, col) {
    if (matrix[row].includes(num)) {
        return false
    }

    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][col] === num) {
            return false
        }
    }

    let blockRowStart = row - (row % 3)
    let blockColStart = col - (col % 3)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (matrix[blockRowStart + i][blockColStart + j] === num) {
                return false
            }
        }

    }
    return true
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr
}

function fillSudoku(row, col) {
    if (row == 9) {
        removeNums(30)
        return true
    }

    let nextRow = row
    let nextCol = col + 1
    if (nextCol === 9) {
        nextRow = row + 1
        nextCol = 0
    }

    let nums = []
    for (let i = 1; i <= 9; i++) {
        nums.push(i)
    }
    nums = shuffle(nums)

    for (let i = 0; i < nums.length; i++) {
        if (isValid(nums[i], row, col)) {
            matrix[row][col] = nums[i]
            if (fillSudoku(nextRow, nextCol)) {
                return true
            }
            matrix[row][col] = 0
        }
    }
    return false

}

function removeNums(n) {
    for (let i = 0; i < n; i++) {
        let rowRandNum = Math.floor(Math.random() * 9)
        let colRandNum = Math.floor(Math.random() * 9)
        matrix[rowRandNum][colRandNum] = null
    }
}



let selected = null
function numberSelect() {
    let tds = document.querySelectorAll("td")
    let numBtn = document.querySelectorAll(".numBtn")
    // let count = 1

    tds.forEach(td => {
        td.addEventListener("click", () => {
            if (selected) {
                selected.style.backgroundColor = "rgb(163, 200, 251)"
                selected.style.transform = "scale(1)"
            }

            if (td.innerHTML == "") {
                selected = td
                selected.style.backgroundColor = "rgb(61, 134, 238)"
            }
        })
    });

    numBtn.forEach(btn => {
        btn.style.marginLeft = "5px"
        btn.addEventListener("click", () => {
            if (selected) {
                let row = selected.parentElement.rowIndex
                let col = selected.cellIndex
                let num = parseInt(btn.innerHTML)
                if (isValid(num, row, col)) {
                    selected.style.backgroundColor = "green"
                    selected.innerHTML = num
                    matrix[row][col] = num

                    setTimeout(() => {
                        selected.style.backgroundColor = "rgb(163, 200, 251)"
                        selected = null
                    }, 1000);
                }else{
                     selected.style.backgroundColor = "red"
                    selected.innerHTML = num

                    setTimeout(() => {
                        selected.style.backgroundColor = "rgb(163, 200, 251)"
                        selected.innerHTML = ""
                        selected = null
                    }, 1000); 
                }
            }


        })
    })
}
