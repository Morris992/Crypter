const inquirer = require('inquirer'); //library for use interavtive commands
const signale = require('signale'); //library to insert status report
const core = require("./core");
const CFonts = require('cfonts');

const ENCRYPT = "E";
const DECRYPT = "D";
require('events').EventEmitter.defaultMaxListeners = 99999999;

showLogo();
start();

function start() {

    //Ask username and password for MongoDB
    inquirer.prompt([
        {
            type: 'list',
            message: 'Scegli se vuoi criptare o decriptare i tuoi dati. Ctrl+C per uscire',
            name: 'mode',
            default: 'E',
            choices: [
                {
                    name: "Cripta",
                    value: "E",
                },
                {
                    name: "Decripta",
                    value: "D",
                }
            ]
        }
    ])
        .then(async answer1 => { // answer contain username and password property ( name property of question )

            //Get mode (encrypt/decrypt)
            const mode = answer1.mode.toUpperCase();
            let msg = "";

            if (mode === ENCRYPT) {
                msg = "Inserisci il percorso della cartella nella quale si trova la cartella che vuoi criptare. Ctrl+c per uscire";
            } else {
                msg = "Inserisci il percorso della cartella nella quale si trova il file che vuoi decriptare. Ctrl+c per uscire";
            }

            inquirer.prompt([
                {
                    // parameters
                    type: "input",
                    name: "originPath",
                    message: msg // question
                }
            ])
                .then(async answer2 => {

                    //Get origin path to encrypt/decrypt
                    let originPath = answer2.originPath;

                    //Ask list of directories or files
                    const nameFinalDir = await core.askListDirectory(originPath, mode);

                    originPath += "/" + nameFinalDir;

                    let msgDestinationPath = "";
                    let msgPassword = "";

                    if (mode === ENCRYPT) {
                        msgDestinationPath = "Inserisci il percorso di destinazione dove vuoi che venga criptato il contenuto della cartella scelta. E' necessario indicare come ultima parte del percorso, il nome del file che dovrà avere. Ctrl+c per uscire";
                        msgPassword = "Inserisci la password per criptare i tuoi dati. Ctrl+c per uscire";
                    } else {
                        msgDestinationPath = "Inserisci il percorso di destinazione dove vuoi che venga criptato il contenuto della cartella scelta. Dovrai specificare anche il nome della cartella che dovrà creare altrimenti andrà a decriptare tutto il contenuto nel percorso specificato.";
                        msgPassword = "Inserisci la password per decriptare i tuoi dati. Ctrl+c per uscire";

                    }

                    //Ask username and password for MongoDB
                    inquirer.prompt([
                        {
                            // parameters
                            type: "input",
                            name: "destinationPath",
                            message: msgDestinationPath // question
                        },
                        {
                            // parameters
                            type: "password",
                            name: "password",
                            message: msgPassword // question
                        }
                    ])
                        .then(async answer3 => {

                            //Get destination path to encrypt/decrypt
                            const destinationPath = answer3.destinationPath;

                            //Get master password
                            const secretKey = answer3.password;

                            if (originPath && secretKey && mode) {

                                //If you want to encrypt
                                if (mode === ENCRYPT) {

                                    const res = await core.encrypt(secretKey, originPath, destinationPath);

                                    if (res.error) {
                                        signale.error(res.error);
                                    } else {
                                        signale.success(res);
                                    }

                                    start();
                                    //If you want to decrypt
                                } else if (mode === DECRYPT) {

                                    const res = await core.decrypt(secretKey, originPath, destinationPath)

                                    if (res.error) {
                                        signale.error(res.error);
                                    } else {
                                        signale.success(res);
                                    }
                                    start();
                                } else {
                                    signale.error("Questa modalità non esiste.");
                                    start();
                                }

                            } else {
                                signale.error("Inserisci tutti i dati richiesti.");
                                start();
                            }
                        })
                })
        });
}

/**
 * Show logo
 */
function showLogo() {

    //Print welcome message
    CFonts.say('Crypter!', {
        font: '',              // define the font face
        align: 'center',              // define text alignment
        colors: ['#f00', 'gray'],         // define all colors
        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1,           // define letter spacing
        lineHeight: 1,              // define the line height
        space: true,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '0',             // define how many character can be on one line
        gradient: false,            // define your two gradient colors
        independentGradient: false, // define if you want to recalculate the gradient for each new line
        transitionGradient: false,  // define if this is a transition between colors directly
        env: 'node'                 // define the environment CFonts is being executed in
    });
}