// WebSocket connection setup
var socket = io();
var questionRecieved=false;
													// keep count of question, used for IF condition.
var output = document.getElementById('output');				// store id="output" in output variable
output.innerHTML = "<h1 id=response> </h1>";													// ouput first question

function sendMessage() {
    var input = document.getElementById("input").value;
    socket.emit('message',input);
    document.getElementById("input").value="";
    document.getElementById("input").style.display="none";
}

//push enter key (using jquery), to run bot function.
$(document).keypress(function(e) {
  if (e.which == 13 && questionRecieved===true) {
    questionRecieved=false;
    sendMessage();// run bot function when enter key pressed
  }
});

function changeText(input){
document.getElementById('response').textContent = input;
}

socket.on('answer', function(msg) {
  console.log('Incomming answer:', msg);
  changeText(msg);
});
socket.on('question', function(msg) {
  console.log('Incomming Question:', msg);
  questionRecieved=true;
  document.getElementById("input").style.display="block";
  changeText(msg);
});

socket.on('getCal', function(msg){
  console.log('Calculating calories of: ', msg);
  var data = JSON.stringify({
  "query": msg
  });

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      document.getElementById('response').textContent = this.responseText;
    }
  });

  xhr.open("POST", "https://trackapi.nutritionix.com/v2/natural/nutrients");
  xhr.setRequestHeader("x-app-id", "1846ade2");
  xhr.setRequestHeader("x-app-key", "6bebdaeadb6c251a37c2d99d307b241e");
  xhr.setRequestHeader("x-remote-user-id", "0");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("access-control-allow-credentials", "true");
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.setRequestHeader("postman-token", "7e4b8984-f55d-1f54-5f85-13cd01c35a01");

  xhr.send(data);
  
});

socket.on('dinner', function(msg) {
  console.log('Changeing backgroundColor to:', msg);
  document.body.style.backgroundImage = "url('https://previews.123rf.com/images/279photo/279photo1705/279photo170502567/79177451-organic-fruits-and-vegetables-for-healthy-dinner-on-white-background-top-view-mock-up.jpg')";
});

socket.on('changeBG', function(msg) {
  console.log('Changeing backgroundColor to:', msg);
  document.body.style.backgroundColor = msg;
});

socket.on('changeFont', function(msg) {
  console.log('Changeing Font to:', msg);
  var h1 = document.getElementById('response');
  h1.style.color = 'white';


  //document.body.style.backgroundColor = msg;
});
socket.on('connect',function(){// We let the server know that we are up and running also from the client side;
  socket.emit('loaded');
});
