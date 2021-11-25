const csv = require('csvtojson');
const StreamZip = require('node-stream-zip');

const fs = require('fs');
const path = require('path');

const zipPath = path.join(process.cwd(), 'Test data.zip');

const dateConverter = (date) => date
  .split('/')
  .reverse()
  .map((item) => (item.length <= 1 ? `0${item}` : item))
  .join('-');

const phoneConverter = (str) => {
  const newStr = str
    .replace('(', '')
    .replace(')', '')
    .replace(' ', '')
    .replace('-', '');

  return ''.concat('(+380)', newStr);
};

const dataBuilder = (item) => {
  const {
    name, phone, first_name, last_name, cc, amount, date
  } = item;

  return {
    name,
    phone: phoneConverter(phone),
    person: {
      firstName: first_name,
      lastName: last_name
    },
    amount,
    date: dateConverter(date),
    costCenterNum: cc.slice(3)
  };
};

const csvConfig = {
  delimiter: '||',
  toArrayString: true,
  colParser: {
    amount: 'number',
    date: 'Date'
  }
};

const zip = new StreamZip({
  file: zipPath,
  storeEntries: true
});

zip.on('ready', () => {
  for (const entry of Object.values(zip.entries())) {
    // Read a file in memory
    const fileInZip = path.join(entry.name);
    const fileContent = zip.entryDataSync(fileInZip).toString('utf8');

    const outputDirPath = path.join(process.cwd(), 'outputData');
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdir(outputDirPath, (err) => {
        console.log(err);
      });

      const csvDataPath = path.join(outputDirPath, 'users.csv');
      fs.appendFile(csvDataPath, fileContent, (err) => {
        console.log(err);
      });

      const readStream = fs.createReadStream(csvDataPath);
      const writeStream = fs.createWriteStream(path.join(outputDirPath, 'users.json'));

      // writeStream.write('')
      readStream.pipe(csv(csvConfig))
        .once('data', () => writeStream.write('['))
        .on('data', (chunk) => {
          const itemData = JSON.parse(chunk.toString());
          const jsonItemData = dataBuilder(itemData);

          writeStream.write(`${JSON.stringify(jsonItemData)},`);
        })
        .on('end', () => {
          writeStream.write(']');
          console.log('Finish');
        })
        .then(() => {
        });
    }
  }

  // Do not forget to close the file once you're done
  zip.close();
});
