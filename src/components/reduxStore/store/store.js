import { configureStore } from '@reduxjs/toolkit'
import profileReducer from '../slice/profileSlice'
import binanceFutureReducer from '../slice/binancefutureSlice'
import  binanceSpotReducer  from '../slice/binancespotSlice'
import bitgetSpotReducer from '../slice/bitgitspotSlice'
import bitgetFutureReducer from '../slice/bitgetfutureSlice'

export default configureStore({
  reducer: {
    getProfile: profileReducer,  // This should match your state access in mapStateToProps
    binanceFuture: binanceFutureReducer,
    binanceSpot : binanceSpotReducer,
    bitgetSpot : bitgetSpotReducer,
    bitgetFuture : bitgetFutureReducer,
  },
})
