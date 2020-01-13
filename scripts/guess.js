//global variables for number to guess and count
var numberToGuess;
var count;

//get references to elements
const txtNumber = document.getElementById("number");
const txtOutput = document.getElementById("output");

const btnGuess = document.getElementById("guess");
const btnRestart = document.getElementById("restart");

//add event listener
btnGuess.addEventListener("click", guess);
btnRestart.addEventListener("click", setUp);



//implement set up function to start or restart the game
function setUp() {
    //generate a random number between 1 - 100
    numberToGuess = Math.floor(Math.random() * (100)) + 1;
    //set count to 0
    count = 0;
    //set color of output to white
    txtOutput.setAttribute("class", "white");
    //clear all the text from output
    txtOutput.innerText = "";
    //clear and focus on the number field
    txtNumber.value = "";
    txtNumber.focus();
    //enable button and number field
    btnGuess.setAttribute("class", "btn");
    txtNumber.disabled = false;
    btnGuess.disabled = false;
    //focus number box
    txtNumber.focus();
}
//call set up function on page load to start the game
setUp();



//implement guess event handler
function guess() {
    //prevent form submission
    event.preventDefault();
    //increase the count
    count++;
    //get the guessed number from the number box
    const guessedNumber = parseInt(txtNumber.value);
    if (!guessedNumber || guessedNumber < 1 || guessedNumber > 100) {
        //flash dislay error message if the user doesn't enter proper number
        if (txtOutput.getAttribute("class") == "error") {
            txtOutput.setAttribute("class", "white");
        } else {
            txtOutput.setAttribute("class", "error");
        }
        txtOutput.innerText = "Please enter a number between 1 and 100";
        //decrement count
        count--;
    } else {
        //get the difference of guessedNumber and numberToGuess
        const difference = guessedNumber - numberToGuess;
        //gramatically correct count msg
        msg = (count == 1) ? `\nYou have had ${count} guess` : `\nYou have had ${count} guesses`;
        txtOutput.innerText = "Your guess is";
        if (difference == 0) {
            //set color of output to green and display success message
            txtOutput.setAttribute("class", "green");
            btnGuess.setAttribute("class", "btn won");
            txtOutput.innerText += " correct";
            txtOutput.innerText += msg;
            txtOutput.innerText += "\nRestart to play again";
            //disable guess button and number box
            txtNumber.disabled = true;
            btnGuess.disabled = true;
            //focus on restart button
            btnRestart.focus();
        } else {
            if (difference <= 10 && difference >= -10) {
                //set color of output to red if the difference is +-10
                txtOutput.setAttribute("class", "red");
            } else if (difference <= 30 && difference >= -30) {
                //set color of output to blue if the difference is +-30
                txtOutput.setAttribute("class", "blue");
            } else {
                //set color of output to white by simply removing the class
                txtOutput.setAttribute("class", "white");
            }
            //display appropriate error messages
            txtOutput.innerText += " too";
            txtOutput.innerText += (difference > 0) ? " high" : " low";
            txtOutput.innerText += msg;
            txtOutput.innerText += "\nPlease guess again";
        }
    }
    //select the number and focus on it
    txtNumber.select();
    txtNumber.focus();
}