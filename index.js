#!/usr/bin/env node
const fs = require("fs");
const process = require("process");
const v = require("voca");
// @TODO fix the link below
const homePath = "/usr/local/lib/node_modules/@ziyadsk/cs";

function displayUsage() {
  console.log("Usage: cs [-html | -css | -js] <SEARCH_TERM>");
}

function getArguments() {
  const allowedArgs = ["-html", "-css", "-js"];
  const command = {
    type: process.argv[2],
    value: process.argv[3]
  };

  if (!allowedArgs.includes(process.argv[2])) {
    console.log(`Invalid option : ${command.type}`);
    displayUsage();
    process.exit();
  } else {
    command.type = command.type.substr(1);
    return command;
  }
}

function displayCheat(type, title, cheatObj) {
  if (cheatObj === undefined) {
    switch (type) {
      case "html":
        console.log("[\033[33;1mNOT FOUND\033[0m]" + ` <${title}> : not found`);
        break;
      case "css":
        console.log(
          "[\033[33;1mNOT FOUND\033[0m] The CSS property that you requested doesn't exist/isn't indexed"
        );
        break;
      case "js":
        console.log("[\033[33;1mNOT FOUND\033[0m]:" + `${title}`);
        break;
      default:
        console.log("something went wrong");
    }
    process.exit();
  }

  let keys = Object.keys(cheatObj);

  let lineSeparator = "━".repeat(72);
  let titleBar = "┏";
  titleBar += lineSeparator;
  titleBar += "┓\n┃\u001b[33;1m ";
  titleBar += v.wordWrap(title, { width: 60 }).padEnd(71);
  titleBar += "\u001b[0m┃\n";
  titleBar += "┣" + lineSeparator + "┫";
  console.log(titleBar);

  // body section
  for (let element in cheatObj) {
    let body = cheatObj[element];
    console.log("┃" + " ".repeat("72") + "┃");

    console.log(
      "┃ ● \033[4;33m" + element + "\033[0m" + "┃".padStart(70 - element.length)
    );
    // console.log("┃");
    body = v.wordWrap(body, { width: 65 }).split("\n");
    console.log("┃" + " ".repeat("72") + "┃");
    for (let e of body) {
      e = "┃" + e + "┃".padStart(73 - e.length);
      console.log(e);
    }
    console.log("┃" + " ".repeat("72") + "┃");
    console.log("┣" + lineSeparator + "┫");
  }
  process.stdout.write("\x1b[1A");
  process.stdout.write("\x1b[2K");
  console.log("┗" + lineSeparator + "┛");
}

function getCheat(getArgs) {
  const command = getArgs();
  fs.readFile(`${homePath}/cheats/en/${command.type}.json`, (err, data) => {
    if (err) {
    }
    const bigList = JSON.parse(data.toString());
    displayCheat(
      command.type,
      command.value,
      bigList[command.value.toString().toLowerCase()]
    );
  });
}

getCheat(getArguments);
