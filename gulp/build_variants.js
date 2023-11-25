/**
 * @type {Record<string, {
 *  standalone: boolean,
 *  environment?: 'dev' | 'staging' | 'prod',
 *  electronBaseDir?: string,
 *  steamAppId?: number,
 *  executableName?: string,
 *  buildArgs: {
 * }}>}
 */
const BUILD_VARIANTS = {
    "web-localhost": {
        standalone: false,
        environment: "dev",
        buildArgs: {},
    },
    "web-shapezio-beta": {
        standalone: false,
        environment: "staging",
        buildArgs: {},
    },
    "web-shapezio": {
        standalone: false,
        environment: "prod",
        buildArgs: {},
    },
};
module.exports = {BUILD_VARIANTS};
