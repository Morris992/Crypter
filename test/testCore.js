var coreFunctions = require("../core"); 
var chai = require("chai"); // import chai framework

const masterPassword = "123";

/**
 * Test of all commands
 */

 //Suite test
describe("Test core functions", () => {

    //test case
    it("Encryption without master password", (done) => {

        coreFunctions.encrypt("", __dirname + "/data", __dirname + "/data").then((resEncryption)   =>  {
            chai.expect(resEncryption).to.have.property('error')

            done();
        });
    });

    //test case
    it("Encryption with master password", (done) => {

        coreFunctions.encrypt(masterPassword, __dirname + "/data", __dirname + "/data").then((resEncryption)   =>  {
            chai.expect(resEncryption).to.be.a('string');
            chai.expect(resEncryption).to.equal("encrypted!");
            chai.expect(resEncryption.error).to.equal(undefined);

            done();
        })
    });

    //test case
    it("Encryption without destination path", (done) => {

        coreFunctions.encrypt(masterPassword, __dirname + "/data").then((resEncryption)   =>  {
            chai.expect(resEncryption).to.be.a('string');
            chai.expect(resEncryption).to.equal("encrypted!");
            chai.expect(resEncryption.error).to.equal(undefined);

            done();
        })
    });

    //test case
    it("Decryption with master password", (done) => {

        coreFunctions.decrypt(masterPassword, __dirname + "/data", __dirname + "/dataDecrypted").then((resEncryption)   =>  {
            chai.expect(resEncryption).to.be.a('string');
            chai.expect(resEncryption).to.equal("decrypted!");
            chai.expect(resEncryption.error).to.equal(undefined);

            done();
        })
    })

    //test case
    it("Decryption without master password", (done) => {

        coreFunctions.decrypt("", __dirname + "/data", __dirname + "/dataDecrypted").then((resEncryption)   =>  {
            chai.expect(resEncryption).to.have.property('error')

            done();
        })
    })
});
