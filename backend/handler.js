"use strict";
const mongoose = require("mongoose");
const connectToDatabase = require("./db");
const User = require("./user.model.js");
const Match = require("./matches.model.js");

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
    User.findById(event.pathParameters.id)
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
          body: "Could not fetch the note.",
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
          const found = await User.find({ name: `${match}` }, "-_id -__v");
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

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    User.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), {
      new: true,
    })
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
