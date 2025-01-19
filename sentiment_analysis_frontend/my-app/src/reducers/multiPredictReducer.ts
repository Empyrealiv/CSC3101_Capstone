import { IMultiPredictResponse } from '../types/index'

type StateType = {
    data: IMultiPredictResponse[]
    isLoading: boolean
    error: any
}

const initialState: StateType = {
    data: [],
    isLoading: true,
    error: undefined
}

export const multiPredictReducer = (state = initialState, action: {type: string, payload: any}): StateType => {
    switch (action.type) {
        case 'MULTI_PREDICT_REQUEST':
            return {
                ...state,
                isLoading: true,
                error: undefined
            }
        case 'MULTI_PREDICT_SUCCESS':
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                error: undefined
            }
        case 'MULTI_PREDICT_FAILURE':
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state
    }
}