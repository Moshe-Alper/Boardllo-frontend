import { store } from '../store'

export function onToggleModal(modalData = null) {
	store.dispatch({
		type: SET_MODAL_DATA,
		modalData
	})
}