import {
  FETCH_SHOP_DISCUSSION_REQUEST,
  FETCH_SHOP_DISCUSSION_SUCCESS,
  FETCH_SHOP_DISCUSSION_FAIL,
  POST_SHOP_DISCUSSION_REQUEST,
  POST_SHOP_DISCUSSION_SUCCESS,
  POST_SHOP_DISCUSSION_FAIL
} from '../../constants'
import Api from '../../services/api'

// Action
import * as notificationsActions from './notificationsActions'

// Utils
import i18n from '../../utils/i18n'

export function fetchDiscussion(id = '0', params = { page: 1 }, type = 'E') {
  return dispatch => {
    dispatch({
      type: FETCH_SHOP_DISCUSSION_REQUEST
    })
    return Api.get(
      `/sra_shop_discussion/?object_type=${type}&object_id=${id}&params[page]=${params.page}`
    )

      .then(response => {
        dispatch({
          type: FETCH_SHOP_DISCUSSION_SUCCESS,
          payload: {
            id: `${type.toLowerCase()}_${id}`,
            page: params.page,
            discussion: response.data
          }
        })
        return response
      })
      .catch(error => {
        dispatch({
          type: FETCH_SHOP_DISCUSSION_FAIL,
          error
        })
      })
  }
}

export function postDiscussion(data) {
  return dispatch => {
    dispatch({
      type: POST_SHOP_DISCUSSION_REQUEST
    })

    return Api.post('/sra_shop_discussion', data)
      .then(response => {
        dispatch({
          type: POST_SHOP_DISCUSSION_SUCCESS
        })

        if (response.data.is_approval_required) {
          notificationsActions.show({
            type: 'success',
            title: i18n.t('Thank you for your post.'),
            text: i18n.t('Your post will be checked before it gets published.')
          })(dispatch)
        } else {
          notificationsActions.show({
            type: 'success',
            title: i18n.t('Thank you for your post.'),
            text: i18n.t('Your post published.')
          })(dispatch)
        }

        fetchDiscussion()(dispatch)
      })
      .catch(error => {
        dispatch({
          type: POST_SHOP_DISCUSSION_FAIL,
          error
        })
      })
  }
}

export function sendErrorNotification(title, message) {
  return async dispatch => {
    notificationsActions.show({
      type: 'error',
      title: title,
      text: message
    })(dispatch)
  }
}
