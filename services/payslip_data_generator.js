var moment = require('moment');

function PayslipDataGenerator (year) {
    this._payslipData = [];
    if(year) {
        var TaxCalculator = require('../services/tax_calculator');
        this._taxCalculator = new TaxCalculator(year);
    } else {
        this._taxCalculator = null;
    }
}

// Setter to set tax year in case not set in constructor
PayslipDataGenerator.prototype.setTaxYear = function(year) {
    if(year) {
        if(this._taxCalculator) {
            this._taxCalculator.setTaxYear(year);
        } else {
            var TaxCalculator = require('../services/tax_calculator');
            this._taxCalculator = new TaxCalculator(year);
        }
    } else {
        console.log('Input parameter year missing');
    }
};

// Process an array of input records
// Calculate one or more payslips for each record
// Return [ [{Payslip1}, {Payslip2}], [{Payslip1}], ... ]
PayslipDataGenerator.prototype.generatePayslipData = function(employeeData) {
    this._payslipData = [];
    // For each input line, if the payment period is more than one month,
    // there will be multiple payslips for that input line
    for (var i = 0; i < employeeData.length; i++) {
        var startDate = moment(employeeData[i].payment_start_date);
        var endDate = moment(employeeData[i].payment_end_date);
        for (var j = startDate; j.isBefore(endDate); j.add(1, 'months')) {
            var endOfMonth = j.clone().endOf('month');
            var lastDay = (endDate.isBefore(endOfMonth)) ? endDate : endOfMonth;
            var payslip = {
                name: employeeData[i].first_name + ' ' + 
                    employeeData[i].last_name,
                pay_period: j.format('DD MMMM') + ' - ' + 
                    lastDay.format('DD MMMM')
            };
            // Get gross salary, tax, net pay and super with a helper function
            var payData = getMonthPay(this, employeeData[i].annual_salary, 
                employeeData[i].super_rate, j.daysInMonth(),
                lastDay.get('date') - j.get('date') + 1);
            payslip = Object.assign(payslip, payData);
            if(typeof this._payslipData[i] === 'undefined') {
                this._payslipData[i] = [payslip];
            } else {
                this._payslipData[i].push(payslip);
            }
            // Set to first day of next month as start date of payment may 
            // not necessarily be the first day of the month
            j.startOf('month');
        }
    }
    return this._payslipData;
};

function getMonthPay(context, annual_salary, super_rate, daysInMonth, paidDays) {
    // Make sure rounding is only done once on each final result
    var monthlySalary = annual_salary / 12;
    var gross_income = monthlySalary * (paidDays / daysInMonth);
    var gross_income_rounded = Math.round(gross_income);
    var result = context._taxCalculator.getAnnualTax(annual_salary);
    if(result.error) {
        return {error: result.error};
    }
    var income_tax_per_month = result.tax /12;
    var income_tax = Math.round(income_tax_per_month * (paidDays / daysInMonth));
    return {
        gross_income: gross_income_rounded,
        income_tax: income_tax,
        net_income: gross_income_rounded - income_tax,
        super: Math.round(gross_income * super_rate)
    }
}

module.exports = PayslipDataGenerator;