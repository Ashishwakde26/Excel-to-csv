const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Load the Excel file
const workbook = XLSX.readFile('Sample.xlsx'); // Change 'data.xlsx' to your file path
const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Assuming the first sheet
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Extract column A (the first column) and skip the first row
const records = data.slice(1).map(row => row[0]); // Skip the first row

// Function to split records into chunks
function splitIntoChunks(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

const chunks = splitIntoChunks(records, 10);

// Write each chunk to a separate CSV file
chunks.forEach((chunk, index) => {
    const csvWriter = createCsvWriter({
        path: path.join(__dirname, `chunk_${index + 1}.csv`),
        header: [{ id: 'record', title: 'Record' }]
    });

    const recordsForCsv = chunk.map(record => ({ record }));

    csvWriter.writeRecords(recordsForCsv)
        .then(() => {
            console.log(`Chunk ${index + 1} written to chunk_${index + 1}.csv`);
        })
        .catch(err => {
            console.error('Error writing CSV file', err);
        });
});
