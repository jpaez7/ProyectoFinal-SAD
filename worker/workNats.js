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