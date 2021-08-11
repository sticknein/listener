import React from 'react';

function CreateAccount(props) {
    // [user, setUser] = useState(null);

    return (
        <div className='createAccount'>
            <h1>Create dat account bb</h1>
            <div id='firebaseui-auth-container'></div>
            <div id='loader'>Loading...</div>   
        </div>
    )
}

export default CreateAccount;