// import { createAuthClient } from "../../infrastructure/auth/authClient";
import { setUser, logout as logoutAction } from "../../storage/stateSlices/authSlice";

const mock_user = {
    username: 'dhirajdhananjay4@gmail.com',
    password: 'hello world',
};

export const authRepository = (httpClient, dispatch) => {
    const login = async (username, password) => {
        // Mocking the login response for demonstration purposes
        const response = await httpClient('/login', {
            method: 'POST',
            body: { username: mock_user.username, password: mock_user.password },
        });
        console.log("Login response:", response);
        const user = response.user_profile;
        dispatch(setUser(user));
    };

    const logout = async () => {
        await httpClient('/logout', {
            method: 'POST',
        });
        dispatch(logoutAction());
    };

    return {
        login,
        logout,
    };
};

export const mockAuthRepository = (dispatch) => {
    const mockProfile = {
        username: mock_user.username,
        first_name: "Dhiraj",
        last_name: "Dhananjay",
        email: mock_user.username,
    };

    const login = async (username, password) => {
        // if (username !== mock_user.username || password !== mock_user.password) {
        //     throw new Error('Invalid username or password');
        // }
        dispatch(setUser(mockProfile));
        return mockProfile;
    };

    const logout = async () => {
        dispatch(logoutAction());
    };

    return {
        login,
        logout,
    };
};


