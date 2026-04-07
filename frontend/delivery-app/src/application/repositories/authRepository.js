import { createAuthClient } from "../../infrastructure/auth/authClient";
import { setUser } from "../../storage/stateSlices/authSlice";


export const authRepository = (httpClient, dispatch) => {
    // const authClient = createAuthClient(httpClient);

    const login = async (username, password) => {
        const response = await httpClient('/login', {
            method: 'POST',
            body: { 'username': username, 'password': password },
        });
        console.log("Login response:", response);
        const user = response.user_profile;
        dispatch(setUser(user));
    };

    const logout = async () => {
        await httpClient('/logout', {
            method: 'POST',
        });
        dispatch(logout());
    };

    return {
        login,
        logout
    };
};


