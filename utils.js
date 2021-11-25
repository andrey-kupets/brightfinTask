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

module.exports = {
    dataBuilder: (item) => {
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
  }
};
