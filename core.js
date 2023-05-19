const folderEncrypt = require("folder-encrypt") // library for encrypt/decrypt folders
const signale = require('signale'); //library to insert status report
const inquirer = require('inquirer'); //library for use interavtive commands
const fs = require('fs');

const ENCRYPT = "E";

/**
 * Encrypt data
 * @param {*} secretKey -> password to encrypt
 * @param {*} originPath -> original path to file/folder to encrypt
 * @param {*} destinationPath -> destination path to file/folder encrypted
 * @returns 
 */
function encrypt(secretKey, originPath, destinationPath) {
    return new Promise(async (resolve) => {

        signale.info("Attendi...");

        //if not passed chiper property, on default will be crypter at sha256
        const options = {
            password: secretKey,
            input: originPath
        }
        if(destinationPath)    {
            options["output"] = destinationPath + '.encrypted' // optional, default will be input path with extension `encrypted`
        }

        folderEncrypt.encrypt(options).then(() => {
            resolve('Contenuto criptato correttamente!');
        }).catch((err) => {
            resolve({ error: err });
        });
    })
}

/**
 * Decrypt data
 * @param {*} secretKey -> password to encrypt
 * @param {*} originPath -> original path to file/folder to encrypt
 * @param {*} destinationPath -> destination path to file/folder encrypted
 * @returns
 */
function decrypt(secretKey, originPath, destinationPath) {
    return new Promise(async (resolve) => {
        signale.info("Attendi...");

        const options = {
            password: secretKey,
            input: originPath
        }
        if(destinationPath)    {
            options["output"] = destinationPath // optional, default will be input path with extension `encrypted`
        }

        folderEncrypt.decrypt(options).then(() => {
            resolve('File decriptato correttamente!');
        }).catch((err) => {

            let error = "";
            if (err.message.indexOf("Invalid tar header") != -1) {
                error = "La password non è corretta!";
            } else {
                error = err;
            }
            resolve({ error: error });
        }).catch((error) => {
            resolve({ error: error });
        });
    })
    
}

/**
 * Get the content of dir and ask the selected one
 * @param {any} dir -> directory path
 * @param {any} mode -> mode: entrypt or decript
 */
function askListDirectory(dir, mode) {
    return new Promise(async (resolve) => {

        // list all files in the directory
        try {

            let msg = "";
            if (mode === ENCRYPT) {
                msg = "Seleziona la cartella da criptare. Ctrl+C per uscire";
            } else {
                msg = "Seleziona il file da decriptare. Ctrl+C per uscire";
            }
            const files = fs.readdirSync(dir);
            let choices = [];

            files.forEach(file => {

                if (mode === ENCRYPT) {
                    if (file.indexOf(".") == -1) {

                        choices.push({ "name": file, "value": file });
                    }
                } else {
                    if (file.indexOf(".encrypted") !== -1) {

                        choices.push({ "name": file, "value": file });
                    }
                }
                
            })

            inquirer.prompt([
                {
                    type: 'list',
                    message: msg,
                    name: 'nameFile',
                    choices: choices
                }
            ]).then(async answer => {

                const nameFile = answer.nameFile;

                resolve(nameFile);


            })

        } catch (err) {
            console.log(err);
        }
    })
}


module.exports =    {
    encrypt: encrypt,
    decrypt: decrypt,
    askListDirectory: askListDirectory
}