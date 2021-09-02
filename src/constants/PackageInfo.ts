// * PackageInfo.ts : Take care of anything about Package

import * as fs from "fs";
import { Logger } from "../utils/Logger";

export class PackageInfo {
    static pkg_info: { version: string } = { version: "unknown" };
    static pkg_version = "unknown";

    static construct(): void {
        try {
            const buffer = fs.readFileSync("./package.json", { encoding: "utf8" });
            this.pkg_info = JSON.parse(buffer.toString());
            this.pkg_version = this.pkg_info.version;
            Logger.log("Successfully gather package.json data", "SUCCESS", false);
        }
        catch (err) {
            Logger.log(`PackageInfo @ construct: ${err}`, "ERROR", false);
        }
    }
}
