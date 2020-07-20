var express=require('express')
var bodyParser=require('body-parser')
var expressHbs = require('express-handlebars');
var mongoose=require('mongoose')
var session=require('express-session')
var cookieParser=require('cookie-parser')
var passport=require('passport')
var flash=require('connect-flash')
var validator=require('express-validator')
var path = require('path');
var helpers = require('handlebars-helpers')();

var port=process.env.PORT||2929
var app=express()

require('./config/passport')

var routes = require('./routes/index');
var UserRoutes = require('./routes/user');
var favicon = require('serve-favicon');

//mongoose.connect(process.env.MONGODB_URI||'mongodb+srv://nikitakapoor1919:1998Nikita1998@cluster0.ibwts.mongodb.net/blog?retryWrites=true&w=majority', {useNewUrlParser: true,useUnifiedTopology:true});
var uri = "mongodb+srv://nikitakapoor1919:1998Nikita1998@cluster0.ibwts.mongodb.net/blog?retryWrites=true&w=majority"

mongoose.connect(uri, {useNewUrlParser: true});
var db = mongoose.connection;

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(validator())
app.use(cookieParser())
app.use(session({secret:'mylongsecret!!!12345',
resave:false,
saveUninitialized:false,
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public','images', 'favicon.ico')));
app.use('/uploads', express.static('uploads'));

app.use(function(req,res,next){
    res.locals.login=req.isAuthenticated()
    next()
})
app.use('/', routes);
app.use('/user', UserRoutes);

if(process.env.NODE_ENV==='production'){
    app.use(express.static('build'))
}

app.listen(port,()=>{
    console.log(`Server Running on ${port}`)
})