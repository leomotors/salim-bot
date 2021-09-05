// * Import.ts : Import things

import Activity from "../client/Activity";
import Detector from "../core/Detector";
import DJSalima from "../core/DJSalima";
import Quotes from "../core/Quotes";

export default function Import(isReload = false): void {
    Detector.construct(isReload);
    DJSalima.construct(isReload);
    Quotes.construct({}, isReload);
    Activity.construct(isReload);
}
