const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const timerElement = document.getElementById("timer");
const questionCount = document.getElementById("question-count");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;

let quizReport = [];

function startQuiz(chapter){

homeScreen.classList.add("hidden");
quizScreen.classList.remove("hidden");

if(chapter === "all"){

questions = [
...questionBank.chapter5,
...questionBank.chapter6,
...questionBank.chapter7,
...questionBank.chapter8
];

}else{

questions = [...questionBank[chapter]];
}

questions = shuffleArray(questions);

currentQuestionIndex = 0;
score = 0;
quizReport = [];

showQuestion();
}

function showQuestion(){

resetState();

if(currentQuestionIndex >= questions.length){
showResults();
return;
}

startTimer();

const currentQuestion = questions[currentQuestionIndex];

questionCount.innerText =
`Question ${currentQuestionIndex + 1} / ${questions.length}`;

questionElement.innerText = currentQuestion.question;

currentQuestion.options.forEach(option => {

const button = document.createElement("button");

button.innerText = option;

button.classList.add("option-btn");

button.addEventListener("click", () =>
selectAnswer(button, currentQuestion.answer)
);

optionsElement.appendChild(button);

});
}

function selectAnswer(button, correctAnswer){

clearInterval(timer);

const userAnswer = button.innerText;

const isCorrect = userAnswer === correctAnswer;

if(isCorrect){
score++;
}

quizReport.push({
question: questions[currentQuestionIndex].question,
userAnswer: userAnswer,
correctAnswer: correctAnswer,
isCorrect: isCorrect
});

const buttons = document.querySelectorAll(".option-btn");

buttons.forEach(btn => {

btn.disabled = true;

if(btn.innerText === correctAnswer){
btn.classList.add("correct");
}

});

if(!isCorrect){
button.classList.add("wrong");
}

setTimeout(() => {

currentQuestionIndex++;
showQuestion();

}, 700);

}

function resetState(){

clearInterval(timer);

timeLeft = 20;

timerElement.innerText = timeLeft;

optionsElement.innerHTML = "";

}

function startTimer(){

timer = setInterval(() => {

timeLeft--;

timerElement.innerText = timeLeft;

if(timeLeft <= 0){

clearInterval(timer);

quizReport.push({
question: questions[currentQuestionIndex].question,
userAnswer: "Not Answered",
correctAnswer: questions[currentQuestionIndex].answer,
isCorrect: false
});

currentQuestionIndex++;

showQuestion();

}

},1000);

}

function showResults(){

quizScreen.classList.add("hidden");

resultScreen.classList.remove("hidden");

document.getElementById("total-questions").innerText = questions.length;

document.getElementById("correct-answers").innerText = score;

document.getElementById("wrong-answers").innerText =
questions.length - score;

document.getElementById("score").innerText =
`${score} / ${questions.length}`;

document.getElementById("percentage").innerText =
((score / questions.length) * 100).toFixed(2);

generateReportTable();

}

function generateReportTable(){

const tableContainer = document.getElementById("report-table");

let html = `

<table border="1" cellpadding="10" cellspacing="0">

<tr>
<th>#</th>
<th>Question</th>
<th>Your Answer</th>
<th>Correct Answer</th>
</tr>

`;

quizReport.forEach((item, index) => {

html += `

<tr>

<td>${index + 1}</td>

<td>${item.question}</td>

<td style="color:${item.isCorrect ? 'green' : 'red'}">
${item.userAnswer}
</td>

<td>
${item.isCorrect ? '-' : item.correctAnswer}
</td>

</tr>

`;

});

html += `</table>`;

tableContainer.innerHTML = html;

}

function downloadPDF(){

const reportContent = document.getElementById("result-screen").innerHTML;

const win = window.open('', '', 'width=900,height=700');

win.document.write(`
<html>
<head>
<title>Quiz Report</title>

<style>

body{
font-family:Arial;
padding:20px;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

th, td{
border:1px solid black;
padding:10px;
text-align:left;
}

th{
background:#eee;
}

</style>

</head>

<body>

<h1>Quiz Report</h1>

${reportContent}

</body>
</html>
`);

win.document.close();

win.print();

}

function goHome(){

resultScreen.classList.add("hidden");

homeScreen.classList.remove("hidden");

}

function shuffleArray(array){

for(let i = array.length - 1; i > 0; i--){

const j = Math.floor(Math.random() * (i + 1));

[array[i], array[j]] = [array[j], array[i]];

}

return array;

}