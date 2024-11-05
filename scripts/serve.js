"use strict";

const path = require("path");
const express = require("express");
const { getPortPromise: getPort } = require("portfinder");
const { OUT_DIRNAME } = require(__dirname + "/../webpack");

const directory = path.resolve(__dirname, OUT_DIRNAME);
const app = express();

app.use(express.static(directory));

getPort({ port: 9090 })
  .then(port => {
    app
      .listen(port)
      .once("listening", () => handleUp(port))
      .once("error", handleError);
  })
  .catch(handleError);

function handleUp(port) {
  console.log(`Listening on http://localhost:${port}`);
}

function handleError(error) {
  console.error(error);
  process.exit(1);
}
