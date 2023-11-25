/**
 * @type {Record<string, {
 *  standalone: boolean,
 *  environment?: 'dev' | 'staging' | 'prod',
 *  electronBaseDir?: string,
 *  steamAppId?: number,
 *  executableName?: string,
 *  buildArgs: {
 *      chineseVersion?: boolean,
 *      wegameVersion?: boolean,
 *      steamDemo?: boolean,
 *      gogVersion?: boolean
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
    "standalone-steam": {
        standalone: true,
        executableName: "shapez",
        steamAppId: 1318690,
        buildArgs: {},
    },
};
module.exports = { BUILD_VARIANTS };
