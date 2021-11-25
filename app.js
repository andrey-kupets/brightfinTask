const csv = require('csvtojson');
const StreamZip = require('node-stream-zip');

const fs = require('fs');
const path = require('path');

const { builder } = require('./utils');
const { config } = require('./config');

const outputDirPath = path.join(process.cwd(), 'outputData');
const csvDataPath = path.join(outputDirPath, 'users.csv');
const zipPath = path.join(process.cwd(), 'Test data.zip');

const zip = new StreamZip({
  file: zipPath,
  storeEntries: true
});

zip.on('ready', () => {
  for (const entry of Object.values(zip.entries())) {
    // Read a file in memory
    const fileInZip = path.join(entry.name);
    const fileContent = zip.entryDataSync(fileInZip).toString('utf8');

    if (!fs.existsSync(outputDirPath)) {
      fs.mkdir(outputDirPath, (err) => {
        console.log(err);
      });
    }

    fs.appendFile(csvDataPath, fileContent, (err) => {
      console.log(err);
    });

    const readStream = fs.createReadStream(csvDataPath);
    const writeStream = fs.createWriteStream(path.join(outputDirPath, 'users.json'));

    readStream.pipe(csv(config.csvConfig))
      .once('data', () => writeStream.write('['))
      .on('data', (chunk) => {
        const itemData = JSON.parse(chunk.toString());
        const jsonItemData = builder.dataBuilder(itemData);

        writeStream.write(`${JSON.stringify(jsonItemData)},`);
      })
      .on('end', () => {
        writeStream.write(']');
        console.log('Finish');
      })
      .then(() => {
      });
  }
  // optional
  fs.unlink(csvDataPath, (err) => {
    if (err) console.log(err);
  });

  // Do not forget to close the file once you're done
  zip.close();
});
