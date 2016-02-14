import * as EditorReducers from './editor/reducers'
import * as RuntimeReducers from './runtime/reducers'

const MergedReducers = Object.assign({}, EditorReducers, RuntimeReducers);
console.log(MergedReducers);
