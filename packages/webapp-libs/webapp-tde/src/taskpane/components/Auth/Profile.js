import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const { user, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
    const [idToken, setIdToken] = useState(null);

    const handleGetIdToken = async () => {
        try {
            const idToken = await getIdTokenClaims();
            console.log('ID Token:', idToken);
            setIdToken(idToken.__raw);
        } catch (error) {
            console.error('Error fetching ID Token:', error);
        }
    };

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                {idToken && <p>{idToken}</p>}
                <button onClick={handleGetIdToken}>Print Id Token</button>
            </div>
        )
    );
};

export default Profile;