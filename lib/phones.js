"use strict"

const http = require("./http.js")

// userPhones will fetch a userPhones object for the specified username.
// If any error occurs the first argument of the callback will be of type Error.
// Arguments:
//  user (string) What user to get the Phone objects for.
//  callback (function) Callback function.
// Callback:
//  Object containing: statusCode (http.statusCode), raw (Raw returned object from API), getPhoneNumbers (helper function)
function userPhones(user, callback) {
	if (!user) {
		callback(new Error("Invalid value of mandatory field (user) in api"), null)
		return
	}

	if (typeof callback !== "function") {
		callback(new Error("Invalid value/type of mandatory field (callback) in api"), null)
		return
	}

	let path = this.api.userPhones.replace("{user}", user)

	http.get(this.auth, this.api, path, (err, data) => {

		if (err) {
			callback(err, null)
			return
		}

		data.getPhoneNumbers = getPhoneNumbers

		callback(null, data)
	})
}

module.exports = {
	userPhones: userPhones
}

// getPhoneNumbers will return an array of numbers in international format for the userPhones object.
function getPhoneNumbers() {
	this.raw.contactMethods.sort((a, b) => {
		return b.rank - a.rank
	})

	let numbers = []
	for (let i in this.raw.contactMethods) {
		numbers.push(this.raw.contactMethods[i].value.replace(/ /g, ""))
	}

	return numbers
}