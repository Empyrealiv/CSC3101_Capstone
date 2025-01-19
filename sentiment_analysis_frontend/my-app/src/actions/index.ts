export const MULTI_PREDICT_REQUEST = 'MULTI_PREDICT_REQUEST'
export const MULTI_PREDICT_SUCCESS = 'MULTI_PREDICT_SUCCESS'
export const MULTI_PREDICT_FAILURE = 'MULTI_PREDICT_FAILURE'

export const multiPredictRequest = (payload: any) => ({
    type: MULTI_PREDICT_REQUEST, payload
})

export const multiPredictSuccess = (payload: any) => ({
    type: MULTI_PREDICT_SUCCESS, payload
})

export const multiPredictFailure = (payload: any) => ({
    type: MULTI_PREDICT_FAILURE, payload
})