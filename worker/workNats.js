

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