/**
 * Get base URL of Sakai.
 */
function getBaseURL(): string {
    let baseURL = "";
    const match = location.href.match("(https?://[^/]+)/portal");
    if (match) {
        baseURL = match[1];
    }
    return baseURL;
}

export { getBaseURL };
