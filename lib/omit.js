"use strict"

// Exported function will take an object and omit empty strings, null, undefined, empty objects, empty arrays and where type is function and return the omitted object.
// Arguments:
//  obj1 (object) Object 1.
//  obj2 (object) Object 2.
// Returns:
//  Object (merged).
module.exports = function (obj) {
	return omit(obj)
}

function omit(obj) {
	let cleaned = {}

	for (let attrname in obj) {
		if (obj[attrname] === null || obj[attrname] === undefined || obj[attrname] === "" || obj[attrname] === [] || obj[attrname] === {} || typeof obj[attrname] === "function") {
			continue
		}

		// If we have type Object we need to run our own function on the object to omit multi-level objects.
		if (typeof obj[attrname] === "object") {
			obj[attrname] = omit(obj[attrname])

			// Don't add empty cleaned objects
			if (Object.keys(obj[attrname]).length === 0) {
				continue
			}
		}

		cleaned[attrname] = obj[attrname]
	}

	return cleaned
}
