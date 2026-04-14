// import { createAuthClient } from "../../infrastructure/auth/authClient";
import { setUser } from "../../storage/stateSlices/authSlice";


export const authRepository = (httpClient, dispatch) => {

    const mock_user = {
        'username': 'dhirajdhananjay4@gmail.com',
        'password': 'hello world'
    }

    const login = async (username, password) => {
        // Mocking the login response for demonstration purposes

        // const response = await httpClient('/login', {
        //     method: 'POST',
        //     body: { 'username': username, 'password': password },
        // });
        const response = await httpClient('/login', {
            method: 'POST',
            body: { 'username': mock_user.username, 'password': mock_user.password },
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


