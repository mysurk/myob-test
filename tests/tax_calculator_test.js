var chai = require('chai');
var expect = chai.expect;
var TaxCalculator = require('../services/tax_calculator');

describe('TaxCalculator', function() {
  it('Without tax year set, getAnnualTax() should have error property', function() {
    var taxCalculator = new TaxCalculator();
    expect(taxCalculator.getAnnualTax(120000)).to.have.property('error');
  });
  it('For known tax year, getAnnualTax() should have not have error property', function() {
    var taxCalculator = new TaxCalculator();
    taxCalculator.setTaxYear('2012-2013');
    expect(taxCalculator.getAnnualTax(120000)).not.to.have.property('error');
  });
  it('For unknown tax year, getAnnualTax() should have error property', function() {
    var taxCalculator = new TaxCalculator('1999-2000');
    expect(taxCalculator.getAnnualTax(120000)).to.have.property('error');
  });
  it('After tax structure is added for a year, getAnnualTax() should get tax data', function() {
    var taxCalculator = new TaxCalculator();
    taxCalculator.addTaxStructure([
      {
        '2013-2014': {
            '0-18200': {
                'amountFromPrevSlabs': '0',
                'percentage': '0'
            },
            '18201-37000': {
                'amountFromPrevSlabs': '0',
                'percentage': '19'
            },
            '37001-80000': {
                'amountFromPrevSlabs': '3572',
                'percentage': '32.5'
            },
            '80001-180000': {
                'amountFromPrevSlabs': '17547',
                'percentage': '37'
            },
            '180001-': {
                'amountFromPrevSlabs': '54547',
                'percentage': '45'
            }
        }
      }
    ]);
    taxCalculator.setTaxYear('2013-2014');
    expect(taxCalculator.getAnnualTax(360000)).not.to.have.property('error');
    expect(taxCalculator.getAnnualTax(120000)).to.deep.equal({tax: 32347});
  });
});