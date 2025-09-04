import React, { useRef, useState } from 'react'
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import config from '../config'

// Utils
import i18n from '../utils/i18n'

// Actions
import * as staffsActions from '../redux/actions/staffsActions'

// Components
import { ModalView } from '../components/ModalView'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  productItemImage: {
    margin: 10,
    width: 150,
    height: 150
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    width: 100,
    height: 40,
    right: 30,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#ff5500dc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  label: {
    fontSize: 15,
    marginBottom: 5
  },
  input: {
    marginBottom: 5,
    fontSize: 20,
    borderWidth: 1,

    padding: 8,
    borderColor: '#ff550080',
    borderRadius: 6
  },
  scrollView: {
    width: 100 + '%'
  }
})

export const AddNewStaff = ({
  staffsActions,
  settings: { countries, states },
  navigation
}: any) => {
  const defaultImage = `${config.siteUrl}/images/no_image.png`
  const [countryModalVisible, setCountryModalVisible] = useState(false)
  const [stateModalVisible, setStateModalVisible] = useState(false)
  const [sexModalVisible, setSexModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [email, setEmail] = useState('')
  const [sex, setSex] = useState('')
  const [position, setPosition] = useState('')
  const [post, setPost] = useState('')
  const [description, setDescription] = useState('')
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [addressIndex, setAddressIndex] = useState('')
  const file = useRef(null)

  const handleSelectCountry = code => {
    setCountry({ code, name: countries[code] })
    setState(null)
    setCountryModalVisible(false)
  }

  const handleSelectState = state => {
    setState(state)
    setStateModalVisible(false)
  }

  const handleSendStaffData = async () => {
    var formData = new FormData()
    formData.append('_method', 'PUT')

    var data = {
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      email: email,
      sex: sex,
      position: position,
      post: post,
      description: description,
      country: country?.code ? country?.code : country,
      state: state?.code ? state.code : state,
      city: city,
      address: address,
      address_index: addressIndex
    }

    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })

    if (file.current) {
      formData.append('file_main_pair_image_detailed[0]', {
        uri: file.current.uri,
        type: file.current.type,
        name: file.current.name || 'photo.jpg'
      })
    }
    staffsActions.postStaff(formData)
    navigation.pop()
  }
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage)
      } else if (response.assets?.length > 0) {
        setSelectedImage(response.assets[0].uri)
        file.current = response.assets[0]
      }
    })
  }

  const modalContries = () => {
    return (
      <View>
        <FlatList
          data={Object.keys(countries)}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectCountry(item)}>
              <Text style={styles.modalText}>{countries[item]}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }

  const modalStates = () => {
    return (
      <View>
        {country && states[country.code]?.length > 0 ? (
          <FlatList
            data={states[country.code]}
            keyExtractor={(item, index) => item.code + index}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectState(item)}>
                <Text>{item.state}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View>
            <Text>{i18n.t('State')}</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder={i18n.t('State')}
            />
          </View>
        )}
      </View>
    )
  }
  const modalSex = () => {
    return (
      <View>
        <Text
          onPress={() => {
            setSex('man')
            setSexModalVisible(false)
          }}
          style={styles.modalText}>
          {i18n.t('man')}
        </Text>
        <Text
          onPress={() => {
            setSex('woman')
            setSexModalVisible(false)
          }}
          style={styles.modalText}>
          {i18n.t('woman')}
        </Text>
      </View>
    )
  }

  const renderPersonalData = () => {
    return (
      <>
        <Text style={styles.label}>{i18n.t('First name')}</Text>
        <TextInput
          value={firstName}
          onChangeText={value => {
            setFirstName(value)
          }}
          style={styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Last name')}</Text>
        <TextInput
          value={lastName}
          onChangeText={value => {
            setLastName(value)
          }}
          style={styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Middle name')}</Text>
        <TextInput
          value={middleName}
          onChangeText={value => {
            setMiddleName(value)
          }}
          style={styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Email')}</Text>
        <TextInput
          value={email}
          onChangeText={value => {
            setEmail(value)
          }}
          style={styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Sex')}</Text>
        <TouchableOpacity
          onPress={() => {
            setSexModalVisible(true)
          }}>
          <Text style={styles.input}>
            {sex ? i18n.t(sex) : i18n.t('Select sex')}
          </Text>
        </TouchableOpacity>
        <ModalView
          visible={sexModalVisible}
          children={modalSex()}
          onClose={() => {
            setSexModalVisible(false)
          }}
        />
        <Text style={styles.label}>{i18n.t('Position')}</Text>
        <TextInput
          value={position}
          onChangeText={value => {
            setPosition(value)
          }}
          style={styles.input}>
          {' '}
        </TextInput>
        <Text style={styles.label}>{i18n.t('Post')}</Text>
        <TextInput
          value={post}
          onChangeText={value => {
            setPost(value)
          }}
          style={styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Description')}</Text>
        <TextInput
          multiline
          value={description}
          onChangeText={value => {
            setDescription(value)
          }}
          style={styles.input}></TextInput>
      </>
    )
  }

  const contactData = () => {
    return (
      <>
        <Text style={styles.label}>{i18n.t('Country')}</Text>

        <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
          <Text style={styles.input}>
            {country ? country.name : 'Выберите страну'}
          </Text>
        </TouchableOpacity>
        <ModalView
          visible={countryModalVisible}
          children={modalContries()}
          onClose={() => {
            setCountryModalVisible(false)
          }}
        />

        <Text style={styles.label}>{i18n.t('State')}</Text>

        <TouchableOpacity onPress={() => setStateModalVisible(true)}>
          <Text style={styles.input}>
            {state?.state ? state.state : state ? state : 'Выберите регион'}
          </Text>
        </TouchableOpacity>
        <ModalView
          visible={stateModalVisible}
          children={modalStates()}
          onClose={() => {
            setStateModalVisible(false)
          }}
        />
        <Text style={styles.label}>{i18n.t('City')}</Text>
        <TextInput
          value={city}
          onChangeText={value => {
            setCity(value)
          }}
          style={styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Addres')}</Text>
        <TextInput
          value={address}
          onChangeText={value => {
            setAddress(value)
          }}
          style={styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Addres index')}</Text>
        <TextInput
          value={addressIndex}
          onChangeText={value => {
            setAddressIndex(value)
          }}
          style={styles.input}></TextInput>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity onPress={() => pickImage()}>
          <Image
            source={{ uri: selectedImage ? selectedImage : defaultImage }}
            style={styles.productItemImage}
          />
        </TouchableOpacity>
        {renderPersonalData()}
        {contactData()}
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => handleSendStaffData()}>
        <Text>{i18n.t('Save')}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default connect(
  state => ({
    settings: state.settings
  }),
  dispatch => ({
    staffsActions: bindActionCreators(staffsActions, dispatch)
  })
)(AddNewStaff)
