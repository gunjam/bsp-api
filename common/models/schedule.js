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
      {arg: 'reason', type: 'string'},
      {arg: 'effectiveDate', type: 'date'}
    ],
    isStatic: false,
    description: 'Add a status to a schedule',
    returns: {type: 'Schedule', root: true},
    http: {path: '/addStatus', verb: 'put', status: 200}
  });

  Schedule.prototype.addStatus = function(name, reason, effectiveDate, cb) {
    const data = {name, reason, effectiveDate};
    const statuses = this.statuses;
    statuses[statuses.length - 1].endDate = new Date();
    this.updateAttribute('statuses', [...statuses, data], (err, instance) => cb(err, data));
  };

  Schedule.remoteMethod('saveFull', {
    accepts: [
      {arg: 'nationalInsuranceNumber', type: 'string'},
      {arg: 'bankAccountId', type: 'string'},
      {arg: 'paymentSchedule', type: 'object'}
    ],
    description: 'Add and save a full schedule all in one go',
    returns: {type: 'Schedule', root: true}
  });

  Schedule.saveFull = function(nationalInsuranceNumber, bankAccountId, paymentSchedule, cb) {
    const Payment = Schedule.app.models.Payment;

    Schedule.create({nationalInsuranceNumber}, (err, schedule) => {
      if (err) {
        return cb(err);
      }
      const scheduleId = schedule.id;
      const linkedSchedule = paymentSchedule.map(i => Object.assign(i, {scheduleId, bankAccountId}));

      Payment.create(linkedSchedule, (err, payments) => {
        if (err) {
          return cb(err);
        }
        schedule.bankAccounts.add(bankAccountId, (err, id) => cb(err, schedule));
      });
    });
  };

  Schedule.remoteMethod('updateBankAccount', {
    accepts: [
      {arg: 'scheduleId', type: 'string'},
      {arg: 'bankAccountId', type: 'string'},
      {arg: 'date', type: 'date'}
    ],
    description: 'Change bank account for all payments in a schedule beyond a given date',
    returns: {type: 'Schedule', root: true}
  });

  Schedule.updateBankAccount = function(scheduleId, bankAccountId, date, cb) {
    const Payment = Schedule.app.models.Payment;

    Payment.updateAll({scheduleId, date: {"gt": date}}, {bankAccountId}, (err, info) => {
      if (err) {
        return cb(err);
      }
      Schedule.findById(scheduleId, (err, schedule) => {
        if (err) {
          return cb(err);
        }
        schedule.bankAccounts.add(bankAccountId, (err, id) => cb(err, schedule));
      });
    });
  };
};
