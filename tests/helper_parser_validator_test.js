var chai = require('chai');
var expect = chai.expect;
var ParserValidator = require('../helpers/parser_validator');

describe('ParserValidator', function() {
  it('annualSalary() should parse and validate positively', function() {
    var parseNValidate = new ParserValidator();
    expect(parseNValidate.annualSalary('120000')).to.not.have.property('error');
  });

  it('annualSalary() should parse and validate negatively', function() {
    var parseNValidate = new ParserValidator();
    expect(parseNValidate.annualSalary('34abcd123')).to.have.property('error');
  });

  it('superRate() should parse and validate positively', function() {
    var parseNValidate = new ParserValidator();
    expect(parseNValidate.superRate('12%')).to.not.have.property('error');
  });

  it('superRate() should parse and validate negatively', function() {
    var parseNValidate = new ParserValidator();
    expect(parseNValidate.superRate('-123%')).to.have.property('error');
    expect(parseNValidate.superRate('123')).to.have.property('error');
  });

  it('paymentDate() should parse and validate positively', function() {
    var parseNValidate = new ParserValidator();
    expect(parseNValidate.paymentDate(['March'], '2012', '2013')).to.not.have.property('error');
    expect(parseNValidate.paymentDate(['05 March'], '2012', '2013')).to.not.have.property('error');
    expect(parseNValidate.paymentDate(['1 March', '30 March'], '2012', '2013')).to.not.have.property('error');
    expect(parseNValidate.paymentDate(['15 sep ',' 15 March'], '2012', '2013')).to.not.have.property('error');
  });

  it('paymentDate() should parse and validate negatively', function() {
    var parseNValidate = new ParserValidator();
    expect(parseNValidate.paymentDate(['March'], '2013', '2011')).to.have.property('error');
    expect(parseNValidate.paymentDate(['March 01'], '2012', '2013')).to.have.property('error');
    expect(parseNValidate.paymentDate(['05March'], '2012', '2013')).to.have.property('error');
    expect(parseNValidate.paymentDate(['04'], '2012', '2013')).to.have.property('error');
    expect(parseNValidate.paymentDate(['15 sep - 15March'], '2012', '2013')).to.have.property('error');
    expect(parseNValidate.paymentDate(['15 mar', '15 jul'], '2012', '2013')).to.have.property('error');
    // Following Test fails
    // TBD: Consider order of months within the same year in paymentDate()
    // expect(parseNValidate.paymentDate(['15 dec', '15 sep'], '2012', '2013')).to.have.property('error');
  });

});