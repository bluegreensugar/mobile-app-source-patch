import {
    FETCH_STAFFS_REQUEST,
    FETCH_STAFFS_FAIL,
    FETCH_STAFFS_SUCCESS,
    FETCH_STAFF_REQUEST,
    FETCH_STAFF_FAIL,
    FETCH_STAFF_SUCCESS,
    UPDATE_STAFF_REQUEST,
    UPDATE_STAFF_FAIL,
    UPDATE_STAFF_SUCCESS,
    DELETE_STAFF_REQUEST,
    DELETE_STAFF_FAIL,
    DELETE_STAFF_SUCCESS,
    CREATE_STAFF_REQUEST,
    CREATE_STAFF_FAIL,
    CREATE_STAFF_SUCCESS
} from '../../constants'

const initialState = {
    page: 1,
    staffs: '',
    error: null
}



export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_STAFFS_REQUEST:
        return {
            ...state,
            error: null,
            fetching: true
        }
    
    case FETCH_STAFFS_SUCCESS:
            
        return{
            ...state,
            staffs: action.payload.staffs,
            fetching: false,
            
        }
    case FETCH_STAFFS_FAIL:
        return{
            ...state,
            error: action.error,
            fetching:false
        }
    case FETCH_STAFF_REQUEST:
         return {
            ...state,
            error: null,
            fetching: true
        }
    case FETCH_STAFF_SUCCESS:
        return{
            ...state,
            fetching: false,
            
        }
    case FETCH_STAFF_FAIL:
         return{
            ...state,
            error: action.error,
            fetching:false
        }
    
    case UPDATE_STAFF_REQUEST:
        return {
            ...state,
            error: null,
            fetching: true
        }
    case UPDATE_STAFF_FAIL:
        return{
            ...state,
            error: action.error,
            fetching:false
        }
    case UPDATE_STAFF_SUCCESS:
        return{
            ...state,
            staff: action.payload.staff,
            fetching: false,
            
        }
    case DELETE_STAFF_REQUEST:
    case DELETE_STAFF_FAIL:
    case DELETE_STAFF_SUCCESS:
    case CREATE_STAFF_REQUEST:
        return {
                    ...state,
                    error: null,
                    fetching: true
                }
    case CREATE_STAFF_FAIL:
        return{
            ...state,
            error: action.error,
            fetching:false
        }
    case CREATE_STAFF_SUCCESS: 
        return{
            ...state,
            fetching: false,
            
        }
    default:
        return state
  }
}