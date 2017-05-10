# jsvictorops

jsvictorops is a javascript implementation of the VictorOps REST API.
For now it only implements the following API calls and helper functions.

For more info about the VictorOps REST API please see: [portal.victorops.com/public/api-docs.html](http://https://portal.victorops.com/public/api-docs.html).

## Implemented API Calls

- GET /api-public/v1/team/{team}/oncall/schedule -> teamOnCallSchedule()
- GET /api-public/v1/user/{user}/contact-methods/phones -> userPhones()

## Implemented API Call Functions

### teamOnCallSchedule(team, forward, skip, step, callback)

This function is based on "GET /api-public/v1/team/{team}/oncall/schedule".
teamOnCallSchedule will fetch a teamOnCallSchedule object for the specified team.

Arguments:

```text
team (string) Name of the team to get the schedule for
forward (int) Days to include in returned schedule (30 max)
skip (int) Days to skip before computing schedule to return (90 max)
step (int) Step of escalation policy (3 max)
callback (function) Callback
```

Sends to callback: Error and Object

```js
new Error("Error message"),
{
  // When statusCode is anything but 200, the object will only contain code.
  statusCode: statusCode,
  // Contains the raw JSON data returned from the VictorOps API.
  raw: jsonData,
  // Helper function that will return the current (based on Date.now()) username that is on call.
  getCurrentOnCallUsername: func
}
```

If there are any errors. Typeof Error will be the first argument of the Callback.

### userPhones(user, callback)

This function is based on "GET /api-public/v1/user/{user}/contact-methods/phones".
userPhones will fetch a userPhones object for the specified username.

Arguments:

```text
user (string) Username of the user to get Phone information from
callback (function) Callback
```

Sends to callback: Error and Object

```js
new Error("Error message"),
{
  // When statusCode is anything but 200, the object will only contain code.
  statusCode: statusCode,
  // Contains the raw JSON data returned from the VictorOps API.
  raw: jsonData,
  // Helper function that will return an array of phone numbers for the user.
  getPhoneNumbers: func
}
```

## Installing the API

Over SSH: `npm install git+ssh://git@github.com:dwtechnologies/jsvictorops.git`

Over HTTPS: `npm install git+https://github.com/dwtechnologies/jsvictorops.git`

## Using the API

Import the API by importing the jsvictorops module.

```js
const victorops = require("jsvictorops")
```

Init the api with your `API ID` and `API KEY`. (If you don't have one you can create it
by logging into VictorOps webservice. Going to settings and then pressing API).

```js
const api = new victorops("API-ID", "API-KEY")
```

You are now set to use the API.

## Examples

The example below till fetch all the phone numbers for the current user that is on call for the team teamName.

```js
const victorops = require("jsvictorops")

try {
    const api = new victorops("API-ID", "API-KEY")
    getOnCallNumbers("team-name", (numbers) => {
        console.log(numbers)
    })
}
catch (err) {
    console.log(err)
}

function getOnCallNumbers(team, callback) {
    api.teamOnCallSchedule(team, 0, 0, 0, (sched) => {
        let user = sched.getCurrentOnCallUsername()
        api.userPhones(user, (phones) => {
            let numbers = phones.getPhoneNumbers()
            callback(numbers)
        })
    })
}
```