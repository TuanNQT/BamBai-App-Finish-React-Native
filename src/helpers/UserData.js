
import React, { useState } from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {

    const [UserID, setUserID] = useState(0);
    const [UsenName,setUserName]=useState('')
    return (
        <UserContext.Provider value={{userIDcontext: [ UserID, setUserID ],userNamecontext:[UsenName,setUserName]} }>
            { children }
        </UserContext.Provider>
    );
};

export default UserContext;