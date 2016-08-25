const validNino = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[ABCEGHJ-PRSTW-Z]{2}\d{6}[A-D]$/i;
const validSortCode = /^\d{2}-\d{2}-\d{2}$/;

function isNationalInsuranceNumber(err) {
  if (!isNino.test(this.nationalInsuranceNumber)) {
    err();
  }
}

function isSortCode(err) {
  if (!validSortCode.test(this.sortCode)) {
    err();
  }
}

function isFutureDate(err) {
  const now = new Date();
  if (this.dateOfPayment < now) {
    err();
  }
}

module.exports = function(Schedule) {
  Schedule.validatesFormatOf('nationalInsuranceNumber', {
    with: isNationalInsuranceNumber,
    message: {with: 'Sort code must be 6 numbers'}
  });
  Schedule.validatesFormatOf('sortCode', {
    with: isSortCode,
    message: {with: 'Sort code must be in the format NN-NN-NN'}
  });
  Schedule.validatesLengthOf('accountNumber', {
    is: 8,
    message: {is: 'Account number must be 8 digits'}
  });
};
