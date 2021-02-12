"use strict";
const mongoose = require("mongoose");
const connectToDatabase = require("./db");
const User = require("./user.model.js");
require("dotenv").config({ path: "./variables.env" });

module.exports.hello = (event, context, callback) => {
  console.log("Hello World");
  callback(null, "Hello World");
};

module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    User.create(event)
      .then((user) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(user),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not create the note.",
        })
      );
  });
};

module.exports.getOne = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    User.findById(event.pathParameters.id)
      .then((user) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(user),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not fetch the note.",
        })
      );
  });
};

module.exports.match = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase().then(async () => {
    const user = event;
    const potentialMatches = user.likes;
    const matches = [];
    await Promise.all(
      potentialMatches.map(async (match) => {
        const found = await User.find({ name: `${match}` });
        if (found.length == 0) {
          return;
        }
        //console.log("Successfully found", match, found[0]);
        matches.push(found[0]);
      })
    );
    callback(null, {
      statusCode: 200,
      body: matches,
    });
    mongoose.disconnect();
  });
};

module.exports.getAll = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    User.find()
      .then((user) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(user),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
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
          body: JSON.stringify(user),
        })
      )
      .catch((err) =>
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { "Content-Type": "text/plain" },
          body: "Could not fetch the notes.",
        })
      );
  });
};
