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
import Api from '../../services/api'
import config from '../../config'

// Action
import * as notificationsActions from './notificationsActions'

// Utils
import i18n from '../../utils/i18n'

export function fetchStaffs(id = '', params = { page: 1 }) {
  return dispatch => {
    dispatch({
      type: FETCH_STAFFS_REQUEST
    })
    return Api.get(`/sra_staffs`)
      .then(response => {
        dispatch({
          type: FETCH_STAFFS_SUCCESS,
          payload: {
            staffs: response.data
          }
        })
        return response
      })
      .catch(error => {
        dispatch({
          type: FETCH_STAFFS_FAIL,
          error
        })
      })
  }
}

export function fetchStaff(id = '', params = { page: 1 }) {
  return dispatch => {
    dispatch({
      type: FETCH_STAFF_REQUEST
    })
    return Api.get(`/sra_staffs/${id}`)
      .then(response => {
        dispatch({
          type: FETCH_STAFF_SUCCESS
        })
        return response.data
      })
      .catch(error => {
        dispatch({
          type: FETCH_STAFF_FAIL,
          error
        })
      })
  }
}

export function updateStaff(formData) {
  return dispatch => {
    dispatch({
      type: UPDATE_STAFF_REQUEST
    })
    const response = fetch(`${config.baseUrl}sra_staffs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Storefront-Api-Access-Key': `${config?.apiKey}`
      },
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        dispatch({
          type: UPDATE_STAFF_SUCCESS,
          payload: {
            staff: response
          }
        })
        fetchStaffs()(dispatch)
      })
      .catch(error => {
        dispatch({
          type: UPDATE_STAFF_FAIL,
          error
        })
      })
  }
}

export function postStaff(formData) {
  return dispatch => {
    dispatch({
      type: CREATE_STAFF_REQUEST
    })

    const response = fetch(`${config.baseUrl}sra_staffs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Storefront-Api-Access-Key': `${config?.apiKey}`
      },
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        dispatch({
          type: CREATE_STAFF_SUCCESS
        })
        fetchStaffs()(dispatch)
      })
      .catch(error => {
        dispatch({
          type: CREATE_STAFF_FAIL,
          error
        })
      })
  }
}
