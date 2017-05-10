"use strict"

const oncall = require("./lib/oncall.js")
const phones = require("./lib/phones.js")

// Exported function will setup the API object with the API ID and Key and the necessary URLs and Paths.
// Will throw any errors.
// Arguments:
//  id (string) The API ID.
//  key (string) The API Key.
module.exports = function (id, key) {
	if (!id) {
		throw new Error("Invalid value of mandatory field (id) in api")
	}

	if (!key) {
		throw new Error("Invalid value of mandatory field (key) in api")
	}

	this.auth = {
		id: id,
		key: key
	}

	this.api = {
		host: "api.victorops.com",
		port: 443,

		teamOnCallSchedule: "/api-public/v1/team/{team}/oncall/schedule?daysForward={forward}&daysSkip={skip}&step={step}",
		userPhones: "/api-public/v1/user/{user}/contact-methods/phones"
	}

	// API Modules.
	this.userPhones = phones.userPhones
	this.teamOnCallSchedule = oncall.teamOnCallSchedule
}
