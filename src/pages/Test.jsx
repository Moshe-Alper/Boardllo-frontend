import React, { useState } from 'react'
import { Sidebar } from '../cmps/Sidebar'
import { IconButton } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

export function Test() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div>
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />
        </div>
    )
}
