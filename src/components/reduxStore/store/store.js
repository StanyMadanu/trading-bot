import { configureStore } from '@reduxjs/toolkit'
import profileReducer from '../slice/profileSlice'
import binanceFutureReducer from '../slice/binancefutureSlice'

export default configureStore({
  reducer: {
    getProfile: profileReducer,  // This should match your state access in mapStateToProps
    binanceFuture: binanceFutureReducer,
  },
})
