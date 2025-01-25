import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { onTogglePicker } from '../../store/actions/app.actions'
import { svgService } from '../../services/svg.service'

export function DynamicPicker() {
    const pickerData = useSelector((storeState) => storeState.appModule.pickerData)
    const [position, setPosition] = useState({ top: 0, left: 0 })

    function handleClickOutside(event) {
        if (!event.target.closest('.dynamic-picker')) {
            onClosePicker()
        }
    }

    useEffect(() => {
        if (!pickerData?.triggerEl) return

        function updatePosition() {
            const rect = pickerData.triggerEl.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            const scrollY = window.scrollY
            const pickerHeight = 320

            const spaceBelow = viewportHeight - rect.bottom
            let top, left

            if (rect.left + 300 <= window.innerWidth) {
                left = rect.left
            } else {
                left = Math.max(0, rect.right - 300)
            }

            if (spaceBelow >= pickerHeight) {
                top = rect.bottom + scrollY
            } else if (rect.top > pickerHeight) {
                top = rect.top + scrollY - pickerHeight
            } else {
                top = scrollY
            }

            setPosition({ top, left })
        }

        document.addEventListener('mousedown', handleClickOutside)
        updatePosition()
        window.addEventListener('scroll', updatePosition, true)
        window.addEventListener('resize', updatePosition)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
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
                <h2>{title}</h2>
                <button className="close-button" onClick={onClosePicker}>
                    <img src={svgService.closeIcon} alt="Close" />
                </button>
            </header>
            <section className="picker-content" onClick={(ev) => ev.stopPropagation()}>
                {Cmp && <Cmp {...pickerData.props} />}
            </section>
        </div>
    )
}