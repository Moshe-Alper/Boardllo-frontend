import React from 'react'
import { useNavigate } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddIcon from '@mui/icons-material/Add'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import SettingsIcon from '@mui/icons-material/Settings'
import TableChartIcon from '@mui/icons-material/TableChart'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

export function BoardSidebar({ isOpen, toggleDrawer, boards = [] }) {
    const navigate = useNavigate()
    const menuItems = [
        { text: 'Boards', icon: <DashboardIcon sx={{ fontSize: '1rem', marginLeft: '0.25rem' }} />, path: '/board' },
        { text: 'Members', icon: <GroupIcon sx={{ fontSize: '1rem', marginLeft: '0.25rem' }} />, extra: <AddIcon sx={{ fontSize: '1rem', marginLeft: '3px' }} /> },
       
    ]

    const premiumItems = [
        { text: 'Table', icon: <TableChartIcon />, extra: <AddIcon /> },
        { text: 'Calendar', icon: <CalendarTodayIcon /> },
    ]

    const boardItems = [
        { text: 'Team-Sprint 4', icon: <DashboardIcon /> },
    ]

    return (
        <div>
            {!isOpen && (
                <IconButton
                    onClick={toggleDrawer}
                    sx={{
                        position: 'fixed',
                        top: '65px',
                        left: '5px',
                        height: '1.5rem',
                        width: '1.5rem',
                        border: '#rgba(200, 186, 186, 0.22) solid 1px',
                        backgroundColor: '#0055CC',
                        color: '#FFFFFF',
                        zIndex: 1300,
                        backgroundColor: '#00487A',
                        '&:hover': {
                            backgroundColor: '#003366',
                        },

                    }}
                >
                    <ChevronRightIcon sx={{ width: '1rem', height: '1rem', marginLeft: '3px' }} />
                </IconButton>
            )}

            <Drawer
                variant="persistent"
                anchor="left"
                open={isOpen}
                sx={{
                    '& .MuiDrawer-paper': {
                        top: '48px',
                        height: '100vh',
                        width: 280,
                        backgroundColor: '#0a3d8f',
                        color: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '3.5rem',
                        paddingLeft: '1rem',
                        borderBottom: '0.5px solid rgba(208, 198, 198, 0.22)',
                        backgroundColor: '#0a3d8f',
                    }}
                >
                    <div>
                        <h3 style={{ margin: 0, fontSize: '0.875rem' }}>Bordello Workspace</h3>
                    </div>
                    <IconButton onClick={toggleDrawer} sx={{ color: '#FFFFFF', width: '1.25rem', height: '1.25rem', marginLeft: '3px' }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>

                <List sx={{ 
                    '& .MuiListItemText-primary': { 
                        fontSize: '0.875rem'  // 14px for menu items
                    } 
                }}>
                    {menuItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => navigate(item.path)} >
                                <ListItemIcon sx={{ color: '#FFFFFF', marginRight: '-1.25rem', marginLeft: '3px' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {item.extra && (
                                    <ListItemIcon sx={{ color: '#FFFFFF', justifyContent: 'flex-end', marginLeft: '3px' }}>{item.extra}</ListItemIcon>
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {/* <div style={{ padding: '8px 16px', fontSize: '0.75rem', color: '#B0C4DE' }}>PREMIUM</div>
                <List>
                    {premiumItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton>
                                <ListItemIcon sx={{ color: '#FFFFFF', marginRight: '-1.25rem', marginLeft: '3px' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {item.extra && (
                                    <ListItemIcon sx={{ color: '#FFFFFF', justifyContent: 'flex-end', marginLeft: '3px' }}>{item.extra}</ListItemIcon>
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List> */}

                <div style={{ padding: '8px 16px', fontSize: '1rem', color: '#B0C4DE' }}>Your Boards</div>
                <List sx={{
                    '& .MuiListItemText-primary': {
                        fontSize: '0.875rem' // This sets the font size to 14px for board items only
                    }
                }}>
                    {boards.map((board) => (
                        <ListItem key={board._id} disablePadding>
                            <ListItemButton onClick={() => navigate(`/board/${board._id}`)}>
                                <ListItemIcon sx={{ color: '#FFFFFF', marginRight: '-1.25rem', marginLeft: '3px' }}>
                                <DashboardIcon sx={{ fontSize: '1rem', marginLeft: '0.25rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={board.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </div>
    )
}
