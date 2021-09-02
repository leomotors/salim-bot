// * Quotes.ts : Manage all quotes and is responsible of randomize

import * as fs from "fs";
import fetch from "node-fetch";

const SalimAPI = "https://watasalim.vercel.app/api/quotes";

interface QuoteOptions {
    useASQ?: boolean,
    useLocal?: boolean
}

// * Traceback of GetRandomQuote
interface QuoteID {
    type: "ASQ" | "Local",
    id: number
}

interface Quote {
    quote: string,
    id: QuoteID
}

export class Quotes {
    asq_quotes: string[] = [];
    local_quotes: string[] = [];

    constructor(option: QuoteOptions) {
        const useASQ = option.useASQ ?? true;
        const useLocal = option.useLocal ?? true;

        if (useASQ || useLocal) {
            this.importQuotes(useASQ, useLocal);
        }
        else {
            console.log("WARNING: This Bot lost the ability to Assault because Quotes are both disabled");
        }
    }

    async importQuotes(useASQ: boolean, useLocal: boolean): Promise<void> {
        if (useASQ) {
            try {
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
                    if (this.asq_quotes.includes(quote)) {
                        console.log(`[IMPORT ONLINE WARNING] Duplicate Quote: ${quote}`);
                    }
                    else {
                        this.asq_quotes.push(quote);
                    }
                }
                console.log("[FETCH COMPLETE] Retrieved Awesome Salim Quotes");
            }
            catch (err) {
                console.log(`Quotes @ importQuotes: ${err}`);
            }
        }

        if (useLocal) {
            try {
                const buffer: Buffer = fs.readFileSync("./data/morequotes.json");
                const data: string[] = JSON.parse(buffer.toString()).วาทกรรมสลิ่ม;

                for (const quote of data) {
                    if (this.asq_quotes.includes(quote)) {
                        console.log(`[IMPORT LOCAL WARNING] Duplicate with ASQ: ${quote}`);
                    }
                    else if (this.local_quotes.includes(quote)) {
                        console.log(`[IMPORT LOCAL WARNING] Duplicate Quote: ${quote}`);
                    }
                    else {
                        this.local_quotes.push(quote);
                    }
                }

                console.log("[FETCH COMPLETE] Retrieved Local Quotes");
            } catch (err) {
                console.log(`Quotes @ importQuotes: ${err}`);
            }
        }

        return;
    }

    getQuote(id?: QuoteID): Quote {
        if (!id) {
            id = this._randomEvenly();
        }

        if (id.type == "ASQ") {
            return {
                "quote": this.asq_quotes[id.id],
                "id": id
            };
        }
        else if (id.type == "Local") {
            return {
                "quote": this.local_quotes[id.id],
                "id": id
            };
        }
        else {
            console.log(`[WTF HOW? TYPESCRIPT! EXPLAIN ME!] Unexpected ID Type of ${id.type}`);
            return {
                "quote": "I'm Broken, Blame Microsoft",
                "id": id
            };
        }
    }

    _randomEvenly(): QuoteID {
        const totalLength: number = this.asq_quotes.length + this.local_quotes.length;
        const randIndex = Math.floor(Math.random() * totalLength);

        if (randIndex < this.asq_quotes.length) {
            // * Sending ASQ Quotes
            return {
                "type": "ASQ",
                "id": randIndex
            };
        }
        else {
            // * Sending Local Quotes
            return {
                "type": "Local",
                "id": randIndex - this.asq_quotes.length
            };
        }
    }
}
