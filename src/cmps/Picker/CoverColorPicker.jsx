import React from 'react'
import PropTypes from 'prop-types'

export function CoverColorPicker({ selectedColor = '', onColorSelect, className = '', title = 'Cover Color' }) {
    const colors = [
        { id: 'blue', value: '#0052cc' },
        { id: 'light-blue', value: '#00c7e5' },
        { id: 'green', value: '#57d9a3' },
        { id: 'yellow', value: '#ffc400' },
        { id: 'orange', value: '#ffab00' },
        { id: 'red', value: '#f99cdb' },
        { id: 'purple', value: '#6554c0' },
        { id: 'light-purple', value: '#8777d9' },
        { id: 'gray', value: '#505f79' },
        { id: 'dark', value: '#172b4d' }
    ]

    function handleColorSelect(color) {
        onColorSelect(color)
    }

    function handleRemoveColor(ev) {
        ev.stopPropagation() 
        onColorSelect('')
    }

    return (
        <div className={`cover-color-picker ${className}`} onClick={ev => ev.stopPropagation()}>
            <h3>{title}</h3>
            <div className="colors-container">
                {colors.map(({ id, value }) => (
                    <button
                        key={id}
                        className={`color-option ${selectedColor === value ? 'selected' : ''}`}
                        style={{ backgroundColor: value }}
                        onClick={(ev) => {
                            ev.stopPropagation()
                            handleColorSelect(value)
                        }}
                        aria-label={`Select ${id} color`}
                    />
                ))}
            </div>
            {selectedColor && (
                <button
                    className="remove-btn"
                    onClick={handleRemoveColor}
                >
                    Remove Cover
                </button>
            )}
        </div>
    )
}

CoverColorPicker.propTypes = {
    selectedColor: PropTypes.string,
    onColorSelect: PropTypes.func.isRequired,
    className: PropTypes.string,
    title: PropTypes.string
}