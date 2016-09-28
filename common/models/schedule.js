const validNino = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[ABCEGHJ-PRSTW-Z]{2}\d{6}[A-D]$/i;
const validSortCode = /^\d{2}-\d{2}-\d{2}$/;
const validAccountNumber = /^\d{8,10}$/;

module.exports = function(Schedule) {
  Schedule.validatesFormatOf('nationalInsuranceNumber', {
    with: validNino,
    message: {with: 'National Insurance number is not in the correct format'}
  });

  Schedule.remoteMethod('addStatus', {
    accepts: [
      {arg: 'name', type: 'string'},
      {arg: 'reason', type: 'string'}
    ],
    isStatic: false,
    description: 'Add a status to a schedule',
    returns: {type: 'Schedule', root: true},
    http: {path: '/addStatus', verb: 'put', status: 200}
  });

  Schedule.prototype.addStatus = function(name, reason, cb) {
    const data = {name, reason};
    const statuses = this.statuses;
    statuses[statuses.length - 1].endDate = new Date();
    this.updateAttribute('statuses', [...statuses, data], (err, instance) => cb(err, data));
  };

  Schedule.remoteMethod('saveFull', {
    accepts: [
      {arg: 'nationalInsuranceNumber', type: 'string'},
      {arg: 'paymentSchedule', type: 'object'}
    ],
    description: 'Add and save a full schedule all in one go',
    returns: {type: 'Schedule', root: true}
  });

  Schedule.saveFull = function(nationalInsuranceNumber, paymentSchedule, cb) {
    const Payment = Schedule.app.models.Payment;

    Schedule.create({nationalInsuranceNumber}, function(err, schedule) {
      if (err) {
        return cb(err);
      }
      const scheduleId = schedule.id;
      const linkedSchedule = paymentSchedule.map(i => Object.assign(i, {scheduleId}));

      Payment.create(linkedSchedule, (err, payments) => cb(err, schedule));
    });
  };
};
