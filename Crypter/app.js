const inquirer = require('inquirer'); //library for use interavtive commands
const signale = require('signale'); //library to insert status report
const core = require("./core");
const CFonts = require('cfonts');

const ENCRYPT = "E";
const DECRYPT = "D";

showLogo();
start();

function start() {

    //Ask username and password for MongoDB
    inquirer.prompt([
        {
            type: 'list',
            message: 'Choose if you want to encrypt or decrypt your data. Ctrl+C to exit',
            name: 'mode',
            default: 'E',
            choices: [
                {
                    name: "Encrypt",
                    value: "E",
                },
                {
                    name: "Decrypt",
                    value: "D",
                }
            ]
        },
        {
            // parameters
            type: "input",
            name: "originPath",
            message: "Insert origin path - Ctrl+c to exit" // question
        },
        {
            // parameters
            type: "input",
            name: "destinationPath",
            message: "Insert destination path - Ctrl+c to exit" // question
        },
        {
            // parameters
            type: "password",
            name: "password",
            message: "Insert password - Ctrl+c to exit" // question
        }
    ])
        .then(async answer => { // answer contain username and password property ( name property of question )

            //Get origin path to encrypt/decrypt
            const originPath = answer.originPath;

            //Get destination path to encrypt/decrypt
            const destinationPath = answer.destinationPath;

            //Get master password
            const secretKey = answer.password;

            //Get mode (encrypt/decrypt)
            const mode = answer.mode.toUpperCase();

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
                    signale.error("This mode not exist");
                    start();
                }
            } else {
                signale.error("Please insert all data");
                start();
            }
        });
}

/**
 * Show logo
 */
function showLogo() {
    
    //Print welcome message
    CFonts.say('Crypter!', {
        font: '3d',              // define the font face
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