import React from 'react';
import { Button } from '@material-ui/core';
import './Logout.css';

function Logout(props) {
    const handleCancel = () => {
        window.location = '/';
    };

    const logout = () => {
        props.logout();
    }

    return (
        <div className='logout'>
            <h1 className='logout-header'>Are you sure you'd like to logout?</h1>
            <div className='buttons'>
                <Button className='logout-button' id='logout-cancel-button' onClick={handleCancel}>Cancel</Button>
                <Button className='logout-button' onClick={logout}>Confirm</Button>
            </div>
        </div>
    )
};

export default Logout;