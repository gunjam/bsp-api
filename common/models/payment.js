function isFutureDate(err) {
  const now = new Date();
  if (this.dateOfPayment < now) {
    err();
  }
}

module.exports = function (Payment) {
  Payment.validate('date', isFutureDate, {
    message: {with: 'Must be future date'}
  });
};
