function isFutureDate(err) {
  const now = new Date();
  if (this.dateOfPayment < now) {
    err();
  }
}

const isValidType = /^initial$|^monthly$|^backDated$/;

module.exports = function (Payment) {
  Payment.validate('date', isFutureDate, {
    message: {with: 'Must be future date'}
  });
  Payment.validatesFormatOf('type', {
    with: isValidType,
    message: {is: 'Payment type must be either initial, monthly or backDated'}
  });
};
