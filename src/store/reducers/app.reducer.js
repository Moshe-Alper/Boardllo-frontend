export const SET_MODAL_DATA = 'SET_MODAL_DATA'


const initialState = {
	modalData: null,
}

export function appReducer(state = initialState, cmd = {}) {    
	switch (cmd.type) {
		case SET_MODAL_DATA:
			return {
				...state,
				modalData: cmd.modalData
			}

		default:
			return state
	}
}