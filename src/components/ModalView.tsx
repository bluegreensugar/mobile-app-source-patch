import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal
} from 'react-native'
import theme from '../config/theme'

// Utils
import i18n from '../utils/i18n'

const styles = StyleSheet.create({
  modalView: {
    marginHorizontal: 50,
    marginVertical: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    textAlign: 'center',
    borderColor: '#ff5500dc',
    borderWidth: 1,
    padding: 10,
    elevation: 2
  }
})
export const ModalView = ({ visible, children, onClose }: any) => {
  return (
    <>
      <Modal visible={visible} transparent={true} animationType="slide">
        <View style={styles.modalView}>
          {children}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.button}>{i18n.t('Close')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  )
}
