var PORT=process.env.PORT||8083;
var express = require('express');
var app = express();
const path = require('path');
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
var url = require('url');
const jwt = require("jsonwebtoken");
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views')); 
app.use(cookieParser())
const low = require('lowdb');
app.set('view engine', 'ejs');
const FileSync = require('lowdb/adapters/FileSync');
const { Console } = require('console');
const adapter = new FileSync(__dirname+'/db.json');
const db = low(adapter);
db.defaults({ posts: [], user: []})
  .write();
function getalldt(){
  return db.get('posts').value();
}
var dataall=getalldt();
function getvl(k){
  for(x in dataall){
    if(dataall[x]['param']==k){
      return dataall[x];
    }
  }
}
function getid(k){
  for(x in dataall){
    if(dataall[x]['id']==k){
      return dataall[x];
    }
  }
}
function checkToken (req, res, next) {
    const authcookie = req.cookies.authcookieif
    jwt.verify(authcookie,"iframe",(err,data)=>{
    if(err){
      res.render('404');
    } 
    else if(data.user){
      req.user = data.user
      next()
    }
})};
app.get('/:pram*', function (req, res,next) {
  let website = req.protocol + '://' + req.get('host') + req.originalUrl; 
  let parse = url.parse(website, true);
  let wp=parse.search;
  let s3="";
  if(wp){
    s3=wp;
  }
      let dl=getvl(req.params.pram);
      if(typeof dl ==="undefined"){
        next();
      }else{
        let ifr=dl.urliframe;
        let name=dl.name;
        let s2=req.params[0];
        res.render('iframe',{ifr,name,s2,s3});
      }
});


app.get('/register', function(req, res) {
    let error=[];
    res.render('register',{error});
});
app.get('/password', function(req, res) {
  let error=[];
  res.render('password',{error});
});
app.post('/password', async function(req, res) {
  let error=[];
    let isPasswordMatch=false;
   
    let ifus=db.get('user').find({username: req.body["username"]}).value();
    if(typeof ifus !="undefined"){
      isPasswordMatch = await bcrypt.compare(req.body["oldpass"], ifus.password)
    }else{
      error.push('Username exists!');
      rser()
    }
    if(!isPasswordMatch){
      error.push('Wrong old password!')
      rser()
    }
    if(req.body["newpass"]!=req.body["newpasss"]){
      error.push("The new password doesn't match!");
      rser()
    }
    function rser(){
      res.render('password',{error});
    }
    let pws=await bcrypt.hash(req.body["newpass"], 8)
    let username=req.body["username"];
    if(error.length==0){
      db.get('user')
      .find({'username':username})
      .assign({'password':pws})
      .write();
      res.cookie('authcookieif',"token",{maxAge:0,httpOnly:true}) 
      res.redirect("login")
    }
});
app.post('/register', async function(req, res) {
    let error=[];
    let pws=await bcrypt.hash(req.body["psw"], 8)
    let username=req.body["username"];

    let ttus = db
    .get('user')
    .find({ username: username })
    .value();
    if(typeof ttus=="undefined"){
      let user={
        "username":username,
        "password":pws
      }
      db.get('user')
      .push(user)
      .write();
      res.redirect('login');
    }else{
      error.push("Username exists!");
      res.render('register',{error});
    }
  });

app.get('/login', function(req, res) {
    let error=[];
    res.render('login',{error});
});
app.post('/login',async function(req, res) {
    let error=[];
    let isPasswordMatch=false;
    let ifus=db.get('user').find({username: req.body["username"]}).value();
    if(typeof ifus !="undefined"){
      isPasswordMatch = await bcrypt.compare(req.body["psw"], ifus.password)
    }
    let username = req.body.username;
    if(isPasswordMatch){
      const token = jwt.sign({user:username},'iframe')
      res.cookie('authcookieif',token,{maxAge:86400000,httpOnly:true}) 
      res.redirect("manage")
    }else{
      error.push("Username or password is incorrect !")
      res.render("login",{error})
    }
  });
  app.get('/user/:us', function (req, res) {
    let us=req.params.us;
    let resu= db.get('user')
    .remove({username:us})
    .write()
    if(resu.length>0){
      res.json("success")
    }else{
      res.json("no success")
    }
   });
  app.all('*', checkToken);
  app.post('/api/insert',function(req,res){
    let dt=req.body;
    dt.param=dt.param.toLowerCase();
    let ck=getvl(dt.param);
   if(typeof ck==="undefined"){
    db.get('posts').push(dt)
    .write();
    res.json({"status":"success"})
   }else{
    res.json({"status":"duplicate","id":dt.id})
   }
   
  });
  app.put('/api/update/:id',function(req,res){
    let prid=req.params.id;
    let dt=req.body;
    dt.param=dt.param.toLowerCase();
    let id={"id":prid};
    let ck=getvl(dt.param);
    let ifold=getid(prid);
    if(typeof ck==="undefined" ||ck.id==prid ){
      db.get('posts')
      .find(id)
      .assign(dt)
      .write();
      res.json({"status":"success"})
    }else{
      res.json({"status":"duplicate","ifold":ifold})
    }
   
  });
  app.delete('/api/delete/:id',function(req,res){
    let idpr=req.params.id;
    db.get('posts')
      .remove({id:idpr})
      .write()
  res.json({"status":"success"})
  });
app.get('/logout', function (req, res) {
    res.cookie('authcookieif',"token",{maxAge:0,httpOnly:true}) 
    res.redirect("login")
});
app.get('/manage' ,function(req, res) {
    let dtall=db.get('posts').value();
    let user=req.user;
    res.render('manage',{dtall,user});
});
app.get('*', function(req, res){
  res.render('404');
});
var server = app.listen(PORT, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Ung dung Node.js dang hoat dong tai dia chi: http://%s:%s", host, port)
  });
  server.keepAliveTimeout=60000;
