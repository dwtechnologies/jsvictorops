"use strict"

const https = require("https")
const querystring = require("querystring")
const omit = require("./omit.js")

// Should add PATCH, PUT, DELETE if we want to implement the whole VictorOps REST API in the future.

// get will fetch data from the victorops API and send it as an object containing statusCode (http.statusCode) and raw (Object parsed from JSON)
// If there is an error, first argument in callback will be of type Error.
// Arguments:
//  auth (auth object) Object containing auth information for the victorops API.
//  api (api object) Object containing API url/paths for the victorops API.
//  path (string) URL to fetch.
//  callback (function) Callback function.
// Callback:
//  Error and Object containing: statusCode (http.statusCode), raw (Object parsed from JSON).
function get(auth, api, path, callback) {

	let options = {
		host: api.host,
		port: api.port,
		path: path,
		headers: {
			"Accept": "application/json",
			"X-VO-Api-Id": auth.id,
			"X-VO-Api-Key": auth.key
		}
	}

	https.get(options, (res) => {
		let data = ""

		res.on("data", (chunk) => {
			data += chunk
		})

		res.on("end", () => {
			if (res.statusCode != 200) {
				callback(new Error("Error code", res.statusCode, data), null)
				return
			}

			let resobj = {
				statusCode: res.statusCode,
				raw: JSON.parse(data)
			}

			callback(null, resobj)
		})
	})
}

// post will post data to the victorops API and send the response as an object containing statusCode (http.statusCode) and raw (Object parsed from JSON).
// If there is an error, first argument in callback will be of type Error.
// Arguments:
//  auth (auth object) Object containing auth information for the victorops API.
//  api (api object) Object containing API url/paths for the victorops API.
//  path (string) URL to post to.
//  rawquery (object) object containing key-value pairs to be converted to a query string.
//  callback (function) Callback function.
// Callback:
//  Object containing: statusCode (http.statusCode), raw (Object parsed from JSON) or any Error.
function post(auth, api, path, rawquery, callback) {
	let qs = querystring.stringify(omit(rawquery))

	let options = {
		host: api.host,
		port: api.port,
		method: "POST",
		path: path,
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"X-VO-Api-Id": auth.id,
			"X-VO-Api-Key": auth.key
		}
	}

	let req = https.request(options, (res) => {
		let data = ""

		res.on("data", (chunk) => {
			data += chunk
		})

		res.on("end", () => {
			if (res.statusCode != 200) {
				callback(new Error("Error code", res.statusCode, data), null)
				return
			}

			let resobj = {
				statusCode: res.statusCode,
				raw: JSON.parse(data)
			}

			callback(null, resobj)
		})
	})

	// Write query strings to the request.
	req.write(qs)

	req.on("error", () => {
		callback(new Error("Error creating request for", options.host + option.path), null)
	})

	req.end()
}

// Export the get and post functions.
module.exports = {
	get: get,
	post: post
}
