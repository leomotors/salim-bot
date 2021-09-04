// * MentionQuery.ts : Response when mentioned

import { Message } from "discord.js";

import { trim } from "../utils/String";

interface Query {
    keywords: string[],
    response: (msg: Message) => void;
}

export class MentionQuery {
    queries: Query[];
    dontSkip: boolean;

    constructor(queries: Query[], dontSkip = false) {
        this.queries = queries;
        this.dontSkip = dontSkip;
    }

    check(msg: Message): boolean {
        let action_taken = false;
        for (const query of this.queries) {
            for (const kw of query.keywords) {
                if (trim(msg.content).includes(kw)) {
                    query.response(msg);
                    if (!this.dontSkip)
                        return true;
                    else
                        action_taken = true;
                }
            }
        }
        return action_taken;
    }
}
