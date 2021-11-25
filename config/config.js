module.exports = {
  csvConfig: {
    delimiter: '||',
    toArrayString: true,
    colParser: {
      amount: 'number',
      date: 'Date'
    }
  }
};
