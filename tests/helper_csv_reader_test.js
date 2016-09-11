var chai = require('chai');
var expect = chai.expect;
var CSVReader = require('../helpers/csv_reader');

describe('CSVReader', function() {
  it('CSVReader should read data correctly', function() {
    var lineCounter = 0;
    function onNewRecordCB(record) {
        switch(lineCounter) {
            case 0:
                expect(record).to.deep.equal({
                    'first name': 'first name',
                    'last name': 'last name',
                    'annual salary': 'annual salary',
                    'super rate': 'super rate',
                    'payment date': 'payment date'
                });
                break;
            case 1:
                expect(record).to.deep.equal({
                    'first name': 'David',
                    'last name': 'Rudd',
                    'annual salary': '120000',
                    'super rate': '9%',
                    'payment date': '01 March – 31 March'
                });
                break;
            case 4:
                expect(record).to.deep.equal({
                    'first name': 'Ethan',
                    'last name': 'Hunt',
                    'annual salary': '130000',
                    'super rate': '20%',
                    'payment date': '05 March'
                });
                break;
            case 9:
                expect(record).to.deep.equal({
                    'first name': 'Logan',
                    'last name': 'King',
                    'annual salary': '85000',
                    'super rate': '10%',
                    'payment date': 'March'
                });
                break;
        };
        lineCounter++;
    }

    function onDoneCB(linesRead) {
        expect(linesRead).to.be.equal(lineCounter);
        csvWriter.end();
    }

    var csvReader = new CSVReader('../data/input.csv');
    csvReader.parseCSVFile(',', ['first name', 'last name', 'annual salary'
        , 'super rate', 'payment date'], onNewRecordCB, onDoneCB);
  });
});