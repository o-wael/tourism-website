var express = require('express');
var path = require('path');
var app = express();
var alert = require('alert');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;

module.exports = app;
app.listen(3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({resave: true, saveUninitialized: true, secret: 'anyrandomstring'}));

//functions:
function wanttogoPoster(user, destination){

  MongoClient.connect("mongodb://127.0.0.1:27017/myDB", function (err, client) {
    if(err) throw err;
    var db = client.db('myDB');
    var flag = false;
    var index = 0;
    db.collection('myCollection').find().toArray(function(err, results){
      if(err) throw err;
      for(var i=0; i<results.length; i++){

        if(results[i].username.localeCompare(user) == 0){
          flag = true;
          index = i;
          break;
        }
      }
      
      if(flag == true){
        var tmp = [] ;
        for(var i=0 ; i<results[index].wanttogo.length ; i++){
          tmp = tmp.concat([results[index].wanttogo[i]]) ;
        }
        if(!tmp.includes(destination)){
          tmp = tmp.concat([destination]);
          db.collection('myCollection').updateOne({username: user},{ $set: { wanttogo: tmp } });
        }
        else{
          alert('Destination is already in your want-to-go list!');
        }

        //db.collection('FirstCollection').updateOne({username: user},{ $set: { wanttogo: tmp } });
        
      }
    });                
  });
}

// app gets:
app.get('/', function(req,res) {
  res.render('login')
});

app.get('/home', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('home')
});

app.get('/islands', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('islands')
});

app.get('/cities', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('cities')
});

app.get('/hiking', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('hiking')
});

app.get('/wanttogo', function(req, res){

  if(req.session.username == undefined)
    res.redirect('login')
  else{

    var x = req.session.username ;

    if(x === 'admin'){
      res.render('wanttogo', {list: [] });
    }
    else{
      MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client) {
        if(err) throw err;
        var db = client.db('myDB');
        db.collection('myCollection').find().toArray(function(err, results){
          if(err) throw err;
          for(var i=0; i<results.length; i++){
            if(results[i].username.localeCompare(x) == 0 ){
              res.render('wanttogo', {list: results[i].wanttogo})
              break;
            }
          }
        });
      });
    }
  }
});

app.get('/santorini', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('santorini')
});

app.get('/bali', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('bali')
});

app.get('/annapurna', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('annapurna')
});

app.get('/inca', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('inca')
});

app.get('/paris', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('paris')
});

app.get('/registration', function(req, res){
  res.render('registration')
});

app.get('/rome', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('rome')
});

app.get('/searchresults', function(req, res){
  if(req.session.username == undefined)
    res.redirect('login')
  else
    res.render('searchresults')
});

//app posts:
app.post('/', function(req, res){
  var x = req.body.username;
  var y = req.body.password;
  req.session.username = x;
  if (x === 'admin' && y === 'admin') {
    res.redirect('home');
  }
  else {
    MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client) {
      if(err) throw err;
      var db = client.db('myDB');
      var flag = false;
      db.collection('myCollection').find().toArray(function(err, results){
        if(err) throw err;
        for(var i=0; i<results.length; i++){

          if(results[i].username.localeCompare(x) == 0 && results[i].password.localeCompare(y) == 0){
            flag = true;
            break;
          }
        }

        if(flag == true){
          res.redirect('home');
        } 
        else{
          alert("Incorrect Username or Password. Please Try Again!");
          res.redirect('/');
        }

      });

    });
  }
});

app.post('/register', function(req, res){
  var x = req.body.username;
  var y = req.body.password;
  var z = new Array;

  MongoClient.connect("mongodb://127.0.0.1:27017", function (err,client) {
    if(err) throw err;
    var db = client.db('myDB');
    var flag = true;
    db.collection('myCollection').find().toArray(function(err, results){
      if(err) throw err;
      if(x=="" || y==""){
        alert('Cannot Enter Empty Username or Password!');
        res.redirect('/registration');
      }
      else{
        for(var i=0; i<results.length; i++){
          
          if(results[i].username.localeCompare(x) == 0){
            flag = false;
            break;
          }
        }
      
        if(flag == true){
          db.collection('myCollection').insertOne({ username: x, password: y, wanttogo: z});
          alert('Regestration Successful :D');
          res.redirect('/');
        } 
        else{
          alert('Username already exists. Please enter another one!');
          res.redirect('/registration');
        }
      }

    });
    
    
  });
  
});

app.post('/wanttogoannapurna', function(req, res){ 
  wanttogoPoster(req.session.username, "Annapurna");
  res.redirect('annapurna');
});

app.post('/wanttogobali', function(req, res){ 
  wanttogoPoster(req.session.username, "Bali");
  res.redirect('bali');
});

app.post('/wanttogoinca', function(req, res){ 
  wanttogoPoster(req.session.username, "Inca");
  res.redirect('inca');
});

app.post('/wanttogoparis', function(req, res){ 
  wanttogoPoster(req.session.username, "Paris");
  res.redirect('paris');
});

app.post('/wanttogorome', function(req, res){ 
  wanttogoPoster(req.session.username, "Rome");
  res.redirect('rome');
});

app.post('/wanttogosantorini', function(req, res){ 
  wanttogoPoster(req.session.username, "Santorini");
  res.redirect('santorini');
});

app.post('/search', function(req, res){
  var x = req.body.Search ;
  x = x.toLowerCase() ;
  var arr = ["annapurna circuit", "bali island", "inca trail to machu picchu", "paris", "rome", "santorini island"];
  var tmp = [];
  for(var i = 0; i < arr.length; i++){
    if(arr[i].includes(x))
      tmp = tmp.concat([arr[i]]);
  }
  
  for(var j = 0; j < tmp.length; j++){
    const words = tmp[j].split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    tmp[j] = words.join(" ");
  }

  res.render('searchresults', {list: tmp}) ;
});