/**
 * Http client for keycloak component
 */
import axios from 'axios';
/**
 * authenticate with keycloak as a realm user
 */
export const login = async (username, password) => {
    let url = `${process.env.KEYCLOAK_URL}/realms/${process.env.REALM_NAME}/protocol/openid-connect/token`
    const params = new URLSearchParams();

    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('username', username);
    params.append('password', password);
    params.append('scope', 'openid profile');
    params.append('grant_type', 'password');
    return axios.post(url, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
/**
 * Log out from keycloak
 */
export const logOut = async (refreshToken) => {
    let url = `${config.keyClock.url}/realms/${config.keyClock.realm}/protocol/openid-connect/logout`
    const params = new URLSearchParams();

    params.append('client_id', config.keyClock.clientId);
    params.append('client_secret', config.keyClock.clientSecret);
    params.append('refresh_token', refreshToken);
    return axios.post(url, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
