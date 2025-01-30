import { v4 as uuidv4 } from 'uuid';

export const UPLOAD_CSV_REQUEST = 'UPLOAD_CSV_REQUEST'
export const UPLOAD_CSV_SUCCESS = 'UPLOAD_CSV_SUCCESS'
export const UPLOAD_CSV_FAILURE = 'UPLOAD_CSV_FAILURE'

export const uploadCSVRequest = () => ({
    type: UPLOAD_CSV_REQUEST
})

export const uploadCSVSuccess = (payload: any) => ({
    type: UPLOAD_CSV_SUCCESS, payload
})

export const uploadCSVFailure = (payload: any) => ({
    type: UPLOAD_CSV_FAILURE, payload
})

export const ADD_TOAST = 'ADD_TOAST'
export const REMOVE_TOAST = 'REMOVE_TOAST'

export const addToast = (message: string) => ({
    type: ADD_TOAST,
    payload: {
      id: uuidv4(),
      message,
    },
  });
  
  export const removeToast = (id: string) => ({
    type: REMOVE_TOAST,
    payload: { id },
  });