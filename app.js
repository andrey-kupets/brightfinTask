// const csv = require('csvtojson');
const csv = require('csvtojson');
const StreamZip = require('node-stream-zip');

const fs = require('fs');
const path = require('path');

const zipPath = path.join(process.cwd(), 'Test data.zip');
// const qwe = path.join(__dirname, 'qwe')
// fs.readdir(zipPath, (err, files) => {
//   console.log(files)
// })
// fs.readdir(qwe, (err, files) => {
//   console.log(files)
// })

const zip = new StreamZip({
  file: zipPath,
  storeEntries: true
});


zip.on('ready', async () => {
  // Take a look at the files

  for (const entry of Object.values(zip.entries())) {
    // const desc = entry.isDirectory ? 'directory' :`${entry.size} bytes`;
    // console.log(`Entry ${entry.name}: ${desc}`);

    // Read a file in memory
    const fileInZip = path.join(entry.name)
    const fileContent = zip.entryDataSync(fileInZip).toString('utf8');

    // const fileOutZipPath = fs.writeFile(path.join(process.cwd(), 'json', 'users.js'), fileContent, err => {
    //   console.log(err);
    // });
    console.log(`The content of ${fileInZip} is:\n` + fileContent);
    //
    // const jsonArray = await csv().fromFile(fileOutZipPath)
    // console.log(jsonArray)
  }

  // Do not forget to close the file once you're done
  zip.close();
});
