import React from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material'
import { Info, ListAlt, Archive, Settings, Brush, Label, Visibility, CopyAll, Share, Close, ExitToApp } from '@mui/icons-material'

export function BoardMenu({ isOpen, toggleMenu }) {
    const menuItems = [
        { icon: <Info />, text: "About this board", subText: "Add a description to your board" },
        { icon: <ListAlt />, text: "Activity" },
        { icon: <Archive />, text: "Archived items" },
        { divider: true },
        { icon: <Settings />, text: "Settings" },
        { icon: <Brush />, text: "Change background" },
        { icon: <Label />, text: "Labels" },
        { icon: <Visibility />, text: "Watch" },
        { icon: <CopyAll />, text: "Copy board" },
        { icon: <Share />, text: "Print, export, and share" },
        { icon: <Close />, text: "Close board" },
        { icon: <ExitToApp />, text: "Leave board" },
    ];

    return (
        <Drawer       
            anchor="right"
            open={isOpen}
            onClose={toggleMenu}
            classes={{ paper: 'custom-drawer' }} 
            sx={{
                
                flexShrink: 0,
                '& .MuiDrawer-paper': { boxShadow: 'none', },
            }}
            BackdropProps={{ invisible: true }}
            >
            <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <h3 style={{ margin: 0, flex: 1, textAlign: 'center' }}>Menu</h3>
                    <IconButton onClick={toggleMenu}>
                     <Close sx={{  }} />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {menuItems.map((item, index) =>
                        item.divider ? (
                            <Divider key={index} />
                        ) : (
                            <ListItem key={index} button>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    secondary={item.subText || null}
                                />
                            </ListItem>
                        )
                    )}
                </List>
            </div>
        </Drawer>
    );
}
