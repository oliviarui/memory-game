//how to get a bunch of elements by id using a for loop
//get all squares
const ids = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const squares = []
ids.forEach(function(id) {
    squares.push(document.getElementById(id))
})
squares.forEach(function(square) {
    square.p = square.querySelector('.text')
})

//get instructions elements
const instrShow = document.getElementById('open-instr')
const instrHide = document.getElementById('close-instr')
const instrText = document.getElementById('text-instr')
//get lessons learned elements
const LessonShow = document.getElementById('open-lesson')
const LessonHide = document.getElementById('close-lesson')
const LessonText = document.getElementById('text-lesson')
//make instructions and lessons learned interactive
instrShow.onclick = showInstructions
instrHide.onclick = hideInstructions
LessonShow.onclick = showLesson
LessonHide.onclick = hideLesson

function showInstructions() {
    instrShow.style.visibility = 'hidden'
    instrHide.style.visibility = 'visible'
    instrText.style.display = 'block'
}
function hideInstructions() {
    instrHide.style.visibility = 'hidden'
    instrShow.style.visibility = 'visible'
    instrText.style.display = 'none'
}
function showLesson() {
    LessonShow.style.visibility = 'hidden'
    LessonHide.style.visibility = 'visible'
    LessonText.style.display = 'block'
}
function hideLesson() {
    LessonHide.style.visibility = 'hidden'
    LessonShow.style.visibility = 'visible'
    LessonText.style.display = 'none'
}

//get counters
const remainCount = document.getElementById('squares-remaining')
const levelCount = document.getElementById('level')

//get all buttons
const start1 = document.getElementById('start-button')
const start2 = document.getElementById('start-button-2')
const start3 = document.getElementById('start-button-3')
const exit1 = document.getElementById('exit-button')
const exit2 = document.getElementById('exit-button-2')
const exit3 = document.getElementById('exit-button-3')
const nextLevel = document.getElementById('next-level-button')

//get all boxes
const startBox = document.getElementById('start')
const winBox = document.getElementById('win')
const loseBox = document.getElementById('lose')
const bigWinBox = document.getElementById('ultimate-win')
const countdownBox = document.getElementById('countdown')
    //get countdown numbers
    const countdown = document.getElementById('countdown-numbers')


//set color variables
const clickColor = '#e2f6d8'
const originalColor = '#9ABD97'
const wrongColor = '#D36135'

//these event listeners don't need to be removed because I will hide their parent boxes
//create event listeners for start & next level buttons
start1.addEventListener('click', updateLevel)
start2.addEventListener('click', updateLevel)
start3.addEventListener('click', updateLevel)
nextLevel.addEventListener('click', updateLevel)
//create event listeners for end buttons
exit1.addEventListener('click', homePage)
exit2.addEventListener('click', homePage)
exit3.addEventListener('click', homePage)


//create level sequence lengths and add to next level button properties
const allSeqLens = [3, 4, 5, 6, 6, 7]
const allTimeouts = [500, 500, 500, 500, 400, 400]
let level = 0

function homePage() {
    winBox.style.visibility = 'hidden'
    loseBox.style.visibility = 'hidden'
    bigWinBox.style.visibility = 'hidden'
    startBox.style.visibility = 'visible'
    levelCount.innerHTML = '?'
    level = 0
    reset()
}

function playLevel() {
    //get correct parameters for current level
    const seqLen = allSeqLens[level]
    const timeout = allTimeouts[level]

    //hide all boxes
    startBox.style.visibility = 'hidden'
    winBox.style.visibility = 'hidden'
    loseBox.style.visibility = 'hidden'
    bigWinBox.style.visibility = 'hidden'

    //reset square css and html
    reset()

    //generate sequence
    const sequence = generateSequence(seqLen)

    //countdown
    countdownSequence()

    //show squares
    let remaining = 1; //update reaining squares
    let timeoutCount = 5000 + timeout //5000 is how long the countdown takes
    const totalTimeout = 5000 + (timeout * 2) * seqLen
    sequence.forEach(function(square) {
        setTimeout(changeColorStatic, timeoutCount, square)
        timeoutCount += timeout
        setTimeout(changeColorBackStatic, timeoutCount, square, remaining)
        timeoutCount += timeout
        remaining++
    })

    //allow user to click squares
    setTimeout(clickable, totalTimeout)
    //set squares to respond correctly to clicks
    setTimeout(setSquares, totalTimeout, sequence)
}

