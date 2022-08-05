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


//create all level sequence lengths and speed
//this part controls how difficult each level will be
const allSeqLens = [3, 4, 5, 6, 6, 7]
const allTimeouts = [500, 500, 500, 500, 400, 400]
let level = 0

//show home page and hide all pop-up boxes that are not needed
function homePage() {
    winBox.style.visibility = 'hidden'
    loseBox.style.visibility = 'hidden'
    bigWinBox.style.visibility = 'hidden'
    startBox.style.visibility = 'visible'
    levelCount.innerHTML = '?'
    level = 0
    reset()
}

//main play game function
function playLevel() {
    //get correct parameters for current level
    const seqLen = allSeqLens[level]
    const timeout = allTimeouts[level]

    //hide all pop-up boxes that are not needed
    startBox.style.visibility = 'hidden'
    winBox.style.visibility = 'hidden'
    loseBox.style.visibility = 'hidden'
    bigWinBox.style.visibility = 'hidden'

    //reset css and html for all squares
    reset()

    //randomly generate sequence that will be shown to the user
    const sequence = generateSequence(seqLen)

    //countdown before showing the sequence to the user
    countdownSequence()

    //show user the sequence of squares
    let remaining = 1; //update remaining squares displayed in the top right of the game box
    let timeoutCount = 5000 + timeout //5000 is how long the countdown takes
    const totalTimeout = 5000 + (timeout * 2) * seqLen //calculate the total amount of time it will take before allowing the user to click
    sequence.forEach(function(square) { //show user the sequence they need to click by changing css of squares
        setTimeout(changeColorStatic, timeoutCount, square)
        timeoutCount += timeout //update the timeout
        setTimeout(changeColorBackStatic, timeoutCount, square, remaining)
        timeoutCount += timeout
        remaining++ //update the remaining squares
    })

    //allow user to click squares
    setTimeout(clickable, totalTimeout)
    //set squares to respond correctly to clicks
    setTimeout(setSquares, totalTimeout, sequence)
}

//changing the level displayed in the upper left corner of the game box
function updateLevel() {
    levelCount.innerHTML = level + 1
    //call the level function to allow the user to play the next level
    playLevel()
    level++ //increase the level count
}

//reset the html and css for all squares as well as the count of the number of squares
function reset() {
    remainCount.innerHTML = '?'
    squares.forEach(function(square) {
        //reset all colors
        square.style.backgroundColor = originalColor

        //clear all innerHTML
        square.p.innerHTML = ''
    })
}

//count down from three before showing the user the generated sequence
function countdownSequence() {
    countdownBox.style.visibility = 'visible'
    //show level
    countdown.innerHTML = 'level ' + (level + 1)
    //begin countdown, show each number/prompt for one second
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

//randomly generate a sequence of squares based on a given number of squares
function generateSequence(num) {
    const sequence = []
    let count = 0
    while(count < num) {
        const index = parseInt(Math.random() * 9) //randomly choose a square out of 9
        sequence.push(squares[index]) //add the square to the sequence
        count++ //keep track of number of squares added to sequence
    }
    return sequence
}

//make the squares clickable for the users
function clickable() {
    //add click event listeners for all squares to change color when the user presses down
    squares.forEach(function(square) {
        square.addEventListener('mousedown', changeColor)
        square.addEventListener('mouseup', changeColorBack)
    })
}

//give squares the correct event handlers based on if they are next in the sequence or not
function setSquares(sequence) {
    for(let i  = 0; i < sequence.length; i++) {
        sequence[i].s = sequence
    }
    sequence[0].next = 1; //store the index of the next square in the sequence as a property of the current square

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
    //get the index of the next correct square in the sequence from the current correct square
    const nextIndex = event.target.next
    //get entire array of square sequence
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
        let correctSquare = sequence[nextIndex] //get new correct square based on the next index
        delete event.target.next //remove the next property from the current correct square
        correctSquare.next = nextIndex + 1 //give the new correct square the next index property

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

    //change the css of the square to indicate to the user that they clicked wrong
    event.target.style.backgroundColor = wrongColor
    event.target.p.innerHTML = 'X﹏X'
    //prompt the user to see if they want to play again
    loseBox.style.visibility = 'visible'    
}

//remove all event listeneres for all squares
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