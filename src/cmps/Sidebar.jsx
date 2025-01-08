import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import { Calendar1Icon} from 'lucide-react';

export function Sidebar({ isOpen, toggleDrawer }) {
    const menuItems = [
        { icon: <ChevronLeftIcon />, isToggle: true },
        { text: 'Boards', icon: <DashboardIcon /> },
        { text: 'Members', icon: <GroupIcon /> },
        { text: 'Calendar', icon: <Calendar1Icon /> },
        { text: 'Settings', icon: <SettingsIcon /> },
    ];

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={isOpen}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 240,
                    marginTop: '57px', 
                    height: 'calc(100% - 64px)',
                    boxSizing: 'border-box',
                    backgroundColor: '#026AA7',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
            }}
        >
            <div className="sidebar">
                <div className="sidebar-header">
                    <IconButton onClick={toggleDrawer} className="toggle-btn">
                        <ChevronLeftIcon />
                    </IconButton>
                </div>

                <List>
                    {menuItems.map((item, index) =>
                        item.isToggle ? null : (
                            <ListItem key={index} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon sx={{ color: '#FFFFFF' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        )
                    )}
                </List>
            </div>
        </Drawer>
    );
}
