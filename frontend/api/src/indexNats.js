
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

// Rutas de autenticación
app.get('/login',
passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/login' }),
(req, res) => {
  // Autenticación exitosa, redirecciona o responde según sea necesario
  res.send('Autenticación exitosa');
}
);

app.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get('/petition', 
function(request, response){
  if(request.user){
    var resp= JSON.parse(JSON.stringify(request.query));     // your JSON
    for (const property in fields) {
      //Se comprueba el formato de la petición
      if(!resp.hasOwnProperty(fields[property])){
        response.send("ERROR en el formato de la petición: No se ha encontrado el campo "+fields[property]); 
        return
      }
    }

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

app.get('/result/',
   (req, res) => {
    if(req.user){
      if(petitionDict.hasOwnProperty(req.query.id)){
        fs.access('./result/'+req.query.id, (error) => {
          //  Si no se encuentra el archivo , la petición se sigue procesando
          if (error) {
          
          res.json(
            {
              "ERROR": "LA PETICIÓN SE SIGUE PROCESANDO"
            }
          );
          return;
          }
          //enviar el resultado de la petición
          fs.createReadStream('./result/'+req.query.id).pipe(res);
          setTimeout(deletePetition, 30*60*1000, req.query.id)
        }); 
      }
      else{
        res.json({"ERROR": "NO HAY PETICIÓN CON ESE ID"})
      }  

    } else{
      res.json({"ERROR": "No se ha iniciado sesión"})
    }
   
  })

function deletePetition(id){
    console.log("FILE REMOVED "+id)
    delete petitionDict[id];
    fs.unlink('./result/'+id, (error) => {
      if (error) {
      console.log(error);
      return;
      }
    });	
  }

// to create a connection to a nats-server:
 async function sendMessage  (petition) {
	const nc = await connect({ servers: [process.env.NATSIPADDR] });
	// create a codec
// create a simple subscriber and iterate over messages
// matching the subscription

	nc.publish(pettopic, JSON.stringify(petition));
    
	console.log("Publish");

 } 
 
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Nuestro primer WS Get
/*app.get('/', (req, res) => {
  res.json(
    {
      "Title": "API REST DE PETICIONES"
    }
  );
})*);*/

app.get('/', (req, res) => {
  // Respuesta HTML con un botón de inicio de sesión
  const htmlResponse = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>API de Proyecto SAD</title>
          <style>
              .boton {
                  display: inline-block;
                  padding: 10px 20px;
                  font-size: 16px;
                  text-align: center;
                  text-decoration: none;
                  cursor: pointer;
                  border: 1px solid #3498db;
                  color: #3498db;
                  background-color: #ffffff;
                  border-radius: 5px;
              }

              .boton:hover {
                  background-color: #3498db;
                  color: #ffffff;
              }
          </style>
      </head>
      <body>
          <h1>Arranque API</h1>
          <a href="http://localhost:3000/login" class="boton">Iniciar sesión</a>
      </body>
      </html>
  `;
  
  res.send(htmlResponse);
});

app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`);
  //consume();
});