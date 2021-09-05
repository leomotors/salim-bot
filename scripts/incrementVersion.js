// * Increment Build Number by 1

import * as fs from "fs";
import chalk from "chalk";

var package_data = JSON.parse(fs.readFileSync("./package.json").toString());
const version = package_data.version;
var vers = version.split(".");

var botVersion = parseInt(vers[2]);
var newversion = vers[0] + "." + vers[1] + "." + (botVersion + 1).toString();
package_data.version = newversion;

fs.writeFileSync("./package.json", JSON.stringify(package_data, null, 2));

console.log(chalk.green(`[incrementVersion.js] Build Number Incremented : ${botVersion} -> ${botVersion + 1}`));
