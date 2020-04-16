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

var app=express()

require('./config/passport')

var routes = require('./routes/index');
var UserRoutes = require('./routes/user');

mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true});

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
app.use('/uploads', express.static('uploads'));

app.use(function(req,res,next){
    res.locals.login=req.isAuthenticated()
    next()
})
app.use('/', routes);
app.use('/user', UserRoutes);

  
app.listen(2929,()=>{
    console.log('Server Running on 2929')
})