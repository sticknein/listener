import React from 'react';
import './Sidebar.css';
import SidebarOption from './SidebarOption';
import HomeIcon from '@material-ui/icons/Home';
import HearingIcon from '@material-ui/icons/Hearing';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Link } from 'react-router-dom';

function Sidebar() {
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
                  <Link to='/logout' style={{ textDecoration: 'none' }}>
                     <SidebarOption Icon={MoreHorizIcon} text='Logout' />
                  </Link>
               </div>
      )
}

export default Sidebar;