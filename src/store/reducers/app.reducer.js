export const SET_MODAL_DATA = 'SET_MODAL_DATA'
export const SET_PICKER_DATA = 'SET_PICKER_DATA'

const initialState = {
	modalData: null,
	pickerData: null
}

export function appReducer(state = initialState, action = {}) {    
	switch (action.type) {
		case SET_MODAL_DATA:
			return {
				...state,
				modalData: action.modalData
			}
			break
		case SET_PICKER_DATA:
			return {
				...state,
				pickerData: action.pickerData
			}
			break
		default:
			return state
	}
}