import React, { useState, useLayoutEffect, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Alert,
  I18nManager
} from 'react-native'
import theme from '../config/theme'
import { SwipeListView } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/Ionicons'

// Actions
import * as wishListActions from '../redux/actions/wishListActions'

// Components
import MyIcon from '../components/Icon'
import { AddToCartWithAmount } from '../components/AddToCartWithAmount'

// Utils
import i18n from '../utils/i18n'
import { formatPrice, getImagePath } from '../utils'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  productItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F1F1F1',
    flexDirection: 'row',
    paddingBottom: 10,
    padding: 14,
    width: '100%',
    overflow: 'hidden'
  },
  productItemImage: {
    width: 100,
    height: 100
  },
  productItemDetail: {
    backgroundColor: '#fff',
    marginLeft: 14,
    width: '70%'
  },
  productItemName: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  productItemPrice: {
    fontSize: 11,
    color: 'black',
    textAlign: 'left'
  },
  emptyListContainer: {
    marginTop: 48,
    flexDirection: 'column',
    alignItems: 'center'
  },
  emptyListIconWrapper: {
    backgroundColor: '#3FC9F6',
    width: 192,
    height: 192,
    borderRadius: 92,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyListIcon: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 92
  },
  emptyListHeader: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 16,
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: 'center'
  },
  backTextWhite: {
    color: '#FFF'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75
  },
  backRightBtnRight: {
    backgroundColor: 'tomato',
    right: 0
  },
  cartButtonSwitcher: {
    flexDirection: 'column'
  }
})

export const WishListScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const wishList = useSelector(state => state.wishList)

  useLayoutEffect(() => {
    const fetchData = async () => {
      await dispatch(wishListActions.fetch())
    }
    fetchData()
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const setShareIcon = () => {
      return (
        <Icon.Button
          onPress={() => {
            Alert.alert(
              i18n.t('Clear wish list?'),
              '',
              [
                {
                  text: i18n.t('Cancel'),
                  onPress: () => null,
                  style: 'cancel'
                },
                {
                  text: i18n.t('Ok'),
                  onPress: () => dispatch(wishListActions.clear())
                }
              ],
              { cancelable: true }
            )
          }}
          name={'trash-outline'}
          size={25}
          activeOpacity={1}
          backgroundColor={theme.$navBarBackgroundColor}
          borderRadius={0}
          color={theme.$navBarButtonColor}
        />
      )
    }

    navigation.setOptions({
      headerRight: () => setShareIcon()
    })
  }, [])

  const handleRemoveProduct = async product => {
    dispatch(wishListActions.remove(product.cartId))
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    await dispatch(wishListActions.fetch())
    setIsLoading(false)
  }

  const renderProductItem = item => {
    let productImage = null
    const imageUri = getImagePath(item)
    if (imageUri) {
      productImage = (
        <Image source={{ uri: imageUri }} style={styles.productItemImage} />
      )
    }

    return (
      <TouchableHighlight
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            pid: item.product_id,
            hideWishList: true
          })
        }>
        <View style={styles.productItem}>
          {productImage}
          <View style={styles.productItemDetail}>
            <Text style={styles.productItemName} numberOfLines={1}>
              {item.product}
            </Text>
            <Text style={styles.productItemPrice}>
              {item.display_amount} x {formatPrice(item.price_formatted.price)}
            </Text>
            <View style={styles.cartButtonSwitcher}>
              <AddToCartWithAmount item={item} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  const renderEmptyList = () => {
    if (isLoading) {
      return null
    }

    return (
      <View style={styles.emptyListContainer}>
        <View style={styles.emptyListIconWrapper}>
          <MyIcon name="favorite" style={styles.emptyListIcon} />
        </View>
        <Text style={styles.emptyListHeader}>
          {i18n.t('Your wish list is empty.')}
        </Text>
      </View>
    )
  }

  const renderHiddenItem = (rowData, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => {
            handleRemoveProduct(rowData.item)
            rowMap[rowData.item.product_id].closeRow()
          }}>
          <Text style={styles.backTextWhite}>{i18n.t('Delete')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderList = item => {
    if (!wishList.items.length) {
      return renderEmptyList()
    }
    return (
      <View style={styles.container}>
        <SwipeListView
          data={wishList.items}
          renderItem={({ item }) => renderProductItem(item)}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={I18nManager.isRTL ? 75 : 1}
          rightOpenValue={I18nManager.isRTL ? -1 : -75}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          disableRightSwipe={I18nManager.isRTL ? false : true}
          disableLeftSwipe={I18nManager.isRTL ? true : false}
          keyExtractor={item => item.product_id}
        />
      </View>
    )
  }

  return <View style={styles.container}>{renderList()}</View>
}
