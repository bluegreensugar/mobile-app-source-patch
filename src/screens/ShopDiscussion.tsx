import React, { useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Utils
import { format } from 'date-fns'
import i18n from '../utils/i18n'

// Actions
import * as shopDiscussionActions from '../redux/actions/shopDiscussionActions'

// Components
import StarsRating from '../components/StarsRating'
const RATING_STAR_SIZE = 15

const styles = StyleSheet.create({
  container: {
    marginBottom: 30
  },
  buttonAddReviewWrapper: {
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: 'flex-end',
    marginBottom: 10
  },
  buttonText: {
    textAlign: 'right',
    color: '#FF6008'
  },
  titleReviewText: {
    fontSize: 25
  },
  reviewContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#d9d9d9'
  },
  reviewNameStarsDateWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  reviewNameStarsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  reviewName: {
    fontSize: 14,
    marginRight: 5
  },
  reviewDate: {
    color: '#8F8F8F'
  },
  reviewCommentText: {
    fontSize: 14,
    marginBottom: 20,
    color: '#8F8F8F'
  }
})

export const ShopDiscussion = ({
  shopDiscussionActions,
  settings,
  navigation,
  ShopDiscussion: { discussion }
}) => {
  const reviewDate = data => {
    return format(new Date(data * 1000), settings.dateFormat || 'MM/dd/yyyy')
  }
  useEffect(() => {
    shopDiscussionActions.fetchDiscussion()
  }, [])

  if (discussion) {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.buttonAddReviewWrapper}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('NewShopReview')
              }}>
              <Text style={styles.buttonText}>{i18n.t('Write a Review')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={discussion.posts}
            keyExtractor={({ post_id }) => post_id}
            renderItem={({ item }) => (
              <View style={styles.reviewContainer}>
                <View style={styles.reviewNameStarsDateWrapper}>
                  <View style={styles.reviewNameStarsWrapper}>
                    <Text style={styles.reviewName}>{item.name} </Text>
                    <StarsRating
                      size={RATING_STAR_SIZE}
                      isRatingSelectionDisabled
                      value={Number(item.rating_value)}
                    />
                  </View>
                  <Text style={styles.reviewDate}>
                    {reviewDate(item.timestamp)}{' '}
                  </Text>
                </View>
                <Text style={styles.reviewCommentText}>{item.message}</Text>
              </View>
            )}
          />
        </View>
      </>
    )
  }
}

export default connect(
  state => ({
    ShopDiscussion: state.shopDiscussion,
    settings: state.settings
  }),
  dispatch => ({
    shopDiscussionActions: bindActionCreators(shopDiscussionActions, dispatch)
  })
)(ShopDiscussion)
