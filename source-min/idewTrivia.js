//version 1.3
//added image for categories and questions
//added basic database function
//added timer function

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCx0Ya0fUYqiFopPGf90h-z9KOuYI92-nc",
    authDomain: "idewtrivia.firebaseapp.com",
    databaseURL: "https://idewtrivia.firebaseio.com",
    storageBucket: "idewtrivia.appspot.com",
    messagingSenderId: "792805145967"
};
firebase.initializeApp(config);


var Trivia = function(obj) {
    this.bank = obj;
    this.cats = [];
    this.categoryPieSelect = false;
    this.triviaAppName=null;
    for (var i = 0; i < this.bank.length; i++) {
        if (this.cats.map(function(e) {
                    return e.categoryLabel;
                }).indexOf(this.bank[i].category) == -1) {
            var str = this.bank[i].category;
            if (this.bank[i].categoryImage) {
                var img = this.bank[i].categoryImage;
                this.cats.push({
                        categoryIndex: this.cats.length,
                        categoryLabel: str,
                        categoryImage: img
                    });
            } else this.cats.push({
                    categoryIndex: this.cats.length,
                    categoryLabel: str
                });
        }
    }
    console.log('%c \nCategory Data:\n' + JSON.stringify(this.cats, null, 2), 'color: red; font-weight: bold;');
};

Trivia.prototype.buildLaunchScreen = function() {
    var self = this;
    var directives = {
        categoryButton: {
            id: function() {
                return this.categoryLabel.replace(/ /g, '');
            },
            onclick: function() {
                return 'onCategorySelect("' + this.categoryLabel + '");';
            }
        },
        categoryLabel: {
            html: function() {
                return this.categoryLabel;
            }
        },
        categoryImage: {
            src: function() {
                return this.categoryImage;
            }
        },
        categoryQuestionCount: {
            html: function() {
                return self.questionCount(this.value);
            }
        },
        categoryAnsweredCount: {
            html: function() {
                return self.answeredCount(this.value);
            }
        },
        categoryCorrectCount: {
            html: function() {
                return self.successCount(this.value);
            }
        }
    };
    $('.iTrivia-categories').render(this.cats, directives);
};

Trivia.prototype.buildQuestionScreen = function(cat) {
    this.currentQuestion = {};
    this.currentCategory = cat;
    this.categoryImage = null;
    this.questionImage = null;
    var filteredQs = this.filteredBank(cat, false, null);
    if (filteredQs.length > 0) {
        randomIndex = Math.floor(Math.random() * filteredQs.length);
        this.currentQuestion = filteredQs[randomIndex];
        this.currentQid = this.currentQuestion.id;
        $('#iTrivia-question').render(this.currentQuestion);
        if (this.currentQuestion.categoryImage) {
            this.categoryImage = this.currentQuestion.categoryImage;
        }
        if (this.currentQuestion.questionImage) {
            this.questionImage = this.currentQuestion.questionImage;
        }
        $('.answer-button').off(); //clears previous click listeners
        var self = this;
        $('.answer-button').click(function(e) {
            self.processAnswer(e);
        });
        this.shuffle('.answerSet');
    } else {
        this.finishedCategory(cat);
    }
};

Trivia.prototype.timeExpired = function (){
    var newDiv= $('<div/>', { id: 'timeExpired', class: 'answer-button'});
    newDiv.hide();
    var self=this;
    newDiv.click(function(e) {
        self.processAnswer(e);
    });
    newDiv.click();
    
}

Trivia.prototype.processAnswer = function(e) {
    var tempArray = this.bank;
    var isCorrect = null;
    var index = tempArray.map(function(e) {
        return e.id;
    }).indexOf(this.currentQid);
    if (e.target.id == 'correctAnswer') {
        isCorrect = true;
        this.bank[index].success = true;
        if (this.triviaAppName) this.databaseRef.child(index+'/'+e.target.id).push(firebase.database.ServerValue.TIMESTAMP);
    } else {
        isCorrect = false;
        this.bank[index].success = false;
        if (this.triviaAppName) this.databaseRef.child(index+'/'+e.target.id).push(firebase.database.ServerValue.TIMESTAMP);
    }
    var cat = this.currentCategory;
    var filtered = this.filteredBank(cat, false, null);
    if (filtered.length === 0) {
        $('#' + cat.replace(/ /g, '')).css('opacity', '.3');
    }
    onAnswer(isCorrect, e);
};

Trivia.prototype.shuffle = function(selector) {
    var parent = $(selector);
    var divs = parent.children();
    while (divs.length) {
        parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
    }
};

Trivia.prototype.appName = function(name) {
    this.triviaAppName = name;
    this.databaseRef = firebase.database().ref(name);
};

Trivia.prototype.finishedCategory = function(cat) {
    onCategoryFinish(cat);
};

Trivia.prototype.questionCount = function(cat) {
    if (cat) {
        return this.filteredBank(cat, null, null).length;
    } else return this.bank.length;
};

Trivia.prototype.answeredCount = function(cat) {
    if (cat) {
        return this.filteredBank(cat, true, null).length;
    } else return this.filteredBank(null, true, null).length;
};

Trivia.prototype.successCount = function(cat) {
    if (cat) {
        return this.filteredBank(cat, true, true).length;
    } else return this.filteredBank(null, true, true).length;
};

Trivia.prototype.filteredBank = function(cat, answered, success) {
    var filtered = this.bank.filter(function(obj) {
        var incat = (cat) ? obj.category == cat : true;
        var objIsAns = typeof obj.success != "undefined";
        var objIsSuccess = (objIsAns) ? obj.success : false;
        if (success !== null) return (incat && objIsAns === answered && objIsSuccess === success);
        else if (answered !== null) return (incat && objIsAns === answered);
        else return incat;
        // return incat;
    });
    return filtered;
};