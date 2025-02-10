import React, { useEffect } from 'react'
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
import DashboardIcon from '@mui/icons-material/Dashboard'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

export function BoardSidebar({ isOpen, toggleDrawer, boards = [] }) {
    const navigate = useNavigate()
    useEffect(function() {
        function handleKeyBoardClick(event) {
            if (event.key === '[') {
                toggleDrawer()
            }
        }

        window.addEventListener('keydown', handleKeyBoardClick)

        return function() {
            window.removeEventListener('keydown', handleKeyBoardClick)
        }
    }, [toggleDrawer])

    return (
        <div>
            {!isOpen && (
                <div
                    onClick={toggleDrawer}
                    style={{
                        position: 'fixed',
                        top: '48px',
                        left: '0',
                        height: '100vh',
                        width: '20px',
                        backgroundColor: '#0a3d8f',
                        zIndex: 1200,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                </div>
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

                    <IconButton
                        onClick={toggleDrawer}
                        sx={{
                            color: '#FFFFFF',
                            width: '1.25rem',
                            height: '1.25rem',
                            marginLeft: '3px',
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </div>

                <List
                    sx={{
                        '& .MuiListItemText-primary': {
                            fontSize: '0.875rem',
                        },
                    }}
                >
                    {boards.map(function(board) {
                        return (
                            <ListItem 
                                key={board._id} 
                                disablePadding
                                sx={{
                                    '& .star-border': {
                                        display: 'none'
                                    },
                                    '&:hover .star-border': {
                                        display: 'block'
                                    }
                                }}
                                secondaryAction={
                                    board.isStarred ? (
                                        <StarIcon 
                                            sx={{ 
                                                color: '#FFFFFF',
                                                fontSize: '1.2rem',
                                                marginRight: '12px'
                                            }} 
                                        />
                                    ) : (
                                        <StarBorderIcon 
                                            className="star-border"
                                            sx={{ 
                                                color: '#FFFFFF',
                                                fontSize: '1.2rem',
                                                marginRight: '12px'
                                            }} 
                                        />
                                    )
                                }
                            >
                                <ListItemButton onClick={function() { navigate(`/board/${board._id}`) }}>
                                    <ListItemIcon
                                        sx={{
                                            color: '#FFFFFF',
                                            marginRight: '-1.25rem',
                                            marginLeft: '3px',
                                        }}
                                    >
                                        <DashboardIcon
                                            sx={{
                                                fontSize: '1rem',
                                                marginLeft: '0.25rem',
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={board.title} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Drawer>

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
                        '&:hover': {
                            backgroundColor: '#003366',
                        },
                    }}
                >
                    <ChevronRightIcon
                        sx={{ width: '1rem', height: '1rem', marginLeft: '3px' }}
                    />
                </IconButton>
            )}
        </div>
    )
}