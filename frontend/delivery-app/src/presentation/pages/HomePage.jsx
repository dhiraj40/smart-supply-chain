

const HomePage = ({ user }) => {
    return (
        <div className="container mt-5">
            <h1>Home Page</h1>
            <p>Welcome, {user?.first_name} {user?.last_name}!</p>
        </div>
    )
}

export default HomePage;