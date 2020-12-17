// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const fs = require('fs');
const path = require('path');
const { dialog } = require('electron').remote;
const copydir = require('copy-dir');
const dirsum = require('./src/dirsum');

// https://lodash.com/docs#isEqual
// // Cherry-pick methods for smaller browserify/rollup/webpack bundles.
const isEqual = require('lodash/isEqual');

const HASING_ALGORITHM = 'md5';

const addSourceBtbnEl = document.getElementById('addSourceBtbn');
const sourcePathEl = document.getElementById('sourcePath');
const addDestinationBtbnEl = document.getElementById('addDestinationBtbn');
const destionationPathEl = document.getElementById('destionationPath');
const cloneBtnEl = document.getElementById('cloneBtn');
const statusEl = document.getElementById('status');

addSourceBtbnEl.onclick = () => {
  resetStatus();
  const fileName = dialog.showOpenDialogSync({
    properties: ['openDirectory'],
  });

  if (fileName !== undefined) {
    console.group('fileName', fileName);
    sourcePathEl.value = fileName;
  }
};

addDestinationBtbnEl.onclick = () => {
  resetStatus();
  const fileName = dialog.showOpenDialogSync({
    properties: ['openFile', 'openDirectory'],
  });

  if (fileName !== undefined) {
    destionationPathEl.value = fileName;
  }
};

cloneBtnEl.onclick = () => {
  const sourcePath = sourcePathEl.value;
  const destionationPath = destionationPathEl.value;
  if (isDir(sourcePath) && isDir(destionationPath)) {
    console.log(sourcePath, destionationPath);

    copydir(
      sourcePath,
      destionationPath,
      {
        utimes: true, // keep add time and modify time
        mode: true, // keep file mode
        cover: true, // cover file when exists, default is true
      },
      async (err) => {
        if (err) {
          console.error('copydir errr', err);
          setStatusToFailed();
          throw err;
        }
        console.log('done');

        const sourceCheckSum = await dirsumDigest(sourcePath);
        const destCheckSum = await dirsumDigest(destionationPath);
        // Save Checksum results in dest folder
        await saveHashResults({ destDir: destionationPath, fileNameNoExtension: 'source', hashJson: sourceCheckSum });
        await saveHashResults({ destDir: destionationPath, fileNameNoExtension: 'dest', hashJson: destCheckSum });

        const isCheckSumSuccesfull = await compareDirsCheckSum(sourceCheckSum, destCheckSum);
        if (!isCheckSumSuccesfull) {
          console.error('!isCheckSumSuccesfull', isCheckSumSuccesfull);
          setStatusToFailed();
        } else {
          // TODO: finish notice
          console.log('source was copied to destination', isCheckSumSuccesfull);
          setStatusToComplete();
        }
      }
    );
  } else {
    // TODO: add error notice
    console.log('select source or dest');
    setStatusToFailed();
  }
};

const compareDirsCheckSum = async (source, dest) => {
  return isEqual(source, dest);
};

/**
 *  wrap dirsum.digest into a promise
 */
const dirsumDigest = async (dirPath) => {
  return new Promise((resolve, reject) => {
    dirsum.digest(dirPath, HASING_ALGORITHM, function (err, hashes) {
      if (err) {
        throw reject(err);
      }
      resolve(hashes);
    });
  });
};

function isDir(dirPath) {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}

function resetStatus() {
  statusEl.innerHTML = '';
}

function setStatusToComplete() {
  statusEl.innerHTML = `<span class="new badge" data-badge-caption="">Complete</span>`;
}

function setStatusToFailed() {
  statusEl.innerHTML = `<span class="new badge red" data-badge-caption="">Failed</span>`;
}

function saveHashResults({ destDir, fileNameNoExtension, hashJson }) {
  fs.writeFileSync(path.join(destDir, `${fileNameNoExtension}_md5sums.json`), JSON.stringify(hashJson, null, 2));
  const text = iterateThroughEntries(hashJson, [], destDir);
  fs.writeFileSync(path.join(destDir, `${fileNameNoExtension}_md5sums.txt`), text);
}

/**
 *  modified from https://www.tutorialspoint.com/recursively-list-nested-object-keys-javascript
 *  excludes keys 'files' and folder's 'hash'
 * @param {*} obj - object to flat out into string
 * @param {array} results - list
 * @param {string} path - initial path of folder
 */
function iterateThroughEntries(obj, results = [], path = '/') {
  const r = results;
  let p = path;
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value !== 'object') {
      if (key !== 'hash') {
        r.push(`${value}  ${p ? p : ''}${key}`);
      }
    } else if (typeof value === 'object') {
      if (key !== 'files') {
        p += `${key}/`;
      }
      iterateThroughEntries(value, r, p);
    }
  });
  return r.join('\n');
}
