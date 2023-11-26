/**
 * Generates a cachebuster string. This only modifies the path in the browser version
 * @param {string} path
 */
export function cachebust(path) {
    if (G_IS_BROWSER && !false && !G_IS_DEV) {
        return "/v/" + G_BUILD_COMMIT_HASH + "/" + path;
    }
    return path;
}
