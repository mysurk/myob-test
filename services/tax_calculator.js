var fs = require('fs');

function TaxCalculator (year) {
    this._taxStructure = null;
    if(year) {
        var taxStructure = require('../data/tax_structure.json');
        if(taxStructure.hasOwnProperty(year)) {
            this._taxStructure = taxStructure[year];
        }
    }
}

// To add tax structure for different financial years
TaxCalculator.prototype.addTaxStructure = function(newTaxStructure) {
    if(!newTaxStructure) {
        console.log('Input parameter newTaxStructure missing');
    }
    // Todo: validate new tax structure
    var taxStructure = require('../data/tax_structure.json');
    for (var i = 0; i < newTaxStructure.length; i++) {
        var key = Object.keys(newTaxStructure[i])[0];
        taxStructure[key] = newTaxStructure[i][key];
    }
    fs.writeFileSync('data/tax_structure.json', JSON.stringify(taxStructure, 
        null, 2));
}

// Setter for tax year in case not set in constructor
TaxCalculator.prototype.setTaxYear = function(year) {
    if(!year) {
        console.log('Input parameter year missing');
    }
    var taxStructure = require('../data/tax_structure.json');
    if(taxStructure.hasOwnProperty(year)) {
        this._taxStructure = taxStructure[year];
    } else {
        console.log('Could not find the tax structure for the year ' + year);
    }
}

// Calculate and get annul tax based on annual salary
TaxCalculator.prototype.getAnnualTax = function(annualSalary) {
    if(!this._taxStructure) {
        return {error: 'Tax year is not set'};
    }
    if(!annualSalary) {
        return {error: 'Input parameter annualSalary missing'};
    }    
    var keys = Object.keys(this._taxStructure);
    for (var i = 0; i < keys.length; i++) {
        var range = keys[i].split('-');
        var start = parseInt(range[0]), end = parseInt(range[1]);
        if(start === 0) {
            start = 1;
        }
        if(annualSalary >= start && (isNaN(end) || annualSalary <= end)) {
            var amountFromPrevSlabs = parseInt(
                this._taxStructure[keys[i]].amountFromPrevSlabs);
            var amountFromCurrentSlab = parseFloat((annualSalary-start+1)*
                    this._taxStructure[keys[i]].percentage/100);
            return {
                tax: amountFromPrevSlabs + amountFromCurrentSlab
            }
        }
    }
    return {error: 'Failed to calculate tax'};
};

module.exports = TaxCalculator;
