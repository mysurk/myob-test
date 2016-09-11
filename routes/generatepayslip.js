var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var CSVReader = require('../helpers/csv_reader');
var ParserValidator = require('../helpers/parser_validator');
var CSVWriter = require('csv-write-stream');
var PayslipDataGenerator = require('../services/payslip_data_generator');

router.post('/', function(req, res, next) {
    var form = new formidable.IncomingForm();

    form.uploadDir = path.join(__dirname, '../data');

    var isHeader = true;

    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
        var csvWriter = CSVWriter({headers: ['name', 'pay period',
                'gross income', 'income tax', 'net income', 'super'],
                trim: true, skip_empty_lines: true});
        var outputFileStream = fs.createWriteStream('public/employee_payslip.csv');
        csvWriter.pipe(outputFileStream);
        var payslipDataGenerator = new PayslipDataGenerator('2012-2013');

        function onNewRecordCB(record) {
            if(isHeader) {
                // Dont process header from input file
                isHeader = false;
                return;
            }
            var validatedRecord = validateRecord(record);
            if(typeof validatedRecord.error === 'undefined') {
                var payslipData = payslipDataGenerator.generatePayslipData([
                    validatedRecord]);
                payslipData = payslipData[0];
                for (var i = 0; i < payslipData.length; i++) {
                    var payslip = payslipData[i];
                    if(payslip.error) {
                        csvWriter.write([validatedRecord.first_name+' '+
                            validateRecord.last_name, 'input error', 
                            'input error', 'input error', 'input error',
                            'input error']);
                    } else {
                        csvWriter.write([payslip.name, payslip.pay_period,
                            payslip.gross_income, payslip.income_tax, 
                            payslip.net_income, payslip.super]);
                    }
                }
            } else {
                console.log(validatedRecord.error);
                csvWriter.write([validatedRecord.first_name+' '+
                    validateRecord.last_name, 'input error', 'input error', 
                    'input error', 'input error', 'input error']);
            }
        }

        function onDoneCB() {
            csvWriter.end();
            res.send({output: 'employee_payslip.csv'});
        }

        function onErrorCB(error) {
            console.log(error);
            csvWriter.end();
            res.send({error: 'An error has occured reading the input file: ' + error})
        }
        var csvReader = new CSVReader('data/'+file.name);
        csvReader.parseCSVFile(',', ['first name', 'last name', 'annual salary'
            , 'super rate', 'payment date'], onNewRecordCB, 
            onDoneCB, onErrorCB);
    });

    form.on('error', function(error) {
        console.log(error);
        res.send({error: 'An error has occured while uploading the file: ' + error})
    });

    form.on('end', function() {
        console.log('File uploaded successfully');
    });

    form.parse(req);
});

// Validation logic
function validateRecord(record) {
    var validatedRecord = {
        first_name: record['first name'].trim(),
        last_name: record['last name'].trim()
    };

    var parseNValidate = new ParserValidator();

    // validate annual salary
    var result = parseNValidate.annualSalary(record['annual salary'].trim());
    if(result.error) {
        validatedRecord.error = result.error;
        return validatedRecord;
    }
    validatedRecord.annual_salary = result.annual_salary;

    // validate super rate
    var result = parseNValidate.superRate(record['super rate'].trim());
    if(result.error) {
        validatedRecord.error = result.error;
        return validatedRecord;
    }
    validatedRecord.super_rate = result.super_rate;

    // validate payment date
    var result = parseNValidate.paymentDate(
        record['payment date'].trim().split(/[–-]/), '2012', '2013');
    if(result.error) {
        validatedRecord.error = result.error;
        return validatedRecord;
    }
    validatedRecord.payment_start_date = result.payment_start_date;
    validatedRecord.payment_end_date = result.payment_end_date;

    return validatedRecord;
}

module.exports = router;
