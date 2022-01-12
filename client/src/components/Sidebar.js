import React, { useState } from 'react';
import './Sidebar.css';
import SidebarOption from './SidebarOption';
import { Avatar, Button } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import HearingIcon from '@material-ui/icons/Hearing';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Link } from 'react-router-dom';

function Sidebar(props) {
   // const [popupOpen, setPopupOpen] = useState(false);

   // const handleOpen = () => {
   //    console.log('we open!')
   //    setPopupOpen(true);
   // };

   // const handleClose = () => {
   //    setPopupOpen(false);
   // };

   const logout = () => {
      console.log('we loggin rrrrrt');
   };

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
                     {/* {popupOpen ? 
                        <div className='popup'>
                           <Dialog 
                              open={popupOpen}
                              onClose={handleClose}
                              aria-labelledby='alert-dialog-title'
                              aria-describedby='alert-dialog-description'
                           >
                              <DialogTitle id='alert-dialog-title'>
                                 {'Logout?'}
                              </DialogTitle>
                              <DialogContent>
                                 <DialogContentText id='alert-dialog-description'>
                                    Are you sure you'd like to logout?
                                 </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                 <Button onClick={handleClose}>Cancel</Button>
                                 <Button onClick={handleClose} autoFocus>Confirm</Button>
                              </DialogActions>
                           </Dialog>      
                        </div>
                     : null} */}
               </div>
      )
}

export default Sidebar;