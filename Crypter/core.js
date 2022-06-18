const folderEncrypt = require("folder-encrypt") // library for encrypt/decrypt folders
const signale = require('signale'); //library to insert status report

/**
 * Encrypt data
 * @param {*} secretKey -> password to encrypt
 * @param {*} originPath -> original path to file/folder to encrypt
 * @param {*} destinationPath -> destination path to file/folder encrypted
 * @returns 
 */
function encrypt(secretKey, originPath, destinationPath) {
    return new Promise(async (resolve) => {

        signale.info("Waiting...");

        //if not passed chiper property, on default will be crypter at sha256
        const options = {
            password: secretKey,
            input: originPath
        }
        if(destinationPath)    {
            options["output"] = destinationPath + '.encrypted' // optional, default will be input path with extension `encrypted`
        }

        folderEncrypt.encrypt(options).then(() => {
            resolve('encrypted!');
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
        signale.info("Waiting...");

        const options = {
            password: secretKey,
            input: originPath + ".encrypted"
        }
        if(destinationPath)    {
            options["output"] = destinationPath // optional, default will be input path with extension `encrypted`
        }

        folderEncrypt.decrypt(options).then(() => {
            resolve('decrypted!');
        }).catch((err) => {
            resolve({ error: err });
        });
    })
    
}

module.exports =    {
    encrypt: encrypt,
    decrypt: decrypt
}