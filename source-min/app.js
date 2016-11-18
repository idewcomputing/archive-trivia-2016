var trivia;

function setup() {
    trivia = new Trivia(questionBank);
    trivia.appName('testing2');//replace 'testing' with a unique name for your app
    gotoLaunchScreen();
}

function gotoLaunchScreen() {
    $('#launch-screen').show();
    $('#question-screen').hide();
    trivia.buildLaunchScreen();
}

function onCategorySelect(category) {
    gotoQuestionScreen(category);
}

function gotoQuestionScreen(category) {
    $('#launch-screen').hide();
    $('#question-screen').show();
    trivia.buildQuestionScreen(category);
}

function onAnswer(correct, e) {
    if (correct) console.log('Correct Answer!');
    else console.log('Incorrect Answer.');
    $('.answer-button').off(); //don't allow user to try again on question
    $('#correctAnswer').append('<b> &#10003;</b>'); //put a check mark on correct answer
}

function onCategoryFinish(category) {
    gotoLaunchScreen();
    alert('You have answered all the questions in the ' + category + ' category.')
}