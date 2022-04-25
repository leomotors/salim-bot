// @ts-check

/* eslint-disable no-console */

/// <reference lib="es2021" />

import fs from "fs/promises";
import { globbySync } from "globby";

// Make Svelte use Relative Path otherwise GitHub Pages is broken

/**
 * @param {string} fileName
 */
async function GHPagesSvkMahou(fileName) {
  const result = (await fs.readFile(fileName))
    .toString()
    .replaceAll("/_app/", "./_app/");

  await fs.writeFile(fileName, result);

  console.log(`Done with ${fileName}!`);
}

const fileList = globbySync("build/**/*.{html,js}");

console.log(`Items: ${fileList}`);

fileList.map((fname) => GHPagesSvkMahou(fname));
