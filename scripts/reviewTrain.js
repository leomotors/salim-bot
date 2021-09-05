// * reviewTrain.js : Run this when you are approving trained word

import * as fs from "fs";

import chalk from "chalk";
import readline from "readline";
import util from "util";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = util.promisify(rl.question).bind(rl);

const trainFile = "./scripts/train.json";
const quotesFile = "./data/morequotes.json";

const emptyTrain = { data: [] };

var trainQuotes;
try {
    const buffer = fs.readFileSync(trainFile);
    trainQuotes = JSON.parse(buffer.toString());
}
catch (err) {
    console.log(chalk.red("Error Opening Train File, Aborting..."));
    process.exit(1);
}

if (trainQuotes.data.length <= 0) {
    console.log(chalk.yellow("No Quote to train! Aborting..."));
    process.exit(1);
}

var Quotes;
try {
    const buffer = fs.readFileSync(quotesFile);
    Quotes = JSON.parse(buffer.toString());
}
catch (err) {
    console.log("No Quotes file found or error parsing, creating new one");
    Quotes = { วาทกรรมสลิ่ม: [] };
}

for (const train of trainQuotes.data) {
    const trainRequest = `From ${train.trainer} at ${train.time}:\n${train.quote}\nApprove? [y for yes, otherwise no] : `;

    const answer = await question(trainRequest);

    if (answer.toLowerCase()[0] == "y") {
        Quotes.วาทกรรมสลิ่ม.push(train.quote);
    }
}

try {
    fs.writeFileSync(quotesFile, JSON.stringify(Quotes, null, 4));
    fs.writeFileSync(trainFile, JSON.stringify(emptyTrain, null, 4));
}
catch (err) {
    console.log(chalk.red(`Error Occured while saving files: ${err}`));
}

process.exit(0);
