import { consoleLog } from '../utils/debuggingFuncs'
import APIClient from '../APIClient'
import jwt_decode from 'jwt-decode';

const getToken = async (userId=undefined) => {
    const user = await APIClient(
        '/auth/get_token',
        {
            method: "POST",
            body: {
                userId
            }
        }
    );
    if (user.error) console.error("Problem in getting token")

    const token = jwt_decode(user.token)

    return {
        ...token,
        token: user.token
    }
}

export { getToken }