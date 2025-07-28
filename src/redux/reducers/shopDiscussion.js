import {
    FETCH_SHOP_DISCUSSION_REQUEST,
    FETCH_SHOP_DISCUSSION_SUCCESS,
    FETCH_SHOP_DISCUSSION_FAIL,
    POST_SHOP_DISCUSSION_REQUEST,
    POST_SHOP_DISCUSSION_SUCCESS,
    POST_SHOP_DISCUSSION_FAIL,
} from '../../constants'

const initialState = {
  isNewPostSent: false,
  fetching: false,
  discussion: null,
  error: null,
 
}

let items = {}

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_SHOP_DISCUSSION_REQUEST:
      return {
        ...state,
        error: null,
        fetching: true,
        isNewPostSent: false,
        
      }

    case FETCH_SHOP_DISCUSSION_SUCCESS:
      return {
        ...state,
        error: null,
        discussion: action.payload.discussion,
        fetching: false,
        error: null,
      }

    case FETCH_SHOP_DISCUSSION_FAIL:
      return {
        ...state,
        fetching: false,
        error: action.error,
      }

    case POST_SHOP_DISCUSSION_REQUEST:
    case POST_SHOP_DISCUSSION_FAIL:
      return {
        ...state,
        postSentFetching: true,
        fetching: true,
        error: action.error,
      }

    case POST_SHOP_DISCUSSION_SUCCESS:
      return {
        ...state,
        postSentFetching: false,
        fetching: false,
        error: null,
      }

    default:
      return state
  }
}
