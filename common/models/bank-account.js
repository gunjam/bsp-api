const validSortCode = /^\d{2}-\d{2}-\d{2}$/;
const validAccountNumber = /^\d{8,10}$/;

module.exports = function (BankAccount) {
  BankAccount.validatesFormatOf('sortCode', {
    with: validSortCode,
    message: {with: 'Sort code must be in the format NN-NN-NN'}
  });
  BankAccount.validatesFormatOf('accountNumber', {
    with: validAccountNumber,
    message: {is: 'Account number must be between 8 and 10 digits'}
  });
};
