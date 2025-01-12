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
        { text: 'Boards', icon: <DashboardIcon />, path: '/board' },
        { text: 'Members', icon: <GroupIcon />, extra: <AddIcon /> },
        { text: 'Workspace settings', icon: <SettingsIcon /> },
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
                        top: '70px',
                        left: '0',
                        backgroundColor: '#0055CC',
                        color: '#FFFFFF',
                        zIndex: 1300,
                        backgroundColor: '#00487A',
                        '&:hover': {
                            backgroundColor: '#003366',
                        },
                        
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>
            )}

            <Drawer
                variant="persistent"
                anchor="left"
                open={isOpen}
                sx={{
                    '& .MuiDrawer-paper': {
                        top: '55px',
                        width: 280,
                        backgroundColor: '#0055CC',
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
                        padding: '16px',
                        backgroundColor: '#0050CC',
                    }}
                >
                    <div>
                        <h3 style={{ margin: 0 }}>Trello Workspace</h3>
                        <p style={{ margin: 0, fontSize: '12px', color: '#B0C4DE' }}>Premium</p>
                    </div>
                    <IconButton onClick={toggleDrawer} sx={{ color: '#FFFFFF' }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>

                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton  onClick={() => navigate(item.path)} >
                                <ListItemIcon sx={{ color: '#FFFFFF', marginRight: '-20px' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {item.extra && (
                                    <ListItemIcon sx={{ color: '#FFFFFF', justifyContent: 'flex-end' }}>{item.extra}</ListItemIcon>
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <div style={{ padding: '8px 16px', fontSize: '12px', color: '#B0C4DE' }}>PREMIUM</div>
                <List>
                    {premiumItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton>
                                <ListItemIcon sx={{ color: '#FFFFFF', marginRight: '-20px' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {item.extra && (
                                    <ListItemIcon sx={{ color: '#FFFFFF', justifyContent: 'flex-end' }}>{item.extra}</ListItemIcon>
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <div style={{ padding: '8px 16px', fontSize: '12px', color: '#B0C4DE' }}>Your Boards</div>
                <List>
    {boards.map((board) => (
        <ListItem key={board._id} disablePadding>
            <ListItemButton onClick={() => navigate(`/board/${board._id}`)}>
                <ListItemIcon sx={{ color: '#FFFFFF', marginRight: '-20px' }}>
                    <DashboardIcon />
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
