import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  TextInput,
  Text,
  FlatList,
  Button,
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
import { getImagePath } from '../utils'

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
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  productItemImage: {
    margin: 10,
    width: 150,
    height: 150
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
    backgroundColor: '#dce3ec33',
    padding: 8,
    borderColor: '#ffc5a880',
    borderRadius: 6
  },
  inputEditMode: {
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

export const StaffDetail = ({
  route,
  staffsActions,
  settings: { countries, states },
  navigation
}:any) => {
  const defaultImage = `${config.siteUrl}/images/no_image.png`

  const [countryModalVisible, setCountryModalVisible] = useState(false)
  const [stateModalVisible, setStateModalVisible] = useState(false)
  const [sexModalVisible, setSexModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [edit, setEdit] = useState(false)
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
  const [staff, setStaff] = useState('')
  const [error, setError] = useState('')
  const file = useRef(null)

  const idStaff = route.params.idStaff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffData = await staffsActions.fetchStaff(idStaff)
        setStaff(staffData)
      } catch (err) {
        setError(err)
      }
    }
    if (idStaff) fetchStaff()
  }, [idStaff])

  useEffect(() => {
    defaultData();
  }, [staff])

  const defaultData = () =>{
    setFirstName(staff.first_name)
    setLastName(staff.last_name)
    setMiddleName(staff.middle_name)
    setEmail(staff.email)
    setSex(staff.sex)
    setPosition(staff.position)
    setPost(staff.post)
    setDescription(staff.description)
    setCountry(staff.country)
    setState(staff.state)
    setCity(staff.city)
    setAddress(staff.address)
    setAddressIndex(staff.address_index)
  }

  const handleSelectCountry = code => {
    setCountry(code)
    setState(null)
    setCountryModalVisible(false)
  }

  const handleSelectState = code => {
    setState(code)
    setStateModalVisible(false)
  }

  const getStateName = () => {
    const countryStates = states[country] || []
    const found = countryStates.find(s => s.code === state)
    return found ? found.state : state
  }

  const handleSendStaffData = async () => {
    var formData = new FormData()
    formData.append('_method', 'PUT')

    var data = {
      id_staff: idStaff,
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      email: email,
      sex: sex,
      position: position,
      post: post,
      description: description,
      country: country ? country : '',
      state: state ? state : '',
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
    staffsActions.updateStaff(formData)
    navigation.pop()
  }

  const handleEdit = async () => {
    if(edit){
      defaultData();
    }
    setEdit(!edit)
    
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={() => handleEdit()} title="Edit" />
    })
  }, [navigation, edit])

  const pickImage = () => {
    if (edit) {
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
        {country && states[country]?.length > 0 ? (
          <FlatList
            data={states[country]}
            keyExtractor={(item, index) => item.code + index}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectState(item.code)}>
                <Text>{item.state}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View>
            <Text>{i18n.t('State')}</Text>
            <TextInput
              style={edit ? styles.inputEditMode : styles.input}
              value={state}
              onChangeText={setState}
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
          editable={edit}
          onChangeText={value => {
            setFirstName(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Last name')}</Text>
        <TextInput
          value={lastName}
          editable={edit}
          onChangeText={value => {
            setLastName(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Middle name')}</Text>
        <TextInput
          value={middleName}
          editable={edit}
          onChangeText={value => {
            setMiddleName(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Email')}</Text>
        <TextInput
          value={email}
          editable={edit}
          onChangeText={value => {
            setEmail(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Sex')}</Text>
        <TouchableOpacity
          onPress={() => {
            if (edit) setSexModalVisible(true)
          }}>
          <Text style={edit ? styles.inputEditMode : styles.input}>
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
          editable={edit}
          onChangeText={value => {
            setPosition(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}>
          {' '}
        </TextInput>
        <Text style={styles.label}>{i18n.t('Post')}</Text>
        <TextInput
          value={post}
          editable={edit}
          onChangeText={value => {
            setPost(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Description')}</Text>
        <TextInput
          multiline
          value={description}
          editable={edit}
          onChangeText={value => {
            setDescription(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
      </>
    )
  }
  const renderContactData = () => {
    return (
      <>
        <Text style={styles.label}>{i18n.t('Country')}</Text>

        <TouchableOpacity
          onPress={() => {
            if (edit) setCountryModalVisible(true)
          }}>
          <Text style={edit ? styles.inputEditMode : styles.input}>
            {country ? countries[country] : i18n.t('Select country')}
          </Text>
        </TouchableOpacity>
        <ModalView
          visible={countryModalVisible}
          children={modalContries()}
          onClose={() => {
            setCountryModalVisible(false)
          }}
        />

        <Text style={styles.label}>{i18n.t('Select state')}</Text>

        <TouchableOpacity
          onPress={() => {
            if (edit) setStateModalVisible(true)
          }}>
          <Text style={edit ? styles.inputEditMode : styles.input}>
            {state ? getStateName() : i18n.t('Select state')}
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
          editable={edit}
          onChangeText={value => {
            setCity(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Addres')}</Text>
        <TextInput
          value={address}
          editable={edit}
          onChangeText={value => {
            setAddress(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('Addres index')}</Text>
        <TextInput
          value={addressIndex}
          editable={edit}
          onChangeText={value => {
            setAddressIndex(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity onPress={() => pickImage()}>
          <Image
            source={{
              uri: selectedImage
                ? selectedImage
                : getImagePath(staff)
                ? getImagePath(staff)
                : defaultImage
            }}
            style={styles.productItemImage}
          />
        </TouchableOpacity>
        {renderPersonalData()}
        {renderContactData()}
      </ScrollView>
      {edit && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => handleSendStaffData()}>
          <Text>{i18n.t('Save')}</Text>
        </TouchableOpacity>
      )}
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
)(StaffDetail)
