import React, { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { ThemeProvider, createTheme } from "@mui/material";
import Header from "../Header";
import { rexThemeSpec } from "../../rexTheme.js";

const theme = createTheme(rexThemeSpec("Web"));
const Auth: React.FC = () => {
    const { loginWithPopup, user, isAuthenticated, isLoading, logout, getIdTokenClaims } = useAuth0();
    const [idToken, setIdToken] = useState(null);
    const [fetchedUser, setFetchedUser] = useState(null);
    
    const handleGetIdToken = async () => {
        try {
            const idToken = await getIdTokenClaims();
            console.log('ID Token:', idToken);
            setIdToken(idToken.__raw);
        } catch (error) {
            console.error('Error fetching ID Token:', error);
        }
    };
    
    const fetchUserDetails = async () => {
        const response = await fetch('/api/get-user-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken.__raw}`,
            },
        });

        if (response.ok) {
            const userDetails = await response.json();
            setFetchedUser(userDetails);
            console.log('Fetched User Details:', userDetails);
        } else {
            console.error('Error fetching user details:', response.statusText);
        }
    };

    const handleLogin = () => {
        // Check if an ID Token is provided
        if (idToken) {
            // Use loginWithRedirect with the id_token_hint parameter to authenticate the user
            loginWithPopup({
                //login_hint: `id_token_hint=${idToken}`,
            });
        } else {
            console.error('Please provide an ID Token.');
        }
    };
    
    return (
        <ThemeProvider theme={theme}>
            {
                isAuthenticated && (
                    <>
                        <div>
                            <img src={user.picture} alt={user.name} />
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                            {idToken && <p>{idToken}</p>}
                            <button onClick={handleGetIdToken}>Print Id Token</button>
                        </div>
                        <button onClick={() => logout()}>Log Out</button>
                    </>
                )
            }
            {
                !isAuthenticated && (
                    <>
                        <button onClick={() => loginWithPopup()}>Log In</button>
                        <span>OR</span>
                        <div>
                            <h2>Login with ID Token</h2>
                            <label>
                                Paste ID Token here:
                                <input
                                    type="text"
                                    value={idToken}
                                    onChange={(e) => setIdToken(e.target.value)}
                                />
                            </label>
                            <button onClick={handleLogin}>Login</button>
                        </div>
                    </>
                )
            }
        </ThemeProvider>
    );
}

export default Auth;
