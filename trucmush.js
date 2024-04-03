function romanToDecimal(roman) {
    const romanNumerals = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000,
        '*': 1000 // Using '*' to represent values over 5000
    };

    let result = 0;

    for (let i = 0; i < roman.length; i++) {
        let current = romanNumerals[roman[i]];
        let next = romanNumerals[roman[i + 1]];

        if (current < next) {
            result += next - current;
            i++; // Skip the next character as it's already been considered
        } else {
            result += current;
        }
    }

    return result;
}

function isRomanNumeral(input) {
    const romanRegex = /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
    return romanRegex.test(input);
}

const input = "V*CDXXVIII"; // Example for 5428 with V* representing values over 5000
if (isRomanNumeral(input)) {
    const decimalEquivalent = romanToDecimal(input);
    console.log(`The decimal equivalent of ${input} is: ${decimalEquivalent}`);
} else {
    console.log(`${input} is not a valid Roman numeral.`);
}
