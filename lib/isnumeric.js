"use strict"

// Exported function takes a string and checks if it's a number or not.
// Arguments:
//  number (string) String to be checked if it's an number or not.
// Returns:
//  Boolean, true number is numeric.
module.exports = function (number) {
	return !isNaN(parseFloat(number)) && isFinite(number)
}
