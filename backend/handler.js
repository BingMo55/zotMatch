"use strict";

const connectToDatabase = require("./db");
const Note = require("./notes.model.js");
require("dotenv").config({ path: "./variables.env" });

module.exports.hello = (event, context, callback) => {
  console.log("Hello World");
  callback(null, "Hello World");
};

module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase().then(() => {
    Note.create(JSON.parse(event.body))
      .then((note) =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(note),
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
