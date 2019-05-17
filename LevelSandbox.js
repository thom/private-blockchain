/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

  constructor() {
    this.db = level(chainDB);
  }

  // Get data from levelDB with key (Promise)
  async getLevelDBData(key) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.db.get(key, (err, value) => {
        if (err) reject(err);
        resolve(value);
      })
    });
  }

  // Add data to levelDB with key and value (Promise)
  async addLevelDBData(key, value) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.db.put(key, value, (err) => {
        if (err) reject(err);
        resolve(value);
      })
    });
  }

  // Method that returns the height
  async getBlocksCount() {
    let self = this;
    let count = 0;
    return new Promise((resolve, reject) => {
      self.db.createReadStream()
        .on('data',   (data)  => count++)
        .on('error',  (err)   => reject(err))
        .on('close',  ()      => resolve(count))
        .on('end',    ()      => resolve(count));
    });
  }
}

module.exports.LevelSandbox = LevelSandbox;