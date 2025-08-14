import fs from 'fs';
import * as fastCSV from 'fast-csv';


export class CsvUtils {
    /**
     * @static
     * @async
     * @method convertToArray
     * @description Converts a CSV file to an array of objects with the specified data structure.
     * @param {string} filePath - The path to the CSV file.
     * @returns {Promise<DataLabel[]>} An array of objects representing the CSV data.
     * @template DataLabel - The type of data structure for each row.
     */
    public async convertToArray<DataLabel extends Record<string, unknown>>(
        filePath: string
    ): Promise<DataLabel[]> {
        try {
            const stream = fs.createReadStream(filePath);
            return await new Promise<DataLabel[]>((resolve, reject) => {
                const data: DataLabel[] = [];
                fastCSV.parseStream(stream, { headers: true })
                    .on('data', (row) => {
                        data.push(row);
                        return row;
                    })
                    .on('end', () => resolve(data))
                    .on('error', reject);
            });
        } catch (error) {
            console.error('Error reading CSV file:', error);
            return [];
        }
    }
}

export default new CsvUtils();