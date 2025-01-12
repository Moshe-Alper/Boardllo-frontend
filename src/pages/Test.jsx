import React, { useState } from 'react'

import { IconButton } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { BoardSidebar } from '../cmps/Board/BoardSidebar'

export function Test() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div>
            {/* Sidebar */}
            <BoardSidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />
        </div>
    )
}
