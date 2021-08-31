import React from 'react';
import './Sidebar.css';
import HomeIcon from '@material-ui/icons/Home';
import HearingIcon from '@material-ui/icons/Hearing';
import SidebarOption from './SidebarOption';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { Avatar, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

function Sidebar(props) {
    return (
                <div className='sidebar'>
                    <HearingIcon className='sidebar-listenerIcon'/> 

                    <Link to='/' style={{ textDecoration: 'none' }}>
                       <SidebarOption Icon={HomeIcon} text='Home'/> 
                    </Link>
                    <Link style={{ textDecoration: 'none' }}>
                       <SidebarOption Icon={NotificationsIcon} text='Notifications' /> 
                    </Link>
                    <Link style={{ textDecoration: 'none' }}>
                       <SidebarOption Icon={MailOutlineIcon} text='Messages' /> 
                    </Link>
                    <Link to='/profile' style={{ textDecoration: 'none' }}>
                       <SidebarOption Icon={PermIdentityIcon} text='Profile' /> 
                    </Link>

                    <Button variant='outlined' className='sidebar-post' fullWidth>Post</Button>
                </div>
        )
}

export default Sidebar;