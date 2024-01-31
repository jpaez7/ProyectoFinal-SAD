
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Configura la estrategia de autenticación de Google OAuth2
app.use(require('express-session')({ 
    secret: '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', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

passport.use(new GoogleStrategy({
    clientID: '160606129404-pboj2bcrgs7ghrc5uipcuueecjpfbni8.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Aquí puedes realizar acciones con el perfil del usuario
    return done(null, profile);
  }
));

const consume = async () => {
  nc = await connect({ servers: [process.env.NATSIPADDR] })
  const sub = nc.subscribe(restopic);
  (async () => {
    for await (const msg of sub) {
     message = JSON.parse(msg.data);
     
     fs.writeFile("./result/"+message.key, message.result, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
      }); 	
  }
  })();
};

consume();

//Se asigna un identificador aleatorio a la petición, este será el id de consulta y se devuelve al usuario
id = randomUUID()
petitionDict[id] = true;
resp.key = id;
sendMessage(resp);
const mensaje = `Se ha añadido la petición a la cola con id: <a href="http://localhost:3000/result?id=${id}">${id}</a>`;
response.send(mensaje);


}else {
  response.send("ERROR: No se ha iniciado sesión");
}

});


app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Nuestro primer WS Get
app.get('/', (req, res) => {
  res.json(
    {
      "Title": "API REST DE PETICIONES"
    }
  );
})

app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`);
  //consume();
});