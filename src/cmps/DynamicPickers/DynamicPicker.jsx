import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { onTogglePicker } from '../../store/actions/app.actions'
import { svgService } from '../../services/svg.service'

export function DynamicPicker() {
    const pickerData = useSelector((storeState) => storeState.appModule.pickerData)
    const [position, setPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (!pickerData?.triggerEl) return
        
        const updatePosition = () => {
            const rect = pickerData.triggerEl.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            const scrollY = window.scrollY
            const pickerHeight = 320 // Approximate default height
            
            // Calculate available space below the button
            const spaceBelow = viewportHeight - rect.bottom
            
            let top, left
            
            // Horizontal positioning
            // If enough space on right, position to the right of button
            if (rect.left + 300 <= window.innerWidth) { // 300px is assumed picker width
                left = rect.left
            } else {
                // Otherwise, position to the left
                left = Math.max(0, rect.right - 300)
            }
            
            // Vertical positioning
            if (spaceBelow >= pickerHeight) {
                // If enough space below, position below the button
                top = rect.bottom + scrollY
            } else if (rect.top > pickerHeight) {
                // If enough space above, position above the button
                top = rect.top + scrollY - pickerHeight
            } else {
                // If neither above nor below has enough space,
                // position at top of viewport with scrolling
                top = scrollY
            }

            setPosition({ top, left })
        }

        // Initial position
        updatePosition()

        // Update position on scroll and resize
        window.addEventListener('scroll', updatePosition, true)
        window.addEventListener('resize', updatePosition)

        return () => {
            window.removeEventListener('scroll', updatePosition, true)
            window.removeEventListener('resize', updatePosition)
        }
    }, [pickerData?.triggerEl])

    function onClosePicker() {
        onTogglePicker()
    }

    if (!pickerData) return null
    const Cmp = pickerData.cmp
    const title = pickerData.title || 'Picker'

    return (
        <div
            className="dynamic-picker"
            onClick={(ev) => ev.stopPropagation()}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                position: 'absolute',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}
        >
            <header className="picker-header">
                <h3>{title}</h3>
                <button className="close-button" onClick={onClosePicker}>
                    <img src={svgService.closeIcon} alt="Close" />
                </button>
            </header>
            <section className="picker-content">
                {Cmp && <Cmp {...pickerData.props} />}
            </section>
        </div>
    )
}