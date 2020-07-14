import combineReducers from 'react-combine-reducers';
import { popupReducer, popupInitialState } from './popupReducer'
import { generalReducer, generalInitialState } from './generalTabReducer'
import { mappingReducer, mappingInitialState } from './mappingTabReducer'

const [reducer, initialState] = combineReducers({
    popup: [popupReducer, popupInitialState],
    generalTab: [generalReducer, generalInitialState],
    mappingTab: [mappingReducer, mappingInitialState]
});

export { reducer, initialState }

