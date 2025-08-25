let container = document.getElementById("container")
let game = document.getElementById("game")

let pTimer = document.getElementById("timer")
let pBest = document.getElementById("best")

let easy = document.getElementById("easy")
let middle = document.getElementById("middle")
let hard = document.getElementById("hard")
let impossible = document.getElementById("impossible")

let btn = document.getElementById("btn")
let wrongTxt = document.getElementById("wrong")
let txt = document.getElementById("txt")

let wrong

let diffNum = 0
let lvlSelected = null

let table, tr, td, numBtn, matrix, win

let min = 0
let s = 0
let ms = 0
let time

let bestScore = 0
let curScore;

btnClick()
btn.addEventListener("click", () => {
    if (!diffNum) {
        alert("You must select difficulty level first!")
        return
    }
    gameStart()


})

function gameStart() {
    if(time) {
        clearInterval(time)
    }
    btn.innerHTML = "REFRESH"
    win = false
    min = 0
    s = 0
    ms = 0
    wrong = 0
    wrongTxt.innerHTML = "Wrong: 0"
    timer()
    matrix = Array.from({ length: 9 }, () => {
        return Array(9).fill(0)
    })
    numBtnCreate()

    createSudokuTable()
    numberSelect()
}

function lvlSelection(lvl) {
    lvlSelect = true
    if (lvlSelected) {

        lvlSelected.style.backgroundColor = ""
    }
    lvl.style.backgroundColor = "rgb(31, 92, 176)"
    lvlSelected = lvl
}

function btnClick() {
    easy.addEventListener("click", () => {
        diffNum = 32
        lvlSelection(easy)

    })

    middle.addEventListener("click", () => {
        diffNum = 45
        lvlSelection(middle)
    })

    hard.addEventListener("click", () => {
        diffNum = 55
        lvlSelection(hard)
    })

    impossible.addEventListener("click", () => {
        diffNum = 65
        lvlSelection(impossible)
    })
}


function timeToMs(timeStr) {
    let [min, time] = timeStr.split(":")

    let [sec, ms] = time.split(".")
    console.log(min, sec);
    let toMs = parseInt(min) * 60000 + parseInt(sec) * 1000 + parseInt(ms)
    return toMs
}

function timer() {

    time = setInterval(() => {
        if (win == true) {
            clearInterval(time)
            curScore = timeToMs(pTimer.innerHTML.replace("Time:", " "))

            if (bestScore == 0 || bestScore > curScore) {
                bestScore = curScore
                pBest.innerHTML = `Best: ${min}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`
            }

        }

        if (ms >= 100) {
            ms = 0
            s++
        }

        if (s >= 60) {
            s = 0
            min++
        }
        pTimer.innerHTML = `Time: ${min}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`

        ms++
    }, 10);
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
    }
}

function numBtnCreate() {
    const numBtns = container.querySelectorAll(".numBtn")
    if (numBtns.length > 0) {
        return
    }
    for (let i = 1; i <= 9; i++) {
        numBtn = document.createElement("button")
        numBtn.classList.add("numBtn");

        numBtn.innerHTML = i
        game.append(numBtn)
    }
}

function isValid(num, row, col) {
    for (let j = 0; j < matrix.length; j++) {
        if (j !== col && matrix[row][j] === num) {
            return false
        }
    }


    for (let i = 0; i < matrix.length; i++) {
        if (i !== row && matrix[i][col] === num) {
            return false
        }
    }

    let blockRowStart = row - (row % 3)
    let blockColStart = col - (col % 3)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let r = blockRowStart + i
            let c = blockColStart + j
            if ((r !== row || c !== col) && matrix[r][c] === num) {
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
        removeNums(diffNum)
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
    tds = document.querySelectorAll("td")
    numBtns = document.querySelectorAll(".numBtn")

    tds.forEach(td => {
        td.replaceWith(td.cloneNode(true)) 
    })

    numBtns.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true)) 
    })

    tds = document.querySelectorAll("td")
 numBtn = [...document.querySelectorAll(".numBtn")]

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


                }

                else {
                    selected.style.backgroundColor = "red"
                    selected.innerHTML = num
                    wrong++
                    wrongTxt.innerHTML = `Wrong: ${wrong}`

                    if (wrong >= 3) {
                        selected.style.backgroundColor = "red"
                        txt.innerHTML = "YOU LOST!"
                        txt.style.fontSize = "25px"
                        txt.style.color = "red"
                        setTimeout(() => {
                            txt.innerHTML = ""
                            selected.style.backgroundColor = "rgb(163, 200, 251)"
                            selected.innerHTML = ""
                            selected = null
                            wrong = 0
                            gameStart()
                        }, 1000);
                        return
                    }

                    setTimeout(() => {
                        selected.style.backgroundColor = "rgb(163, 200, 251)"
                        selected.innerHTML = ""
                        selected = null
                    }, 1000);
                }
            }

            if (winner()) {
                win = true
                txt.innerHTML = "YOU WIN!"
                txt.style.fontSize = "27px"
                txt.style.color = "green"
                setTimeout(() => {
                    txt.innerHTML = ""
                    gameStart()
                }, 1000);
            }
        })


    })
}

function winner() {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == null) {
                return false
            }
        }
    }
    return true
}