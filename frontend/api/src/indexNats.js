 //Se asigna un identificador aleatorio a la petición, este será el id de consulta y se devuelve al usuario
 id = randomUUID()
 petitionDict[id] = true;
   resp.key = id;
 sendMessage(resp);
 const mensaje = `Se ha añadido la petición a la cola con id: <a href="http://localhost:3000/result?id=${id}">${id}</a>`;
 response.send(mensaje);


}else{
 response.send("ERROR: No se ha iniciado sesión");
}

});


app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Nuestro primer WS Get
app.get('/', (req, res) => {    
res.json(
   {
       "Title": "API REST DE PETICIONES"
   }
);
})

app.listen(app.get('port'),()=>{
console.log(`Server listening on port ${app.get('port')}`);
//consume();
});