export const SET_MODAL_DATA = 'SET_MODAL_DATA'


const initialState = {
	modalData: null,
}

export function appReducer(state = initialState, action = {}) {    
	switch (action.type) {
		case SET_MODAL_DATA:
			return {
				...state,
				modalData: action.modalData
			}

		default:
			return state
	}
}