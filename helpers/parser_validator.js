var moment = require('moment');

function ParserValidator() {
}

ParserValidator.prototype.annualSalary = function(annual_salary) {
    if(annual_salary.match(/^[0-9]+$/) == null) {
        return {error: 'Incorrect annual salary format'};
    }
    var annual_salary = parseInt(annual_salary);
    if(isNaN(annual_salary)) {
        return {error: 'Incorrect annual salary format'};
    }
    return {annual_salary: annual_salary};
}

ParserValidator.prototype.superRate = function(super_rate) {
    var index = super_rate.indexOf('%');
    if(index <= 0) {
        return {error: 'Incorrect super rate format'};
    }
    super_rate = parseFloat(super_rate.substring(0, index))/100;
    if(isNaN(super_rate) || super_rate < 0) {
        return {error: 'Incorrect super rate format'};
    }
    return {super_rate: super_rate};
}

ParserValidator.prototype.paymentDate = function(dates, taxYear1, taxYear2) {
    if(parseInt(taxYear2) - parseInt(taxYear1) <= 0) {
        return {error: 'Incorrect payment start date format'};
    }
    var paymentStartYear, result = {};
    if(dates[0]) {
        var date1 = dates[0].trim().split(' ');
        var month1 = (date1.length > 1) ? date1[1] : date1[0];
        month1 = month1.toLowerCase();
        if(YEAR1.indexOf(month1) > -1) {
            dates[0] = dates[0] + ' ' + taxYear1;
            paymentStartYear = taxYear1;
        } else if(YEAR2.indexOf(month1) > -1) {
            dates[0] = dates[0] + ' ' + taxYear2;
            paymentStartYear = taxYear2;
        } else {
            return {error: 'Incorrect payment start date format'};
        }
    } else {
        return {error: 'Incorrect payment start date format'};
    }
    if(dates[1]) {
        var date2 = dates[1].trim().split(' ');
        var month2 = (date2.length > 1) ? date2[1] : date2[0];
        month2 = month2.toLowerCase();
        if(YEAR1.indexOf(month2) > -1) {
            if(paymentStartYear === taxYear2) {
                return {error: 'Incorrect payment start date format'};
            }
            dates[1] = dates[1] + ' ' + taxYear1;
        } else if(YEAR2.indexOf(month2) > -1) {
            dates[1] = dates[1] + ' ' + taxYear2;
        } else {
            return {error: 'Incorrect payment start date format'};
        }
    }
    var timestamp = Date.parse(dates[0]);
    if(isNaN(timestamp)) {
        return {error: 'Incorrect payment start date format'};
    }
    result.payment_start_date = new Date(timestamp);
    if(dates[1]) {
        timestamp = Date.parse(dates[1]);
        if(isNaN(timestamp)) {
            return {error: 'Incorrect payment start date format'};
        }
        result.payment_end_date = new Date(timestamp);
    } else {
        result.payment_end_date = 
            moment(result.payment_start_date).endOf('month').toDate();
    }
    return result;
}

var YEAR1 = ['jul', 'july', 'aug', 'august', 'sep', 'september', 'oct', 
    'october', 'nov', 'november', 'dec', 'december'];
var YEAR2 = ['jan', 'january', 'feb', 'february', 'mar', 'march', 'apr', 
    'april', 'may', 'jun', 'june'];

module.exports = ParserValidator;
