/* ===== Executable Test ==================================
|  Use this file to test your project.
|  =========================================================*/

if (process.argv.length === 2) {
  console.error('Expected at least one argument!');
  process.exit(1);
}

let INIT = false;
if (process.argv[2] && process.argv[2] === '-i') {
  console.log("Initializing...");
  INIT = true;
}
else {
  console.log("Testing...");
  INIT = false;
}

const Blockchain = require('./Blockchain.js');
const Block = require('./Block.js');

let myBlockchain = new Blockchain.Blockchain();

setTimeout(function () {
	console.log("Waiting...")
}, 100);

if (INIT) {
  /******************************************
   ** Function for Create Tests Blocks   ****
  ******************************************/
  (function theLoop (i) {
    setTimeout(function () {
      let blockTest = new Block.Block("Test Block - " + (i + 1));
      // Be careful this only will work if your method 'addBlock' in the Blockchain.js file return a Promise
      myBlockchain.addBlock(blockTest).then((result) => {
        console.log(result);
        i++;
        if (i < 10) theLoop(i);
      });
    }, 100);
  })(0);
}
else {
  /***********************************************
   ** Function to get the Height of the Chain ****
  ***********************************************/

  // Be careful this only will work if `getBlockHeight` method in Blockchain.js file return a Promise
  myBlockchain.getBlockHeight().then((height) => {
    console.log("getBlockHeight(): " + height);
  }).catch((err) => { console.log(err); });

  /***********************************************
   ******** Function to Get a Block  *************
  ***********************************************/

  // Be careful this only will work if `getBlock` method in Blockchain.js file return a Promise
  myBlockchain.getBlock(0).then((block) => {
    console.log("getBlock(0): " + JSON.stringify(block));
  }).catch((err) => { console.log(err); });

  /***********************************************
   ***************** Validate Block  *************
  ***********************************************/

  // Be careful this only will work if `validateBlock` method in Blockchain.js file return a Promise
  myBlockchain.validateBlock(0).then((valid) => {
    console.log("validateBlock(0): " + valid);
  })
  .catch((error) => {
    console.log(error);
  });

  // Tampering a Block this is only for the purpose of testing the validation methods
  myBlockchain.getBlock(5).then((block) => {
    let blockAux = block;
    blockAux.body = "Tampered Block";
    myBlockchain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
      if(blockModified){
        myBlockchain.validateBlock(blockAux.height).then((valid) => {
          console.log(`Block #${blockAux.height}, is valid? = ${valid}`);
        })
        .catch((error) => {
          console.log(error);
        })
      } else {
        console.log("The Block wasn't modified");
      }
    }).catch((err) => { console.log(err);});
  }).catch((err) => { console.log(err);});

  myBlockchain.getBlock(6).then((block) => {
    let blockAux = block;
    blockAux.previousBlockHash = "jndininuud94j9i3j49dij9ijij39idj9oi";
    myBlockchain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
      if(blockModified){
        console.log("The Block was modified");
      } else {
        console.log("The Block wasn't modified");
      }
    }).catch((err) => { console.log(err); });
  }).catch((err) => { console.log(err); });

  /***********************************************
   ***************** Validate Chain  *************
  ***********************************************/

  // Be careful this only will work if `validateChain` method in Blockchain.js file return a Promise
  myBlockchain.validateChain().then((errorLog) => {
    if(errorLog.length > 0){
      console.log("The chain is not valid:");
      errorLog.forEach(error => {
        console.log(error);
      });
    } else {
      console.log("No errors found, the chain is valid!");
    }
  })
  .catch((error) => {
    console.log(error);
  });
}