// * Quotes.ts : Manage all quotes and is responsible of randomize

import * as fs from "fs";
import fetch from "node-fetch";
import Logger from "../utils/Logger";

const SalimAPI = "https://watasalim.vercel.app/api/quotes";
const localQuotesLoc = "./data/morequotes.json";

interface QuoteOptions {
    useASQ?: boolean,
    useLocal?: boolean
}

// * Return Type of GetRandomQuote
interface QuoteID {
    type: "ASQ" | "Local",
    id: number
}

interface Quote {
    quote: string,
    id: QuoteID
}

export default class Quotes {
    static asq_quotes: string[] = [];
    static local_quotes: string[] = [];

    static async construct(option?: QuoteOptions, isReload = false): Promise<void> {
        if (option == null)
            option = {};
        const useASQ = option.useASQ ?? true;
        const useLocal = option.useLocal ?? true;

        if (useASQ || useLocal) {
            Quotes.importQuotes(useASQ, useLocal);
        }
        else {
            Logger.log("WARNING: This Bot lost the ability to Assault because Quotes are both disabled", "WARNING", isReload);
        }
    }

    static async importQuotes(useASQ: boolean, useLocal: boolean): Promise<void> {
        Quotes.asq_quotes = [];
        Quotes.local_quotes = [];

        if (useASQ) {
            try {
                let dupl = 0;
                const response = await fetch(SalimAPI, {
                    method: "GET",
                    headers: { "Content-type": "application/json;charset=UTF-8" }
                });

                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }

                const restext = await response.text();
                const quotes = JSON.parse(restext);

                for (const elem of quotes.quotes) {
                    const quote = elem.body;
                    if (Quotes.asq_quotes.includes(quote)) {
                        dupl++;
                    }
                    Quotes.asq_quotes.push(quote);
                }
                if (dupl > 0) {
                    Logger.log(`[IMPORT ONLINE NOTICE] Detected ${dupl} duplicate quotes`, "WARNING", false);
                }
                Logger.log(`[FETCH COMPLETE] Retrieved ${Quotes.asq_quotes.length} quotes from Awesome Salim Quotes`, "SUCCESS", false);
            }
            catch (err) {
                Logger.log(`[Quotes @ importQuotes] Import Online Quotes Failed: ${err}`, "ERROR", false);
            }
        }

        if (useLocal) {
            try {
                const buffer: Buffer = fs.readFileSync(localQuotesLoc);
                const data: string[] = JSON.parse(buffer.toString()).วาทกรรมสลิ่ม;

                for (const quote of data) {
                    if (Quotes.local_quotes.includes(quote)) {
                        Logger.log(`[IMPORT WARNING] Duplicate Quote: ${quote}`, "WARNING", false);
                    }
                    else
                        Quotes.local_quotes.push(quote);
                }

                Logger.log(`[FETCH COMPLETE] Retrieved ${Quotes.local_quotes.length} quotes from Local Quotes`, "SUCCESS", false);
            } catch (err) {
                Logger.log("Local Quotes not found: You can read instructions for how to add Local Quotes or disable this Warning by disable Local Quotes at Settings", "WARNING", false);
            }
        }

        return;
    }

    static getQuote(id?: QuoteID): Quote {
        if (!id) {
            id = Quotes._randomEvenly();
        }

        if (id.type == "ASQ") {
            return {
                "quote": Quotes.asq_quotes[id.id - 1],
                "id": id
            };
        }
        else if (id.type == "Local") {
            return {
                "quote": Quotes.local_quotes[id.id - 1],
                "id": id
            };
        }
        else {
            Logger.log(`[WTF HOW? TYPESCRIPT! EXPLAIN ME!] Unexpected ID Type of ${id.type}`, "ERROR", false);
            return {
                "quote": "I'm Broken, Blame Microsoft",
                "id": id
            };
        }
    }

    private static _randomEvenly(): QuoteID {
        const totalLength: number = Quotes.asq_quotes.length + Quotes.local_quotes.length;
        const randIndex = Math.floor(Math.random() * totalLength);

        if (randIndex < Quotes.asq_quotes.length) {
            // * Sending ASQ Quotes
            return {
                "type": "ASQ",
                "id": randIndex + 1
            };
        }
        else {
            // * Sending Local Quotes
            return {
                "type": "Local",
                "id": randIndex - Quotes.asq_quotes.length + 1
            };
        }
    }

    static get quotesCount(): number {
        return Quotes.asq_quotes.length + Quotes.local_quotes.length;
    }
}
