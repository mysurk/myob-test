var chai = require('chai');
var expect = chai.expect;
var PayslipDataGenerator = require('../services/payslip_data_generator');

describe('PayslipDataGenerator', function() {
  it('generatePayslipData() should return empty data', function() {
    var payslipDataGenerator = new PayslipDataGenerator('2012-2013');
    expect(payslipDataGenerator.generatePayslipData([])).to.be.empty;
  });

  it('generatePayslipData() should give one emplyee payslip data', function() {
    var payslipDataGenerator = new PayslipDataGenerator('2012-2013');
    expect(payslipDataGenerator.generatePayslipData([
        {
            'first_name': 'Kaushik',
            'last_name': 'Mysur',
            'annual_salary': 120000,
            'super_rate': 0.1,
            'payment_start_date': new Date('1 march 2013'),
            'payment_end_date': new Date('31 march 2013')
        }
    ])).not.to.be.empty;
    expect(payslipDataGenerator.generatePayslipData([
        {
            'first_name': 'David',
            'last_name': 'Rudd',
            'annual_salary': 60050,
            'super_rate': 0.09,
            'payment_start_date': new Date('01 march 2013'),
            'payment_end_date': new Date('31 march 2013')
        }
    ])).to.deep.equal([[{
      name: 'David Rudd',
      pay_period: '01 March - 31 March',
      gross_income: 5004,
      income_tax: 922,
      net_income: 4082,
      super: 450
    }]]);
  });

  it('generatePayslipData() should give one emplyee payslip data', function() {
    var payslipDataGenerator = new PayslipDataGenerator('2012-2013');
    expect(payslipDataGenerator.generatePayslipData([
        {
            'first_name': 'David',
            'last_name': 'Rudd',
            'annual_salary': 60050,
            'super_rate': 0.09,
            'payment_start_date': new Date('01 march 2013'),
            'payment_end_date': new Date('31 march 2013')
        },
        {
            'first_name': 'Ryan',
            'last_name': 'Chen',
            'annual_salary': 120000,
            'super_rate': 0.1,
            'payment_start_date': new Date('15 November 2012'),
            'payment_end_date': new Date('15 February 2013')
        }
    ])).to.deep.equal([[{
        name: 'David Rudd',
        pay_period: '01 March - 31 March',
        gross_income: 5004,
        income_tax: 922,
        net_income: 4082,
        super: 450
      }],
      [{
        name: 'Ryan Chen',
        pay_period: '15 November - 30 November',
        gross_income: 5333,
        income_tax: 1438,
        net_income: 3895,
        super: 533
      }, {
        name: 'Ryan Chen',
        pay_period: '01 December - 31 December',
        gross_income: 10000,
        income_tax: 2696,
        net_income: 7304,
        super: 1000
      }, {
        name: 'Ryan Chen',
        pay_period: '01 January - 31 January',
        gross_income: 10000,
        income_tax: 2696,
        net_income: 7304,
        super: 1000
      }, {
        name: 'Ryan Chen',
        pay_period: '01 February - 15 February',
        gross_income: 5357,
        income_tax: 1444,
        net_income: 3913,
        super: 536
      }],
    ]);
  });

});