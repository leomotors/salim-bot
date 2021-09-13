// * Import.ts : Import things

import Activity from "../client/Activity";
import BotSettings from "../config/BotSettings";
import Detector from "../core/Detector";
import DJSalima from "../core/DJSalima";
import Facebook from "../responses/Facebook";
import Quotes from "../core/Quotes";
import ShellConfig from "../console/SalimShell";

export default async function Import(isReload = false): Promise<void> {
    Activity.construct(isReload);
    BotSettings.import(isReload);
    Detector.construct(isReload);
    DJSalima.construct(isReload);
    Facebook.construct(isReload);
    Quotes.construct({}, isReload);
    isReload || ShellConfig.loadConfig();
}
