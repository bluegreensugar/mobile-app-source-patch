import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'

// Utils
import i18n from '../utils/i18n'

const styles = StyleSheet.create({
  modalView: {
    width: '80%',

    marginHorizontal: 30,
    marginVertical: 100,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    padding: 20
  },
  modalButton: {
    borderRadius: 10,
    borderColor: '#ff5500dc',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10
  },
  modalButtonText: {
    textAlign: 'center'
  },
  shadowBackground: {
    flex: 1,
    backgroundColor: '#68666666',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export const ModalView = ({ visible, children, onClose }: any) => {
  return (
    <>
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.shadowBackground}>
          <View style={styles.modalView}>
            <View>
              {children}
              <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                <Text style={styles.modalButtonText}>{i18n.t('Close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}
