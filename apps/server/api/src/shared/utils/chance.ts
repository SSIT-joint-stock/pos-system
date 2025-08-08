import Chance from 'chance';

export class ChanceUtils {
    private chance: Chance.Chance;
    public constructor() {
        this.chance = new Chance();
    }

    /**
     * This method generates a random string
     * @param length - The length of the string
     * @returns The random string
     */
    public randomString(length: number): string {
        return this.chance.string({ length });
    }

    /**
     * This method generates a random integer
     * @param min - The minimum value
     * @param max - The maximum value
     * @returns The random integer
     */
    public randomInteger(min: number, max: number): number {
        return this.chance.integer({ min, max });
    }

    /**
     * This method generates a random boolean
     * @returns The random boolean
     */
    public randomBoolean(): boolean {
        return this.chance.bool();
    }

    /**
     * This method generates a random date
     * @param start - The start date
     * @param end - The end date
     * @returns The random date
     */
    public randomDate(start: Date, end: Date): string {
        return this.chance.date({ min: start, max: end }).toLocaleString();
    }

    /**
     * This method generates a random array element
     * @param arr - The array
     * @returns The random array element
     */
    public randomArrayElement<T>(arr: T[]): T {
        return this.chance.pickone(arr);
    }

    /**
     * This method generates a random array
     * @param arr - The array
     * @param size - The size of the array
     * @returns The random array
     */
    public randomArray<T>(arr: T[], size: number): T[] {
        return this.chance.pickset(arr, size);
    }
}

export default new ChanceUtils();