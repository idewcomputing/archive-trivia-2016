var trivia;

function setup() {
    trivia = new Trivia(questionBank);
    gotoLaunchScreen();
    //preload some sounds to use later
    correctSound = new Audio('correct.wav');
    incorrectSound = new Audio('incorrect.wav');
}

function gotoLaunchScreen() {
    $('#launch-screen').show();
    $('#question-screen').hide();
    trivia.buildLaunchScreen();
    $('#trivia-answered').html('Answered: ' + trivia.answeredCount());
    $('#trivia-question-count').html('Total Questions: ' + trivia.questionCount());
    $('#trivia-correct-count').html('Correct Answers: ' + trivia.successCount());
}

function onCategorySelect(category){
    gotoQuestionScreen(category);
}

function gotoQuestionScreen(category) {
    $('#launch-screen').hide();
    $('#question-screen').show();
    trivia.buildQuestionScreen(category);
    updateCategoryMetrics(category);
    $('#feedback').html('');
}

function onAnswer(correct, e) {
    if (correct) {
        $('#feedback').html('Nice Work!');
        correctSound.play();
    } else {
        $('#feedback').html('Nope.');
        incorrectSound.play();
    }
    updateCategoryMetrics(trivia.currentCategory);
    $('.answer-button').off(); //don't allow user to try again on question
    $('#correctAnswer').append('<b> &#10003;</b>'); //put a check mark on correct answer
}

function onCategoryFinish (category){
    gotoLaunchScreen();
    alert('You have answered all the questions in the ' + category + ' category.')
}

function updateCategoryMetrics(category) {
    $('.answeredCount').html(trivia.answeredCount(category));
    $('.questionCount').html(trivia.questionCount(category));
    $('.correctCount').html(trivia.successCount(category));
}