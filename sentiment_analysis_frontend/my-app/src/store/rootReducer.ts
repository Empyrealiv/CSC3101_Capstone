import { combineReducers } from "redux"
import { uploadCSVReducer } from "../reducers/uploadCSVReducer.ts"
import { toastManagerReducer } from "../reducers/toastManagerReducer.ts"

const rootReducer = combineReducers({
    uploadCSV: uploadCSVReducer,
    toastManager: toastManagerReducer
})

export default rootReducer
