import { combineReducers } from "redux"
import { multiPredictReducer } from "../reducers/multiPredictReducer.ts"

const rootReducer = combineReducers({
    multiPredict: multiPredictReducer
})

export default rootReducer