function updateLevel() {
    levelCount.innerHTML = level + 1
    playLevel()
    level++
}

function reset() {
    remainCount.innerHTML = '?'
    squares.forEach(function(square) {
        //reset all colors
        square.style.backgroundColor = originalColor

        //clear all innerHTML
        square.p.innerHTML = ''
    })
}

//remember set timeout doesn't add the timeouts by itself, you have to set the total timeout length
function countdownSequence() {
    countdownBox.style.visibility = 'visible'
    countdown.innerHTML = 'level ' + (level + 1)
    //show level
    setTimeout(function() {
       countdown.innerHTML = '3'
    }, 1000)
    //start countdown
    setTimeout(function() {
        countdown.innerHTML = '2'
    }, 2000)
    setTimeout(function() {
        countdown.innerHTML = '1'
    }, 3000)
    setTimeout(function() {
        countdown.innerHTML = 'start looking!'
    }, 4000)
    setTimeout(function() {
        countdownBox.style.visibility = 'hidden'
        countdown.innerHTML = ''
    }, 5000)
}

function generateSequence(num) {
    const sequence = []
    let count = 0
    while(count < num) {
        const index = parseInt(Math.random() * 9)
        sequence.push(squares[index])
        count++
    }
    return sequence
}

function clickable() {
    //add click event listeners for all squares
    squares.forEach(function(square) {
        square.addEventListener('mousedown', changeColor)
        square.addEventListener('mouseup', changeColorBack)
    })
}

function setSquares(sequence) {
    for(let i  = 0; i < sequence.length; i++) {
        sequence[i].s = sequence
    }
    sequence[0].next = 1;

    const correctSquare = sequence[0]
    squares.forEach(function(square) {
        if(square == correctSquare) {
            square.addEventListener('click', correct)
        } else {
            square.addEventListener('click', incorrect)
        }
    })
}

// !!! you cannot pass parameters to event handler functions,
// the parameters must somehow be stored within the event target itself
function correct(event) {
    const nextIndex = event.target.next
    const sequence = event.target.s
    //update remaining squares count
    remainCount.innerHTML = sequence.length - nextIndex
    
    //check if user has completed sequence
    if(nextIndex >= sequence.length) { //user has completed sequence
        removeSquareListeners() //remove all listeners for current level (can't click anymore)
        if(level == 6) { //user has completed entire game
            bigWinBox.style.visibility = 'visible'
            level = 0
        } else { //user has not completed entire game
            winBox.style.visibility = 'visible'
        }
    } else { //user has not completed sequence, so continue
        //update correct square and give the new correct square the next index in the sequence
        let correctSquare = sequence[nextIndex]
        delete event.target.next
        correctSquare.next = nextIndex + 1

        //update event listeners according to new correct square
        squares.forEach(function(square) {
            //remove old correct and incorrect event listeners
            square.removeEventListener('click', incorrect)
            square.removeEventListener('click', correct)

            //add new event listeners
            if(square == correctSquare) {
                square.addEventListener('click', correct)
            } else {
                square.addEventListener('click', incorrect)
            }
        })
    }
}

function incorrect(event) {
    //set level back to zero to start from the beginning
    level = 0

    //remove all event listeners for squares
    removeSquareListeners()

    event.target.style.backgroundColor = wrongColor
    event.target.p.innerHTML = 'X﹏X'
    loseBox.style.visibility = 'visible'    
}

function removeSquareListeners() {
    squares.forEach(function(square) {
        square.removeEventListener('click', incorrect)
        square.removeEventListener('click', correct)
        square.removeEventListener('mousedown', changeColor)
        square.removeEventListener('mouseup', changeColorBack)
    })
}

function changeColorStatic(square) {
    square.style.backgroundColor = clickColor
}

function changeColorBackStatic(square, remaining) {
    square.style.backgroundColor = originalColor
    remainCount.innerHTML = remaining
}

function changeColor(event) {
    event.target.style.backgroundColor = clickColor
}

function changeColorBack(event) {
    event.target.style.backgroundColor = originalColor
}