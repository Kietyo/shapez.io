/* typehints:start */
import {Application} from "../application";
/* typehints:end */
import {createLogger} from "../core/logging";
import {compressX64} from "../core/lzstring";
import {timeoutPromise} from "../core/utils";
import {T} from "../translations";

const logger = createLogger("puzzle-api");

export class ClientAPI {
    /**
     *
     * @param {Application} app
     */
    constructor(app) {
        this.app = app;

        /**
         * The current users session token
         * @type {string|null}
         */
        this.token = null;
    }

    getEndpoint() {
        if (G_IS_DEV) {
            return "http://localhost:15001";
        }
        if (window.location.host === "beta.shapez.io") {
            return "https://api-staging.shapez.io";
        }
        return "https://api.shapez.io";
    }

    isLoggedIn() {
        return Boolean(this.token);
    }

    /**
     *
     * @param {string} endpoint
     * @param {object} options
     * @param {"GET"|"POST"=} options.method
     * @param {any=} options.body
     */
    _request(endpoint, options) {
        const headers = {
            "x-api-key": "d5c54aaa491f200709afff082c153ef2",
            "Content-Type": "application/json",
        };

        if (this.token) {
            headers["x-token"] = this.token;
        }

        return timeoutPromise(
            fetch(this.getEndpoint() + endpoint, {
                cache: "no-cache",
                mode: "cors",
                headers,
                method: options.method || "GET",
                body: options.body ? JSON.stringify(options.body) : undefined,
            }),
            15000
        )
            .then(res => {
                if (res.status !== 200) {
                    throw "bad-status: " + res.status + " / " + res.statusText;
                }
                return res;
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.error) {
                    logger.warn("Got error from api:", data);
                    throw T.backendErrors[data.error] || data.error;
                }
                return data;
            })
            .catch(err => {
                logger.warn("Failure:", endpoint, ":", err);
                throw err;
            });
    }

    tryLogin() {
        return this.apiTryLogin()
            .then(({ token }) => {
                this.token = token;
                return true;
            })
            .catch(err => {
                logger.warn("Failed to login:", err);
                return false;
            });
    }

    /**
     * @returns {Promise<{token: string}>}
     */
    apiTryLogin() {
        if (!G_IS_STANDALONE) {
            let token = window.localStorage.getItem("steam_sso_auth_token");
            if (!token && G_IS_DEV) {
                token = window.prompt(
                    "Please enter the auth token for the puzzle DLC (If you have none, you can't login):"
                );
                window.localStorage.setItem("dev_api_auth_token", token);
            }
            return Promise.resolve({ token });
        }

        return timeoutPromise(ipcRenderer.invoke("steam:get-ticket"), 15000).then(
            ticket => {
                logger.log("Got auth ticket:", ticket);
                return this._request("/v1/public/login", {
                    method: "POST",
                    body: {
                        token: ticket,
                    },
                });
            },
            err => {
                logger.error("Failed to get auth ticket from steam: ", err);
                throw err;
            }
        );
    }
}
