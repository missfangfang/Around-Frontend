import React, { useState } from 'react';
import TopBar from "./TopBar";
import Main from "./Main";
import '../styles/App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const logout = () => {
        console.log("Logout");
        setIsLoggedIn(false);
    }

    return (
        <div className="App">
            <TopBar
                isLoggedIn={isLoggedIn}
                handleLogout={logout}
            />
            <Main />
        </div>
    );
}

export default App;
