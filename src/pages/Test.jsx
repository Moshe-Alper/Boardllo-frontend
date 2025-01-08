import React, { useState } from 'react';
import { Sidebar } from '../cmps/Sidebar';
import { Button } from '@mui/material';


export function Test() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <Button variant="contained" onClick={toggleSidebar}>
                Toggle Sidebar
            </Button>
            <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />
       
        </div>
    );
}
