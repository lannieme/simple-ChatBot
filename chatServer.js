/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  // var meal = 'breakfast';
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hi there, I am \"Fitty\", your personal nutritionist. I can help you to find balanced meals."); //We start with the introduction;
  setTimeout(timedQuestion, 5500, socket,"Before we start, what do you want me to call you?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);  // run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});


//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum,meal) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;
  var age;
  var gender;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer= 'Hello ' + input + '.  Nice to meet you!';// output response
    waitTime =2000;
    question = 'Would you like to know your daily calorie limit?(Yes/No)';            // load next question
  }//end of Q0
  else if (questionNum == 1) {
    if(input.toLowerCase() == 'yes'|| input===1){
      answer= 'Cool. To estimate your daily calorie limit I need some more personal details. ';// output response
      waitTime =3500;
      question = 'How old are you?';           // load next question
    }
    else if (input.toLowerCase() == 'no'|| input===0){
      answer= 'Anyway, let me get to know you more to provide personal recommendations. ';// output response
      waitTime =3000;
      question = 'How old are you?';           // load next question
    }
  }//end of Q1
  else if (questionNum == 2) {
    if(Number(input) <22 ){
      age = Number(input);
      answer= 'Cool. You are very young. You need balanced nutrients.';// output response
      waitTime =1000;
      question = 'Are you a male or female?';           // load next question
    }
    else if(Number(input) >=22 ){
      age = Number(input);
      answer= 'Cool. You are at your golden age.';// output response
      waitTime =2000;
      question = 'Are you a male or female?';           // load next question
    }
    else {
      answer=' ';
      question='I did not understand you. Can you please answer with a number?';
      questionNum--;
      waitTime = 10;
    }
  } //end of Q2

  else if (questionNum == 3) {
    if(input.toLowerCase()==='male'){
      gender = 'male';
      answer= ' As an adult man, you need around 2500kcal a day to maintain your weight.';
      waitTime =4000;
      question = 'Ok. What meal are you looking for? Breakfast, Lunch or dinner?';            // load next question
    }
    else if(input.toLowerCase()==='female'){
      gender = 'female';
      answer= ' As a lady, you need around 2000kcal a day to maintain your weight.';
      waitTime =4000;
      question = 'Ok. What meal are you looking for? Breakfast, Lunch or dinner?';            // load next question
    }
  }//end of Q3
  else if (questionNum == 4) {
    if(input.toLowerCase()==='breakfast'){
      var meal = "breakfast";
      console.log(meal);
      var breakfasts = [
        "Nut butter, banana and chia seed toast",
        "Berry and yogurt smoothie",
        "Savory oatmeal with an egg",
        "Avocado toast with egg"
      ];
      var rand = Math.floor(Math.random()*4);

      answer= ' Suggested intake for breakfast is 400Kcal for you. I would recommend you get: ' + breakfasts[rand];
      waitTime = 7000;
      question = 'Do you like the meal I suggested you?';            // load next question
    }
    else if(input.toLowerCase()==='lunch'){
      var meal = "lunch";
      var lunchs = [
        "Herbed cheese and tomato sandwich",
        "Spiced chickpea pita",
        "Caesar salmon wrap",
        "Chicken and rice stir-fry",
        "Cobb salad"
      ];
      var rand = Math.floor(Math.random()*5);
      answer= 'Suggested intake for lunch is 520Kcal for you. I would recommend you get:  ' +lunchs[rand];
      waitTime =7000;
      question = 'Do you like the meal I suggested you?';            // load next question
    }
    else if(input.toLowerCase()==='dinner'){
      var meal = "dinner";
      var dinners = [
        "Oven-baked salmon",
        "Lemon-garlic shrimp and grits",
        "Turkey meatload with sun-dried tomatoes",
        "Teriyaki hens with bok choy",
        "Zucchini enchiladas",
        "slimmed-down chicken pot pie"
      ];
      var rand = Math.floor(Math.random()*6);
      answer= 'Suggested intake for dinner is 500Kcal for you. I would recommend you get:  ' +dinners[rand];;
      waitTime =7000;
      question = 'Do you like the meal I suggested you?';            // load next question
    }
    else{
      answer=' ';
      question='I did not understand you. Can you please answer with either breakfast, lunch or dinner?';
      questionNum--;
      waitTime = 10;
    }
  }//end of Q4
  else if (questionNum == 5) {
    if(input.toLowerCase()==='yes'|| input===1){
      answer = 'Perfect! Hope you enjoy your meal. Talk to you later!';
      waitTime =1000;
      question = '';
    }
    else if(input.toLowerCase()==='no'|| input===0){
      var meals = [
        "Herbed cheese and tomato sandwich",
        "Spiced chickpea pita",
        "Caesar salmon wrap",
        "Chicken and rice stir-fry",
        "Cobb salad",
        "Nut butter, banana and chia seed toast",
        "Berry and yogurt smoothie",
        "Avocado toast with egg",
        "Oven-baked salmon",
        "Lemon-garlic shrimp and grits",
        "Turkey meatload with sun-dried tomatoes",
        "Teriyaki hens with bok choy",
        "Zucchini enchiladas",
        "slimmed-down chicken pot pie"

      ];
      var rand = Math.floor(Math.random()*14);
      answer= '';
      waitTime =50;
      question = 'How about:  ' +meals[rand] +'? Do You like it now?';           // load next question
      questionNum--;
    }else{
      answer=' ';
      question='I did not understand you. Can you please answer with simply with yes or no.';
      questionNum--;
      waitTime =10;
    }
  // load next question
  }//end of Q5
  else{
    answer= 'Hope you enjoy your meal. Talk to you later!';// output response
    waitTime =0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
