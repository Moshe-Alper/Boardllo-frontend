import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { onTogglePicker } from '../../store/actions/app.actions'
import { svgService } from '../../services/svg.service'

export function DynamicPicker() {
    const pickerData = useSelector((storeState) => storeState.appModule.pickerData)
    const [position, setPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (pickerData?.triggerEl) {
            const rect = pickerData.triggerEl.getBoundingClientRect()
            const scrollY = window.scrollY

            setPosition({
                top: rect.bottom + scrollY,
                left: rect.left
            })
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
                left: `${position.left}px`
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