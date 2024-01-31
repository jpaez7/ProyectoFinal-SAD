
const { connect, StringCodec } = require("nats");
var fs = require("fs");
var shell = require("shelljs");

//const nc = await connect({ servers: [process.env.NATSIPADDR] });
var nc;
const pettopic = "petition-topic";
const restopic = "result-topic";
const sc = StringCodec();

var petition;

/**
 * Enviar el error que ha detenido la ejecución de la petición.
 * @param {number} uuid El identificador de la petición a responder.
 * @param {string} text El error que se ha obtenido.
 */

function downloadRepo() {
  if (petition.hasOwnProperty("token")) {
    if (shell.exec('git clone ' + petition.url.replace('https://', 'https://' + petition.token + '@') + ' dir', { silent: true }).code !== 0) {
      throw new Error('El repositorio no existe o token sin acceso al repositorio');
    }
  } else {
    if (shell.exec('git clone ' + petition.url + ' dir', { silent: true }).code !== 0) {
      throw new Error('El repositorio no existe o es privado');
    }
  }

  codeExecution();
}

function codeExecution() {
  if (petition.file.toString().includes(".js")) {
    shell.exec("cd dir && npm install", { silent: true });
    execution = shell.exec("node ./dir" + petition.path + "/" + petition.file + " " + petition.arguments, { silent: true });
    if (execution.code !== 0) {
      throw new Error(execution.stderr);
    }
  } else if (petition.file.toString().includes(".py")) {
    shell.exec("cd dir && pip install -r requirements.txt", { silent: true });
    execution = shell.exec("python3 ./dir" + petition.path + "/" + petition.file + " " + petition.arguments, { silent: true });
    if (execution.code !== 0) {
      throw new Error(execution.stderr);
    }
  } else {
    throw new Error('Tipo de fichero no soportado');
  }
}

async function sendOutput  (petition, result) {
  var output = {}
  output.key = petition.key;
  output.result = result;
	const nc = await connect({ servers: [process.env.NATSIPADDR] });
	// create a codec
// crear un suscritor simple e iterar sobre los mensaje
// matching the subscription

	nc.publish(restopic, JSON.stringify(output));
    
	//nc.publish("petition-topic", sc.encode("again"));
	console.log("Publish");

 } 