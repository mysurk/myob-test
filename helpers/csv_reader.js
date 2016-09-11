var fs = require('fs');
var Parse = require('csv-parse');

// Constructor to initialize filePath
function CSVReader(filePath) {
    this.filePath = filePath;
}

// Takes parser configuration for the source file
CSVReader.prototype.parseCSVFile = 
    function(delimiter, columns, onNewRecordCB, onDoneCB, onErrorCB){
        var sourceFile = fs.createReadStream(this.filePath);
        var linesRead = 0;

        var parser = Parse({
            delimiter: delimiter, 
            columns: columns,
            skip_empty_lines: true
        });

        parser.on('readable', function(){
            var record;
            while (record = parser.read()) {
                linesRead++;
                onNewRecordCB(record);
            }
        });

        parser.on('error', function(error) {
            if(onErrorCB) {
                onErrorCB(error);
            }
        });

        parser.on('end', function() {
            onDoneCB(linesRead);
        });

        sourceFile.pipe(parser);
    };

module.exports = CSVReader;