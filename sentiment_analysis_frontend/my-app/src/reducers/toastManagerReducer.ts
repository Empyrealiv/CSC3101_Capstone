import { IToastState } from '../types/index'

type StateType = {
    toastState: IToastState[]
}

const initialState: StateType = {
    toastState: [],
}

export const toastManagerReducer = (state = initialState, action: {type: string, payload: any}): StateType => {
    switch (action.type) {
        case 'ADD_TOAST':
            return {
                ...state,
                toastState: [...state.toastState, action.payload],
            }
        case 'REMOVE_TOAST':
            return {
                ...state,
                toastState: state.toastState.filter((toast) => toast.id !== action.payload.id),
            }
        default:
            return state
    }
}