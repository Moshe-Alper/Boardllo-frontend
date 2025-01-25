import React, { useState } from "react";
import { Avatar, IconButton, Button } from "@mui/material"
import { ChevronLeft, Edit } from "@mui/icons-material"

export function AboutBoard({ admins, description, setDescription, onClose }) {
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [tempDescription, setTempDescription] = useState(description)

  const handleSave = () => {
    setDescription(tempDescription)
    setIsEditingDescription(false)
  };

  const handleCancel = () => {
    setTempDescription(description)
    setIsEditingDescription(false)
  };

  return (

    
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0, textAlign: "center", flexGrow: 1 }}>
        </h3>
        <div style={{ width: "64px" }} />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h4
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Board admins
        </h4>
        <div style={{ display: "flex", gap: "8px" }}>
          {admins.map((admin, idx) => (
            <Avatar
              key={idx}
              src={admin.avatar}
              alt={admin.name}
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid #ddd",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h4
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>Description</span>
          {!isEditingDescription && (
            <Button
              onClick={() => setIsEditingDescription(true)}
              style={{
                marginLeft: "auto",
                padding: "4px 8px",
                textTransform: "none",
                fontSize: "14px",
                color: "#007bff",
              }}
            >
              Edit
            </Button>
          )}
        </h4>
        {isEditingDescription ? (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ddd",
                borderBottom: "none",
                padding: "8px",
                borderRadius: "4px 4px 0 0",
                backgroundColor: "#f4f5f7",
              }}
            >
              <Button style={{ fontSize: "14px", textTransform: "none" }}>
                Aa
              </Button>
              <Button style={{ fontSize: "14px", textTransform: "none" }}>
                B
              </Button>
              <Button style={{ fontSize: "14px", textTransform: "none" }}>
                I
              </Button>
              <Button style={{ fontSize: "14px", textTransform: "none" }}>
                ...
              </Button>
            </div>
            <textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              style={{
                width: "100%",
                height: "100px",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "0 0 4px 4px",
                border: "1px solid #ddd",
              }}
            />
            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
              <Button
                onClick={handleSave}
                variant="contained"
                style={{
                  textTransform: "none",
                  fontSize: "14px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                }}
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                style={{
                  textTransform: "none",
                  fontSize: "14px",
                  color: "#555",
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: "#f9f9f9",
              minHeight: "60px",
              fontSize: "14px",
              color: description ? "#000" : "#999",
              cursor: "default",
            }}
          >
            {description || "Click the edit button to add a description..."}
          </p>
        )}
      </div>

      <div>
        <h4
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Members can...
        </h4>
        <p style={{ marginBottom: "16px", fontSize: "14px", color: "#555" }}>
          Comment on cards
        </p>
        <Button
          variant="outlined"
          style={{
            width: "100%",
            textTransform: "none",
            fontSize: "14px",
            borderRadius: "4px",
          }}
        >
          Change permissions...
        </Button>
      </div>
    </div>
  );
}
