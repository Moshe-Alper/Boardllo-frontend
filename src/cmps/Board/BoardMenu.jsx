import React, { useState, useEffect } from "react"
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton,} from "@mui/material"
import { Info, ListAlt, Archive, Settings, Brush, Label, Visibility, CopyAll, Share, Close, ExitToApp,} from "@mui/icons-material"
import { ChevronLeft } from "@mui/icons-material"
import { AboutBoard } from "./AboutBoard"

export function BoardMenu({ isOpen, toggleMenu }) {
  const [isAboutBoard, setIsAboutBoard] = useState(false)
  const [description, setDescription] = useState("")

  const admins = [
    { name: "Admin 1", avatar: "https://via.placeholder.com/32" },
    { name: "Admin 2", avatar: "https://via.placeholder.com/32" },
  ];

  useEffect(() => {
    function handleKeyBoardClickMenu(event) {
      if (event.key === "]") {
        toggleMenu()
      }
    }

    window.addEventListener("keydown", handleKeyBoardClickMenu)

    return () => {
      window.removeEventListener("keydown", handleKeyBoardClickMenu)
    };
  }, [toggleMenu])

  const menuItems = [
    {
      icon: <Info />,
      text: "About this board",
      subText: "Add a description to your board",
      action: () => setIsAboutBoard(true),
    },
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
      classes={{ paper: "custom-drawer" }}
      sx={{
        zIndex: 1000,
        flexShrink: 0,
        "& .MuiDrawer-paper": { boxShadow: "none" },
      }}
      BackdropProps={{ invisible: true }}
    >
      <div style={{ padding: "16px", width: 326 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          {isAboutBoard && (
            <IconButton
              onClick={() => setIsAboutBoard(false)}
              style={{ color: "#007bff", marginRight: "8px" }}
            >
              <ChevronLeft />
            </IconButton>
          )}
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: isAboutBoard ? "left" : "center",
              flexGrow: 1,
            }}
          >
            {isAboutBoard ? "About this board" : "Menu"}
          </h3>
          <IconButton
            onClick={toggleMenu}
            style={{
              marginLeft: isAboutBoard ? "auto" : "8px",
            }}
          >
            <Close />
          </IconButton>
        </div>
        <Divider />

        {!isAboutBoard ? (
          <List>
            {menuItems.map((item, index) =>
              item.divider ? (
                <Divider key={`divider-${index}`} />
              ) : (
                <ListItem key={item.text} button onClick={item.action || null}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    secondary={item.subText || null}
                  />
                </ListItem>
              )
            )}
          </List>
        ) : (
          <AboutBoard
            admins={admins}
            description={description}
            setDescription={setDescription}
            onClose={() => setIsAboutBoard(false)} 
          />
        )}
      </div>
    </Drawer>
  )
}
