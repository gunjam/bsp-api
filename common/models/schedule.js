const validNino = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[ABCEGHJ-PRSTW-Z]{2}\d{6}[A-D]$/i;
const validSortCode = /^\d{2}-\d{2}-\d{2}$/;
const validAccountNumber = /^\d{8,10}$/;

module.exports = function(Schedule) {
  Schedule.validatesFormatOf('nationalInsuranceNumber', {
    with: validNino,
    message: {with: 'National Insurance number is not in the correct format'}
  });
};
