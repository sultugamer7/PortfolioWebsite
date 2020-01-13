/*
    WHEN PAGE LOADS
*/
//get references to elements
const btnStart = document.getElementById("start");
const imgHangman = document.getElementById("hangmanImage");
const txtPuzzle = document.getElementById("puzzle");
const txtOutput = document.getElementById("hangOutput");
const txtKey = document.getElementById("keyInput");
const txtTimer = document.getElementById("timer");
const liWrongKeys = document.getElementById("wrongKeys");
const tableHighScore = document.getElementById("highScore");

//add event listeners
btnStart.addEventListener("click", setUp);
txtKey.addEventListener("keyup", () => {
    //get typed key from textbox
    let code = txtKey.value.charCodeAt(0);
    //check if game has started
    if (gameStarted == true && code != 13) {
        guess(code);
    }
});
imgHangman.addEventListener("mouseover", easter);

//declare game values
let gameStarted = false;
let phrases = [];
let phrase, wrongGuess, phraseLength, puzzle, clueFound, usedKeys, wrongKeys, timer;
var seconds;

//disable key input
txtKey.disabled = true;

//get phrases from phrases.json by using promise
usePromise();

//implement usePromise function
function usePromise() {
    fetch("phrases.json").then(function (response) {
        return response.text();
    }).then(function (data) {
        let gPhrases = JSON.parse(data)["phrases"];
        getPhrases(gPhrases);
    }).catch(function (error) {
        console.log(`Error - ${error}`);
    });
}

//implement getphrases function
function getPhrases(gPhrases) {
    //add 10 random phrases from gPhrases to phrases
    let count = 0;
    while (count != 10) {
        //get a random phrase
        let phrase = gPhrases[Math.floor(Math.random() * gPhrases.length)];
        //ensure phrase isn't already added in phrases
        if (!phrases.includes(phrase)) {
            //ensure phrase doesn't include quotes or dash
            if (!phrase.includes('"') && !phrase.includes("'") && !phrase.includes("-")) {
                //add phrase to phrases
                phrases.push(phrase);
                count += 1;
            }
        }
    }
}


//reference to high scores table
let highScore = [];

//if high score exists in localStorage, display them
if ("highScore" in localStorage) {
    highScore = JSON.parse(localStorage.getItem("highScore"));
    showHighScores();
}

