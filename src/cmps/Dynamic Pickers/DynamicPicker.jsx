import React from 'react'
import { useSelector } from 'react-redux'
import { onTogglePicker } from '../../store/actions/app.actions'


export function DynamicPicker() {
    const pickerData = useSelector((storeState) => storeState.appModule.pickerData)

    function onClosePicker() {
        onTogglePicker()
    }

    if (!pickerData) return null
    const Cmp = pickerData.cmp

    return (
        <div className="dynamic-picker-overlay" onClick={onClosePicker}>
            <div className="dynamic-picker" onClick={(e) => e.stopPropagation()}>
                <section className="picker-content">
                    {Cmp && <Cmp {...pickerData.props} />}
                </section>
            </div>
        </div>
    )
}
