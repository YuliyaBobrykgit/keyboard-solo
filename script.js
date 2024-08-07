const wordHolder = document.querySelector('.word');
const status = document.querySelector('.status');
const content = document.querySelector('.content');
const correctCount = document.querySelector('.correct-count');
const wrongCount = document.querySelector('.wrong-count');
const wordMistakes = document.querySelector('.word-mistakes');
const timer = document.querySelector('#timer');
let spans = Array.from(document.querySelectorAll('.word span'))


// Логика таймера


function formatTimer(value) {
    if (value < 10) {
        return `0${value}`
    }        
    return value;
}

let timerId;

function setTimer() {
    timerId = setInterval(() => {
        let [mm, ss] = timer.textContent.split(':').map(Number); 

        if (ss >= 0 && ss < 60) {
            ss++;
        } else if (ss > 59) {
            ss = 0;
            mm++;
        }
        timer.textContent = `${formatTimer(mm)}:${formatTimer(ss)}`;
    }, 1000);
}
setTimer()

// Логика отображения слова

async function renderRandomWord() {
    try {
        const fetchedResponse = await fetch('https://random-word-api.herokuapp.com/word?number=1')
        const fetchedResponseJson = await fetchedResponse.json();
        const word = fetchedResponseJson[0];
        spans.forEach((span) => {
            span.classList.remove('c');
            span.classList.remove('w');
        })
        wordHolder.innerHTML = word
            .split("")
            .map((char) => `<span>${char}</span>`)
            .join("");
            
        spans = Array.from(document.querySelectorAll('.word span'))
        // if (spans.length < randomWordSplitted.length) {
        //     let countDifference = randomWordSplitted.length - spans.length;
        //     for (let i = 0; i < countDifference; i++) {
        //         let additionalLetter = document.createElement('span')
        //         word.append(additionalLetter);
        //         spans.push(additionalLetter);
        //     }
        // } else if (spans.length > randomWordSplitted.length) {
        //     countDifference = spans.length - randomWordSplitted.length;
        //     for (let i = 0; i < countDifference; i++) {
        //         spans[0].remove()
        //         spans.shift();
        //     }
        // }
        // for (let i = 0; i < randomWordSplitted.length; i++) {
        //     spans[i].textContent = randomWordSplitted[i];
        // }
        currentWordErrorsNumber = 0;
        wordMistakes.textContent = 0;
        isWordFullyCorrect = false;
    } catch(error) { 
        console.error('Ошибка:', error);
    }
}

renderRandomWord()

// Логика  Correct / Wrong слов

let isWordFullyCorrect = false;

function detectIsWordFullyCorrect() {
    if (currentWordErrorsNumber === 0) {
        isWordFullyCorrect = true;
    }
}

let correctCountNumber = 0;
let wrongCountNumber = 0;

function countCorrentAndWrongWords() {
    if (isWordFullyCorrect) {
        correctCountNumber++;
        correctCount.textContent = correctCountNumber;
    } else {
        wrongCountNumber++;
        wrongCount.textContent = wrongCountNumber;
    }
}

function detectWinOrFail() {
    if (correctCountNumber === 5) {
        renderWinOrFail(`Победа! Ваше время: ${timer.textContent}`);
    } else if (wrongCountNumber === 5)  {
        renderWinOrFail(`Поражение! Ваше время: ${timer.textContent}`)
    }
}

function renderWinOrFail(text) {
    setTimeout (() => {
    alert(text);
    clearInterval(timerId);
    timer.textContent = '00:00'
    correctCount.textContent = 0;
    wrongCount.textContent = 0;
    correctCountNumber = 0;
    wrongCountNumber = 0;
    }, 100)
}

function generateNewWordOnSuccessfulWordComplete() {
    renderRandomWord();
    keyPressedCount = 0;
    detectIsWordFullyCorrect();
    countCorrentAndWrongWords();
    detectWinOrFail();
}


// Логика закрашивания нажатых букв

document.addEventListener('keydown', checkPressedLetter)

let keyPressedCount = 0;
let currentWordErrorsNumber = 0;

function checkPressedLetter(event) {
    const pressedLetter = event.key;
    if (pressedLetter === spans[keyPressedCount].textContent) {
        if (keyPressedCount < (spans.length - 1)) {
            spans[keyPressedCount].classList.add('c');
            spans[keyPressedCount].classList.remove('w');
            keyPressedCount++;
        } else {
            spans[keyPressedCount].classList.add('c');
            generateNewWordOnSuccessfulWordComplete();
        }
    } else {
        spans[keyPressedCount].classList.add('w');
        currentWordErrorsNumber++;
        wordMistakes.textContent = currentWordErrorsNumber;
    }
}



