import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Actions
import * as shopDiscussionActions from '../redux/actions/shopDiscussionActions'

// Utils
import { format } from 'date-fns'
import i18n from '../utils/i18n'

// Components
import StarsRating from '../components/StarsRating'
const RATING_STAR_SIZE = 25

import theme from '../config/theme'


const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    padding: theme.$containerPadding
  },
  ratingWrapper: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#B3B3B3',
    width: '100%',
    fontSize: 18,
    marginTop: 35,
    paddingBottom: 5
  },
  reviewDate: {
    color: '#8F8F8F'
  },
  sendButton: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.$buttonBackgroundColor,
    paddingVertical: 10,
    borderRadius: theme.$borderRadius
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 22
  }
})
export const NewShopReview = ({
  settings,
  shopDiscussionActions,
  navigation
}) => {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSendReview = async () => {
    await shopDiscussionActions.postDiscussion({
      object_id: '0',
      object_type: 'E',
      rating_value: rating,
      name: name,
      message: comment
    })
    await shopDiscussionActions.fetchDiscussion()
    navigation.pop()
  }

  const reviewDate = () => {
    return format(new Date(), settings.dateFormat || 'MM/dd/yyyy')
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.ratingWrapper}>
          <StarsRating
            size={RATING_STAR_SIZE}
            value={rating}
            isRatingSelectionDisabled={false}
            onFinishRating={value => setRating(value)}
            containerStyle={styles.ratingWrapper}
            isEmpty={true}
          />
          <Text style={styles.reviewDate}>{reviewDate()}</Text>
        </View>
        <TextInput
          numberOfLines={3}
          multiline
          style={{
            ...styles.input
          }}
          value={name}
          placeholder={`${i18n.t('Your name')}*`}
          onChangeText={value => {
            setName(value)
          }}
        />
        <TextInput
          numberOfLines={3}
          multiline
          style={{
            ...styles.input
          }}
          value={comment}
          placeholder={`${i18n.t('Comment')}*`}
          onChangeText={value => {
            setComment(value)
          }}
        />
        {!!rating && !!comment && !!name && (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => handleSendReview()}>
            <Text style={styles.sendButtonText}>
              {i18n.t('send').toUpperCase()}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}

export default connect(
  state => ({
    ShopDiscussion: state.shopDiscussion,
    settings: state.settings
  }),
  dispatch => ({
    shopDiscussionActions: bindActionCreators(shopDiscussionActions, dispatch)
  })
)(NewShopReview)
