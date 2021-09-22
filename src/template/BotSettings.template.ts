// * Template for bot_settings.json
export interface BotSettingsType {
    // * Whether allow peoples to do #!salim commands 
    allow_salimshell: boolean,
    // * If above is not allowed, only people lists below here is allowed : **Write User Tag**
    salimshell_insiders: string[],
    // * Reject Training from Everyone
    reject_samkeeb: boolean,
    // * If above is true, Only people lists below here can train
    salim_insiders: string[],
    // * Owner: Can access #!salim sudo **Write User ID**
    owner: string[],
    // * Turn off to ignore messages from other Bot, Recommend if your server is going mess
    aggressive_on_bot: boolean,
}

export const BotSettingsTemplate: BotSettingsType = {
    allow_salimshell: true,
    salimshell_insiders: [],
    reject_samkeeb: false,
    salim_insiders: [],
    owner: ["NO-OWNER"],
    aggressive_on_bot: true
};
