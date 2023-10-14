const userScore = document.querySelector('.user-score');
const pcScore = document.querySelector('.pc-score');
const gameRulesBox = document.querySelector('.game-rules');
const playArea = document.querySelector('#play-area');
const hurrayPage = document.querySelector('#hurray-page');
const rpsResult = document.querySelector('.rps-result');
const rpsOptions = document.querySelector('.rps-options');
const resultText = document.querySelector('.result-text');
const nextButton = document.querySelector('.next');

const pcRPSOptions = [...rpsOptions.children].slice(3);

let scores = JSON.parse(localStorage.getItem('scores')); //Retreiving Scores from Local Storage;
(scores)? setScores(): localStorage.setItem('scores', JSON.stringify({user: 0, pc: 0})); //if scores then set else create.

function setScores() {
    userScore.textContent = scores.user;
    pcScore.textContent = scores.pc;
}

function removeElement(element) { //Removing a element from DOM.
    element.classList.add('remove');
}

function showElement(element) { //Showing a element inside DOM.
    element.classList.remove('remove');
}

//Onlick Event Handlers.

document.querySelector('.reset').onclick = ()=> {
    scores = {user: 0, pc: 0}; setScores(); localStorage.setItem('scores', JSON.stringify(scores));
}

function toggleRulesBox() {
    gameRulesBox.classList.contains('remove') ? showElement(gameRulesBox) : removeElement(gameRulesBox);;
}

function showHurrayPage() {
    removeElement(playArea)
    removeElement(nextButton);
    showElement(hurrayPage);
}

function handlePlayAgain() {
    location.reload();
}

const handleTie = ()=> {
    resultText.children[0].textContent = "IT'S A TIE";
    resultText.children[1].textContent = "";
}

const findWinner = (user, pc, callback)=> {
    let userWins = false;
    switch (user.className) {
        case 'rock': 
            if(pc.className === "scissors") userWins = true;
            break;
        case 'scissors': 
            if(pc.className === "paper") userWins = true;
            break;
        case 'paper': 
            if(pc.className === "rock") userWins = true;
            break;
        default:
            break;
    }

    resultText.children[0].textContent = (userWins)? "YOU WIN": "YOU LOST";
    if(userWins) {
        showElement(nextButton);
        callback(user);
        scores.user+=1;
    } else {
        callback(pc);
        scores.pc+=1;
    }

    setScores();
    localStorage.setItem('scores', JSON.stringify(scores));
}

rpsOptions.onclick = (e)=> {
    const element = (e.target.tagName === 'IMG')? e.target.parentElement : e.target;
    const optionClass = element.className;
    if(optionClass === 'rock' || optionClass === 'scissors' || optionClass === 'paper') {
        const userSelection = element.cloneNode(true)
        const pcSelection = pcRPSOptions[Math.floor(Math.random() * 3)].cloneNode(true);

        //Checking if tie -> handle tie otherwise find winner and handle it.
        (optionClass === pcSelection.className)? handleTie() : findWinner(userSelection, pcSelection, (winner)=> {
            winner.classList.add('winner-animation');
        })

        document.querySelector('.user-pick').children[1].replaceWith(userSelection);
        document.querySelector('.pc-pick').children[1].replaceWith(pcSelection);
        removeElement(rpsOptions);
        showElement(rpsResult);
    }
}
