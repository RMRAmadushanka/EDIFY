/**
 * Http client for keycloak component
 */
import axios from 'axios';
/**
 * authenticate with keycloak as a realm user
 */
export const login = async (username, password) => {
    console.log("Keycloak http client");
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

