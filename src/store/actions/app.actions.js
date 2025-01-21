import { store } from '../store'
import { SET_MODAL_DATA, SET_PICKER_DATA } from '../reducers/app.reducer'

export function onToggleModal(modalData = null) {
	store.dispatch({
		type: SET_MODAL_DATA,
		modalData
	})
}

export function onTogglePicker(pickerData = null) {
	store.dispatch({
		type: SET_PICKER_DATA,
		pickerData
	})
}