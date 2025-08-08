export class RegexUtils {
	/**
	 * This method validates the phone number
	 * @param phone - The phone number to validate
	 * @returns The phone number is valid
	 */
    public phoneRegex = new RegExp(
        /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
    );
}

export default new RegexUtils();