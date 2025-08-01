import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet } from 'react-native'
import theme from '../config/theme'
import { bindActionCreators } from 'redux'

// Actions
import * as notificationsActions from '../redux/actions/notificationsActions'
import * as cartActions from '../redux/actions/cartActions'

// Components
import { AddToCartButton } from '../components/AddToCartButton'
import { QtyOption } from '../components/QtyOption'

// Utils
import i18n from '../utils/i18n'

const styles = StyleSheet.create({
  addToCartBtnText: {
    textAlign: 'center',
    color: theme.$buttonWithBackgroundTextColor,
    fontSize: 12
  },
  addToCartBtn: {
    backgroundColor: theme.$buttonBackgroundColor,
    padding: 5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export const AddToCartWithAmount = ({ item, navigation }) => {
  const dispatch = useDispatch()
  const { add } = bindActionCreators(cartActions, dispatch)

  const settings = useSelector(state => state.settings)
  const auth = useSelector(state => state.auth)
  const cart = useSelector(state => state.cart)
  const [amount, setAmount] = useState(1)
  const renderQuantitySwitcher = () => {
    const step = parseInt(item.qty_step, 10) || 1
    const max = parseInt(item.in_stock, 10) || parseInt(item.amount, 10)
    const min = parseInt(item.min_qty, 10) || step

    /*if (item.isProductOffer) {
      return null
    }*/

    if (amount < min) {
      setAmount(min)
    }
    const QtyOptionHandler = value => {
      if (
        value <= parseInt(item.amount, 10) ||
        item.out_of_stock_actions === 'B'
      ) {
        setAmount(value)
      } else {
        notificationsActions.show({
          type: 'warning',
          title: i18n.t('Notice'),
          text: i18n.t(
            'The number of products in the inventory is not enough for your order. The quantity of the product {{product}} in your cart has been reduced to {{count}}.',
            {
              product: item.product,
              count: item.amount
            }
          )
        })
      }
    }

    return (
      <>
        <QtyOption
          max={max}
          min={min}
          initialValue={amount || min}
          step={step}
          onChange={value => QtyOptionHandler(value)}
        />

        {min > 1 && (
          <Text style={styles.minQtyNoticeText}>
            {i18n.t(
              'Minimum quantity for "[productTitle]" is [minProductQty].',
              { productTitle: item.product, minProductQty: min }
            )}
          </Text>
        )}
        {settings.showInStockField && (
          <Text style={styles.productInStockText}>
            {i18n.t('Availability') + ` ${item.amount} ` + i18n.t('item(s)')}
          </Text>
        )}
      </>
    )
  }

  const handleAddToCart = (showNotification = true) => {
    const productOptions = {}

    if (!auth.logged) {
      navigation.navigate('Login')
    }

    const products = {
      [item.product_id]: {
        product_id: item.product_id,
        amount,
        product_options: productOptions
      }
    }

    return add({ products }, showNotification, cart.coupons)
  }

  const renderCartButton = () => {
    return (
      <View>
        <AddToCartButton
          onPress={() => handleAddToCart(true, item)}
          title={'Add to cart'}
          buttonStyle={styles.addToCartBtn}
          textStyle={styles.addToCartBtnText}
        />
      </View>
    )
  }

  return (
    <>
      {renderQuantitySwitcher()}
      {renderCartButton()}
    </>
  )
}
