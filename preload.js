// const { dialog } = require('electron').remote;
// const checksum = require('checksum');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  // document.getElementById('source').onclick = (e) => {
  //   console.log('click');
  //   const file = dialog.showOpenDialog()[0];

  //   //  dialog.showOpenDialog(
  //   //    {
  //   //      properties: ['openFile'],
  //   //    },
  //   //    function (fileName) {
  //   //      if (fileName !== undefined) {
  //   //        // handle files
  //   //        document.querySelector('#aeneaLinuxPath').innerText = fileName;
  //   //        global.setOptionalPathToAeneasBinary(fileName[0].trim());
  //   //      }
  //   //    }
  //   //  );

  //   console.log(file);
  // };
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
