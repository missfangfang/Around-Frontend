import React, { useState } from 'react';
import TopBar from "./TopBar";
import Main from "./Main";
import '../styles/App.css';
import { TOKEN_KEY } from "../constants";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem(TOKEN_KEY) ? true : false
    );

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setIsLoggedIn(false);
        console.log("Logout successful");
    }

    const loggedIn = token => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
            setIsLoggedIn(true);
            console.log("Login successful");
        }
    }

    return (
        <div className="App">
            <TopBar isLoggedIn={isLoggedIn} handleLogout={logout} />
            <Main handleLoggedIn={loggedIn} isLoggedIn={isLoggedIn} />
        </div>
    );
}

export default App;
