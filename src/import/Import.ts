// * Import.ts : Import things

import Activity from "../client/Activity";
import Detector from "../core/Detector";
import DJSalima from "../core/DJSalima";
import Facebook from "../responses/Facebook";
import Quotes from "../core/Quotes";

export default async function Import(isReload = false): Promise<void> {
    Activity.construct(isReload);
    Detector.construct(isReload);
    DJSalima.construct(isReload);
    Facebook.construct(isReload);
    Quotes.construct({}, isReload);
}
