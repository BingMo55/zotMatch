"use strict";
const mongoose = require("mongoose");
const connectToDatabase = require("./db");
const User = require("./user.model.js");
const Match = require("./matches.model.js");
const { ObjectId } = require("mongodb");

require("dotenv").config({ path: "./variables.env" });

module.exports.create = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;

	connectToDatabase().then(() => {
		const addUser = JSON.parse(event.body);
		console.log("Adding", addUser);
		User.create(addUser)
			.then((user) => {
				console.log("Successfully created");
				callback(null, {
					statusCode: 200,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": true,
					},
					body: JSON.stringify(user),
				});
			})
			.catch((err) => {
				console.log("Error", err);
				callback(null, {
					statusCode: err.statusCode || 500,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": true,
					},
					body: "Could not create the note.",
				});
			});
	});
};

module.exports.getOne = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	connectToDatabase().then(() => {
		User.findOne({ email: event.pathParameters.id })
			.then((user) =>
				callback(null, {
					statusCode: 200,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": true,
					},
					body: JSON.stringify(user),
				})
			)
			.catch((err) =>
				callback(null, {
					statusCode: err.statusCode || 500,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": true,
					},
					body: "Could not fetch the user.",
				})
			);
	});
};

module.exports.match = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	connectToDatabase().then(async () => {
		const user = JSON.parse(event.body);
		const userObj = await User.find(
			{
				name: `${user.name}`,
				email: `${user.email}`,
			},
			"-_id -__v"
		);
		const potentialMatches = user.likes;
		try {
			await Promise.all(
				potentialMatches.map(async (match) => {
					const found = await User.find({ id: `${match}` }, "-_id -__v");
					if (found.length == 0) {
						return;
					}
					console.log(`Found ${found[0]} for`, userObj[0]);
					const matchedUsers = { users: [userObj[0], found[0]] };
					await Match.create(matchedUsers)
						.then((match) => {
							console.log("Successfully created match", matchedUsers);
							const resp = {
								statusCode: 200,
								headers: {
									"Access-Control-Allow-Origin": "*",
									"Access-Control-Allow-Credentials": true,
								},
								body: "Successfully created match",
							};
							callback(null, resp);
						})
						.catch((err) => {
							console.log("Error creating Match", err);
							const resp = {
								statusCode: 200,
								headers: {
									"Access-Control-Allow-Origin": "*",
									"Access-Control-Allow-Credentials": true,
								},
								body: "Error creating Match",
							};
							callback(null, resp);
						});
				})
			);
		} catch (err) {
			console.log("Error", err);
			callback(null, {
				statusCode: err.statusCode || 500,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Credentials": true,
				},
				body: "Could not create the note.",
			});
		}
	});
};

module.exports.getAll = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;

	connectToDatabase().then(() => {
		User.find()
			.then((user) =>
				callback(null, {
					statusCode: 200,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": true,
					},
					body: JSON.stringify(user),
				})
			)
			.catch((err) =>
				callback(null, {
					statusCode: err.statusCode || 500,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": true,
					},
					body: "Could not fetch the notes.",
				})
			);
	});
};

module.exports.sendMatches = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	connectToDatabase().then(async () => {
		const matches = await Match.find();
		console.log(matches);
		matches.forEach((match) => {
			const users = match.users;
			if (users.length != 2) {
				callback(null, {
					statusCode: 400,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": true,
					},
					body: "invalid match error",
				});
				return;
			}
			const userA = users[0];
			const userB = users[1];
			if (!userA || !userB) {
				return;
			}
			console.log(userA.email);
			const mailjet = require("node-mailjet").connect(
        process.env.mailJetApiKey,
        process.env.mailJetApiSecretKey
      );
      const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "zotmatches@gmail.com",
              Name: "zotMatches",
            },
            To: [
              {
                Email: userA.email,
                Name: userA.name,
              },
              {
                Email: userB.email,
                Name: userB.name,
              },
            ],
            Subject: "ZotMatch - check who your match is!",
            TextPart:
              "We're happy to inform you that a matched has been found. Check who is CC on this email to find out who it is",
            // "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
            // "CustomID": "AppGettingStartedTest"
          },
        ],
      });
      request
        .then(async(result) => {
          console.log("success");
          console.log(result);
          console.log("delete id: " + match._id)
          const matchDelete = await Match.deleteOne({_id: ObjectId(match._id)});
          callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": true,
            },
            body: "mail sent successfully",
          });
        })
        .catch((err) => {
          console.log("failed");
          console.log(err);
          callback(null, {
            statusCode: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": true,
            },
            body: "mail failed to send",
          });
        });
		});
	});
};

module.exports.update = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	connectToDatabase().then(() => {
    const updateUser = JSON.parse(event.body);
    console.log(updateUser),

		User.findOneAndUpdate({id: event.pathParameters.id}, updateUser, {
			new: true,
		})
			.then((user) =>
				callback(null, {
          
					statusCode: 200,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": true,
            "Content-Type": "application/json",
					},
					body: JSON.stringify(user),
				})
			)
			.catch((err) =>
				callback(null, {
					statusCode: err.statusCode || 500,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": true,
					},
					body: "Could not fetch the notes.",
				})
			);
	});
};
