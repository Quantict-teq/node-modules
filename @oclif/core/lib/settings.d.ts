export declare type Settings = {
    /**
     * Show additional debug output without DEBUG. Mainly shows stackstraces.
     *
     * Useful to set in the ./bin/dev script.
     * oclif.settings.debug = true;
     */
    debug?: boolean;
    /**
     * The path to the error.log file.
     *
     * NOTE: This is read-only and setting it will have no effect.
     */
    errlog?: string;
    /**
     * Set the terminal width to a specified number of columns (characters)
     *
     * Environment Variable:
     *   OCLIF_COLUMNS=80
     */
    columns?: number;
    /**
     * Try to use ts-node to load typescript source files instead of
     * javascript files.
     *
     * NOTE: This requires registering ts-node first.
     * require('ts-node').register();
     *
     * Environment Variable:
     *   NODE_ENV=development
     */
    tsnodeEnabled?: boolean;
};
export declare const settings: Settings;
