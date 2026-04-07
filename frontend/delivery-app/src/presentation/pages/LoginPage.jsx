import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {apiClient} from '../../application/api/client'
import { repositories } from '../../application/repositories'

function LoginPage() {
    const dispatch = useDispatch()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const authRepository = repositories(apiClient, dispatch).authRepository;

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            await authRepository.login(username, password);
        } catch (error) {
            console.error('Login failed:', error)
            alert('Login failed: ' + (error.message || 'Unknown error'))
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            <form onSubmit={handleLogin} className="p-4 border rounded" style={{ width: '300px' }}>
                <h2 className="mb-4">Login</h2>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    )

}

export default LoginPage;