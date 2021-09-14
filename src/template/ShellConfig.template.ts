// * Template for ShellConfig.json (Internal Only)

export interface ShellConfig {
    config: {
        disabled: string[],
        tiedVoice: string
    }
}

export const ShellConfigTemplate = {
    config: {
        disabled: [],
        tiedVoice: ""
    }
};
