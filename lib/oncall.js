"use strict"

const http = require("./http.js")
const isnumeric = require("./isnumeric.js")

// teamOnCallSchedule will fetch a teamOnCallSchedule object for the specified team.
// If there is any errors the first argument in the Callback will be of type Error.
// Arguments:
//  team (string) What team to get the schedule from.
//  forward (int) How many days forward to get the schedule from. max 30.
//  skip (int) How many days to skip when fetching the schedule. max 90.
//  step (int) What step of the escalation policy to fetch. max 3.
//  callback (function) Callback function.
// Callback:
//  Error, Object containing: statusCode (http.statusCode), raw (Raw returned object from API), getCurrentOnCallUsername (helper function)
function teamOnCallSchedule(team, forward, skip, step, callback) {
	if (!team) {
		callback(new Error("Invalid value of mandatory field (team) in api"), null)
		return
	}

	if (!isnumeric(forward) || forward < 0 || forward > 30) {
		callback(new Error("Invalid value of mandatory field (forward) in api"), null)
		return
	}

	if (!isnumeric(skip) || skip < 0 || skip > 90) {
		callback(new Error("Invalid value of mandatory field (skip) in api"), null)
		return
	}

	if (!isnumeric(step) || step < 0 || step > 3) {
		callback(new Error("Invalid value of mandatory field (step) in api"), null)
		return
	}

	if (typeof callback !== "function") {
		callback(new Error("Invalid value/type of mandatory field (callback) in api"), null)
		return
	}

	let path = this.api.teamOnCallSchedule.replace("{team}", team).replace("{forward}", forward).replace("{skip}", skip).replace("{step}", step)

	http.get(this.auth, this.api, path, (err, data) => {

		if (err) {
			callback(err, null)
			return
		}

		// If there is no schedule for this team send error to callback.
		if (!this.raw.schedule) {
			callback(new Error("There seem to be no schedule for this team at this time."), null)
		}

		data.getCurrentOnCallUsername = getCurrentOnCallUsername
		callback(null, data)

	})
}

module.exports = {
	teamOnCallSchedule: teamOnCallSchedule
}

// getCurrentOnCallUsername will return the username of the user currently on call from the teamOnCallSchedule object.
function getCurrentOnCallUsername() {
	let user = ""
	// Get the rotation that has an onCall user.
	for (let i in this.raw.schedule) {
		let sched = this.raw.schedule[i]
		if (sched.onCall) {
			user = sched.onCall
		}
	}

	// Return Error if no user is on call.
	if (!user) {
		return new Error("No user seems to currently be On Call.")
	}

	let overrides = this.raw.overrides
	user = checkOverrides(user, overrides)

	return user
}

// checkOverrides will return the user that is currently oncall after checking overrides.
function checkOverrides(user, overrides) {
	for (let i in overrides) {
		let override = overrides[i]

		if (override.origOnCall === user) {
			let now = Date.now()
			// Check that Date.now() is between the start and end of the matched override.
			if ((now > new Date(override.start).getTime()) && (now < new Date(override.end).getTime())) {
				user = override.overrideOnCall
			}
		}
	}

	return user
}
