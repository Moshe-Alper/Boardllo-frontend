import React, { useState, useEffect } from 'react'
import { svgService } from '../../../services/svg.service'
import { boardService } from '../../../services/board'


export function LabelPicker({ initialTask, onLabelUpdate }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [labels] = useState([...boardService.getDefaultLabels()])
    const [selectedLabels, setSelectedLabels] = useState(initialTask.labelIds || [])

    useEffect(() => {
        setSelectedLabels(initialTask.labelIds || [])
    }, [initialTask.labelIds])

    function handleLabelToggle(labelId) {
        const newSelectedLabels = selectedLabels.includes(labelId)
            ? selectedLabels.filter(id => id !== labelId)
            : [...selectedLabels, labelId]
        setSelectedLabels(newSelectedLabels)
        onLabelUpdate(initialTask.id, newSelectedLabels)
    }

    function getFilteredLabels() {
        return labels.filter(label =>
            label.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    return (
        <>
            <input
                type="text"
                placeholder="Search labels..."
                className="search-input"
                value={searchTerm}
                onChange={(ev) => setSearchTerm(ev.target.value)}
            />
            <h3 className="picker-title">Labels</h3>
            
            <ul>
                {getFilteredLabels().map(label => (
                    <li key={label.id} className="label-item">
                        <label className="label-container">
                            <input
                                type="checkbox"
                                className="label-checkbox"
                                checked={selectedLabels.includes(label.id)}
                                onChange={() => handleLabelToggle(label.id)}
                            />
                            <span className="checkmark"></span>
                            <div className="label-color" style={{ backgroundColor: label.color }}>
                                <span className="label-title">{label.title}</span>
                            </div>
                            <button className="edit-button">
                                <img src={svgService.pencilIcon} alt="Edit Icon" />
                            </button>
                        </label>
                    </li>
                ))}
            </ul>
        </>
    )
}