//implement showHighScores function
function showHighScores() {
    tableHighScore.innerHTML = "";
    for (let i = 0; i < highScore.length; i++) {
        tableHighScore.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${highScore[i].name}</td>
                <td>${highScore[i].time}</td>
            </tr>
        `;
    }
}




/*
    WHEN USER STARTS OR RESTARTS THE GAME
*/
//implement set up function to start or restart the game
function setUp() {
    //initialize and start the timer
    timer = 0;
    seconds = setInterval(() => { incrementTimer() }, 1000);
    //selet a random phrase from the phrases array
    randomNumber = Math.floor(Math.random() * (10));
    phrase = phrases[randomNumber].toUpperCase();
    //initialize game values
    wrongGuess = 0;
    phraseLength = phrase.length;
    puzzle = [];
    clueFound = false;
    usedKeys = [];
    wrongKeys = [];
    gameStarted = true;
    //display first hangman image
    imgHangman.setAttribute("src", `images/hangman-${wrongGuess}.jpg`);
    //generate dashes
    let i = 0;
    while (i != phraseLength) {
        let currentChar = phrase[i];
        if (currentChar == " ") {
            puzzle.push(" ");
        } else {
            puzzle.push("-");
        }
        i += 1;
    }
    //display dashes and change start button to restart
    txtPuzzle.innerText = puzzle.join("");
    btnStart.innerText = "Restart";
    //set output box color to white and clear it
    txtOutput.setAttribute("class", "white");
    txtOutput.innerText = "";
    //enable key input and set focus
    txtKey.disabled = false;
    txtKey.focus();
    //clear list of wrong letters
    liWrongKeys.innerHTML = "";
}

//implement incrementTimer function
function incrementTimer() {
    timer++;
    txtTimer.innerText = `Timer: ${timer}s`;
}



/*
    WHEN USER PRESSES A KEY
*/
//implement guess event handler
function guess(code) {
    //clear textbox
    txtKey.value = "";
    //clear the output box and set it's color to white
    txtOutput.innerText = "";
    txtOutput.setAttribute("class", "white");
    //check if the key code belongs to an alphabet letter
    if (!((code >= 65 && code <= 90) || (code >= 97 && code <= 122))) {
        txtOutput.innerText = "The pressed key must be an alphabet!";
    } else {
        //get the pressed key and check if it is used
        let pressedKey = String.fromCharCode(code);
        pressedKey = pressedKey.toUpperCase();
        if (usedKeys.includes(pressedKey)) {
            txtOutput.innerText = `${pressedKey} is already used!`;
        } else {
            //add pressedKey to usedKeys
            usedKeys.push(pressedKey);
            //check pressedKey is in phrase
            if (phrase.includes(pressedKey)) {
                //replace corresponding dashes
                for (let i = 0; i < phraseLength; i++) {
                    if (phrase[i] == pressedKey) {
                        puzzle[i] = pressedKey;
                        txtPuzzle.innerText = puzzle.join("");
                    }
                }
                //check if user won the game
                if (!puzzle.includes("-")) {
                    //stop the timer
                    clearInterval(seconds);
                    txtOutput.innerText = `Congratulations! You Won!!!\nNumber of wrong guesses: ${wrongGuess}\nPress Restart button to play again`;
                    txtOutput.setAttribute("class", "green");
                    //prevent user from guessing more
                    gameStarted = false;
                    //disable key input
                    txtKey.disabled = true;
                    //display hangman won image
                    imgHangman.setAttribute("src", `images/hangmanGameWon.jpg`);
                    //check if it is a new high score
                    isHighScore(timer);
                }
            } else {
                //output error message
                txtOutput.innerText = `${pressedKey} is not in phrase`;
                //increment wrongGuesses, and display next hangman image
                wrongGuess++;
                //display next hangman image
                imgHangman.setAttribute("src", `images/hangman-${wrongGuess}.jpg`);
                //add pressedKeys to wrongKeys and output it
                wrongKeys.push(pressedKey);
                liWrongKeys.innerHTML += `<li>${pressedKey}</li>`;
                //check if user lost the game
                if (wrongGuess - 8 == 0) {
                    //stop the timer
                    clearInterval(seconds);
                    txtOutput.innerText = `You're hanged!!!\nCorrect phrase:\n ${phrase}\nNumber of wrong guesses: ${wrongGuess}\nPress Restart button to play again`;
                    txtOutput.setAttribute("class", "red");
                    //prevent user from guessing more
                    gameStarted = false;
                    //disable key input
                    txtKey.disabled = true;
                    //focus  start/restart button
                    btnStart.focus();
                }
            }
        }
    }
}

//implement isHighScore function
function isHighScore(time) {
    //check if it is a high score
    if (highScore.length == 0 || highScore.length < 10) {
        //disable start button
        btnStart.disabled = true;
        //high score list empty or not full, therefore, add it to the high score
        setTimeout(() => { addHighScore(time) }, 1000);
    } else if (time < highScore[highScore.length - 1].time) {
        //disable start button
        btnStart.disabled = true;
        //it is a high score therefore, add it to the high score
        setTimeout(() => { addHighScore(time) }, 1000);
    }
}

//implement addHighScore function
function addHighScore(time) {
    //get user's name
    let name = "";
    while (name == "" || name == null || name.includes(" ")) {
        name = prompt("Congratulations!\nYou made a high score!\nEnter your display name");
    }
    //capitalize only the first letter of the name
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    //add high score
    let entry = { "name": name, "time": time };
    highScore.push(entry);
    //sort high score by numeric sort - https://www.w3schools.com/js/js_array_sort.asp
    highScore.sort(function (a, b) { return a.time - b.time });
    if (highScore.length == 11) {
        highScore.pop();
    }
    localStorage.setItem('highScore', JSON.stringify(highScore));
    //display new high scores
    showHighScores();
    //enable start/restart button
    btnStart.disabled = false;
    //focus start/restart button
    btnStart.focus();
}



/*
    EASTER EGG: WHEN USER HOVERS OR CLICKS ON THE HANGMAN IMAGE
*/
//implement easter event handler
function easter() {
    //check if clue already found and game is started
    if (clueFound == false && gameStarted == true) {
        //check if wrongGuesses is greater than 2
        if (wrongGuess > 2) {
            //get clue
            let i = 0;
            while (i != phraseLength && clueFound != true) {
                if (puzzle[i] == "-") {
                    //display clue
                    let clue = phrase[i];
                    txtOutput.setAttribute("class", "blue");
                    txtOutput.innerText = `Try Pressing '${clue}' 😉`;
                    clueFound = true;
                }
                i += 1;
            }
        }
    }
}