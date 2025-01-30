import { IUploadCSVResponseItem } from '../types/index'

type StateType = {
    data: IUploadCSVResponseItem[]
    isLoading: boolean
    error: any
}

const initialState: StateType = {
    data: [],
    isLoading: false,
    error: undefined
}

export const uploadCSVReducer = (state = initialState, action: {type: string, payload: any}): StateType => {
    switch (action.type) {
        case 'UPLOAD_CSV_REQUEST':
            return {
                ...state,
                isLoading: true,
                error: undefined
            }
        case 'UPLOAD_CSV_SUCCESS':
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                error: undefined
            }
        case 'UPLOAD_CSV_FAILURE':
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state
    }
}