var headerEl = document.getElementById("header");
var homeScreenEl = document.getElementById("home-screen");
var questionScreenEl = document.getElementById("question-screen");
var completeScreenEl = document.getElementById("complete-screen");
var highscoreScreenEl = document.getElementById("highscore-screen");

var questionNameEl = document.getElementById("question-name");
var answersEl = document.getElementById("answers");
var answersOutputEl = document.getElementById("answer-output");

var finalScoreEl = document.getElementById("final-score");
var userInitialsEl = document.getElementById("initials");
var submitScoreButtonEl = document.getElementById("submit-score-btn");

var highscoreListEl = document.getElementById("highscore-list");
var viewHighscoreEl = document.getElementById("view-highscore");
var clearHighScoreListEl = document.getElementById("clear-highscore");
var goHomeBtnEl = document.getElementById("go-home");

var timeLeftEl = document.getElementById("time-left");
var startButtonEl = document.getElementById("start-button");

// once start is clicked display changes to questions and hides start screen
function quizStart() {
  // sets global variables that are reset each time quizStart is run - still trying to get my head around getting variables accross functions with making them global
  totalSeconds = 60;
  questionIndex = 0;
  homeScreenEl.setAttribute("class", "d-none");
  questionScreenEl.setAttribute("class", "d-block");
  startTimer();
  questionDisplay();
}

// function that deals with the quiz questions and answers
function questionDisplay() {
  questionNameEl.textContent = questions[questionIndex].question;
  answersEl.innerHTML = "";
  //   loops through choices and adds buttons for each one
  for (i = 0; i < questions[questionIndex].choices.length; i++) {
    var choice = questions[questionIndex].choices[i];
    var choiceEl = document.createElement("button");
    // adds a value so that answer can be checked
    choiceEl.setAttribute("value", choice);
    choiceEl.setAttribute("class", "btn btn-primary w-50 m-1");

    // numbers answers and outputs choices
    choiceEl.textContent = i + 1 + ". " + choice;

    //checks if choice is clicked and runs function
    choiceEl.onclick = questionClick;

    answersEl.appendChild(choiceEl);
  }
}

function questionClick() {
  // checks to see if wrong choice is selected - minus 15 seconds if incorrect
  if (this.value !== questions[questionIndex].answer) {
    totalSeconds -= 15;

    answersOutputEl.textContent = "Incorrect";
    answersOutputEl.style.color = "red";
    // text dissapears after 1 second
    setTimeout(function() {
      answersOutputEl.innerHTML = "";
    }, 1000);
  } else {
    answersOutputEl.textContent = "Correct";
    answersOutputEl.style.color = "green";
    setTimeout(function() {
      answersOutputEl.innerHTML = "";
    }, 1000);
    questionIndex++;
    if (questionIndex === questions.length) {
      clearInterval(interval);
      completeDisplay();
    } else {
      questionDisplay();
    }
  }
}

// when questions are complete changes screen and shows score
function completeDisplay() {
  questionScreenEl.setAttribute("class", "d-none");
  completeScreenEl.setAttribute("class", "d-block");
  finalScoreEl.textContent = totalSeconds;
  // stops timer when complete
  clearInterval(interval);
}

// function runds from quizstart function and checks to see if hits 0 - if so runds timesup function
function startTimer() {
  interval = setInterval(function() {
    totalSeconds--;
    timeLeftEl.textContent = Math.floor(totalSeconds);
    if (totalSeconds < 0) {
      timeLeftEl.textContent = "0";
      clearInterval(interval);
      timesUp();
    }
  }, 1000);
}

// once time is this function runs which resets back to main screen
function timesUp() {
  alert("You have run out of time!!!!");
  homeScreenEl.setAttribute("class", "d-block");
  questionScreenEl.setAttribute("class", "d-none");
}

function highscores() {
  // clears timer if high scores clicked during quiz as timer keeps going otherwise
  clearInterval(interval);
  // hide header
  headerEl.setAttribute("class", "d-none");
  // shows correct screen
  completeScreenEl.setAttribute("class", "d-none");
  homeScreenEl.setAttribute("class", "d-none");
  questionScreenEl.setAttribute("class", "d-none");
  highscoreScreenEl.setAttribute("class", "d-block");

  var initials = userInitialsEl.value;
  if (initials !== "") {
    var highscoreList =
      JSON.parse(window.localStorage.getItem("highscoreListStorage")) || [];

    var currentScore = { score: totalSeconds, initials: initials };

    // retrieve highscores if any, if not a blanck array

    // adds current score to high score
    highscoreList.push(currentScore);
    // adds highscores to local storage
    window.localStorage.setItem(
      "highscoreListStorage",
      JSON.stringify(highscoreList)
    );
  }
  highscorePage();
}

function highscorePage() {
  // clears list first otherwise repeats lists
  highscoreListEl.textContent = "";

  var newhighscoreList =
    JSON.parse(window.localStorage.getItem("highscoreListStorage")) || [];

  // sorts highscores by score
  newhighscoreList.sort(function(a, b) {
    return a.score - b.score;
  });

  //    creates li elements
  newhighscoreList.forEach(function(score) {
    var highscoreLi = document.createElement("li");
    highscoreLi.textContent = score.initials + " - " + score.score;
    highscoreListEl.appendChild(highscoreLi);
  });
}

// clears highscore list
function clearHighScoreList() {
  window.localStorage.removeItem("highscoreListStorage");
  window.location.reload();
}

// resets the input text field
function resetInitials() {
  userInitialsEl.value = "";
}

startButtonEl.addEventListener("click", quizStart);
submitScoreButtonEl.addEventListener("click", function() {
  highscores();
  resetInitials();
});
viewHighscoreEl.addEventListener("click", highscores);
clearHighScoreListEl.addEventListener("click", clearHighScoreList);
goHomeBtnEl.addEventListener("click", function() {
  homeScreenEl.setAttribute("class", "d-block");
  headerEl.setAttribute("class", "d-block");
  highscoreScreenEl.setAttribute("class", "d-none");
  timeLeftEl.textContent = 60;
});
