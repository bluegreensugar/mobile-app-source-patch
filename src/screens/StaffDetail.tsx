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
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ScrollView,
  Alert
} from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// Utils
import i18n from '../utils/i18n'
import { getImagePath } from '../utils'
// Actions
import * as staffsActions from '../redux/actions/staffsActions'
// Components
import { ModalView } from '../components/ModalView'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerView: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalText: {
    marginBottom: 20
  },
  productItemImage: {
    margin: 10,
    width: 150,
    height: 150
  },
  floatingButton: {
    position: 'absolute',
    bottom: 10,
    width: '50%',
    height: 50,

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
  inputError: {
    borderColor: '#ff0000ff'
  },
  scrollView: {
    width: '100%',
    marginBottom: 60
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  }
})

type Sex = 'man' | 'woman'
interface Staff {
  id_staff?: number | string
  first_name: string
  last_name: string
  middle_name?: string
  email: string
  sex: Sex
  position?: string
  post?: string
  description?: string
  country?: string
  state?: string
  city?: string
  address?: string
  address_index?: string
}
interface File {
  uri?: string
  type?: string
  name?: string
}

interface Countries {
  code: string
}
interface CountryStates {
  country_code: string
  code: string
  state: string
}
interface ErrorValid {
  firstNameEmpty?: boolean
  lastNameEmpty?: boolean
  emailEmpty?: boolean
  positionEmpty?: boolean
  postEmpty?: boolean
}

export const StaffDetail = ({
  route,
  staffsActions,
  settings: { countries, states },
  navigation
}: any) => {
  const idStaff: number | string = route.params?.idStaff
  const isEditStaff: boolean = !!idStaff
  const [countryModalVisible, setCountryModalVisible] = useState<boolean>(false)
  const [stateModalVisible, setStateModalVisible] = useState<boolean>(false)
  const [sexModalVisible, setSexModalVisible] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [edit, setEdit] = useState<boolean>(!isEditStaff)
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [middleName, setMiddleName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [sex, setSex] = useState<Sex>('woman')
  const [position, setPosition] = useState<string>('')
  const [post, setPost] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [state, setState] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [addressIndex, setAddressIndex] = useState<string>()
  const [staff, setStaff] = useState<Staff | null>(null)
  const [validError, setValidError] = useState<ErrorValid>({
    firstNameEmpty: false,
    lastNameEmpty: false,
    emailEmpty: false,
    positionEmpty: false,
    postEmpty: false
  })
  const file = useRef<File | null>(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffData: Staff = await staffsActions.fetchStaffs(idStaff)
        setStaff(staffData)
      } catch (err: any) {
        Alert.alert(i18n.t('Error'), err?.message || i18n.t('Unknown error'))
      }
    }
    if (isEditStaff) fetchStaff()
  }, [idStaff])

  useEffect(() => {
    if (staff) defaultData()
  }, [staff])

  const defaultData = () => {
    setFirstName(staff?.first_name || '')
    setLastName(staff?.last_name || '')
    setMiddleName(staff?.middle_name || '')
    setEmail(staff?.email || '')
    setSex(staff?.sex || 'woman')
    setPosition(staff?.position || '')
    setPost(staff?.post || '')
    setDescription(staff?.description || '')
    setCountry(staff?.country || '')
    setState(staff?.state || '')
    setCity(staff?.city || '')
    setAddress(staff?.address || '')
    setAddressIndex(staff?.address_index || '')
  }

  const handleSelectCountry = (code: string) => {
    setCountry(code)
    setState('')
    setCountryModalVisible(false)
  }

  const handleSelectState = (code: string) => {
    setState(code)
    setStateModalVisible(false)
  }

  const getStateName = () => {
    const countryStates: CountryStates[] = states[country] || []
    const found: CountryStates | undefined = countryStates.find(
      (s: Countries) => s.code === state
    )
    return found ? found.state : state
  }
  const checkStaffData = () => {
    var valid = true

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (firstName.trim().length === 0) {
      valid = false
      setValidError(err => ({ ...err, firstNameEmpty: true }))
    } else {
      setValidError(err => ({ ...err, firstNameEmpty: false }))
    }
    if (lastName.trim().length === 0) {
      valid = false
      setValidError(err => ({ ...err, lastNameEmpty: true }))
    } else {
      setValidError(err => ({ ...err, lastNameEmpty: false }))
    }
    if (email.trim().length === 0 || !emailRegex.test(email)) {
      valid = false
      setValidError(err => ({ ...err, emailEmpty: true }))
    } else {
      setValidError(err => ({ ...err, emailEmpty: false }))
    }
    if (position.trim().length === 0) {
      valid = false
      setValidError(err => ({ ...err, positionEmpty: true }))
    } else {
      setValidError(err => ({ ...err, positionEmpty: false }))
    }
    if (post.trim().length === 0) {
      valid = false
      setValidError(err => ({ ...err, postEmpty: true }))
    } else {
      setValidError(err => ({ ...err, postEmpty: false }))
    }
    return valid
  }

  const handleSendStaffData = async () => {
    checkStaffData()
    if (checkStaffData()) {
      var formData = new FormData()
      var data: Staff = {
        first_name: firstName ?? '',
        last_name: lastName ?? '',
        middle_name: middleName ?? '',
        email: email ?? '',
        sex: sex ?? 'woman',
        position: position ?? '',
        post: post ?? '',
        description: description ?? '',
        country: country ?? '',
        state: state ?? '',
        city: city ?? '',
        address: address ?? '',
        address_index: addressIndex ?? ''
      }
      Object.keys(data).forEach(key => {
        formData.append(key, data[key as keyof Staff])
      })
      if (file.current) {
        const timestamp: number = Date.now()
        const indexDot: number | undefined = file.current.name?.lastIndexOf('.')
        const ext: string = file.current.name?.slice(indexDot) || 'jpg'
        const base: string =
          file.current.name?.substring(0, indexDot) || 'photo'
        formData.append('file_main_pair_image_detailed[0]', {
          uri: file.current.uri,
          type: file.current.type,
          name: base + '_' + timestamp + '.' + ext
        })
      }
      if (isEditStaff) {
        formData.append('_method', 'PUT')
        formData.append('id_staff', idStaff)
      }
      try {
        await staffsActions.createStaff(formData)
        navigation.navigate('StaffsManage', { refresh: true })
      } catch (err: any) {
        Alert.alert(i18n.t('Error'), err?.message || i18n.t('Unknown error'))
      }
    }
  }

  const handleEdit = async () => {
    if (edit && staff) defaultData()
    setEdit(!edit)
  }

  useEffect(() => {
    navigation.setOptions({
      title: isEditStaff ? i18n.t('Edit') : i18n.t('Add'),
      headerRight: () =>
        isEditStaff ? (
          <Button onPress={() => handleEdit()} title={i18n.t('Edit')} />
        ) : null
    })
  }, [edit, isEditStaff])

  const pickImage = () => {
    if (edit) {
      launchImageLibrary({ mediaType: 'photo' }, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker')
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage)
        } else if (response?.assets && response.assets.length > 0) {
          setSelectedImage(response.assets?.[0]?.uri || '')
          file.current = response.assets?.[0] ?? {}
        }
      })
    }
  }

  const modalCountries = () => {
    return (
      <FlatList
        data={Object.keys(countries)}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectCountry(item)}>
            <Text style={styles.modalText}>{countries[item]}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{i18n.t('No data to display')}</Text>
          </View>
        }
      />
    )
  }

  const modalStates = () => {
    return (
      <>
        {country && states[country]?.length > 0 ? (
          <FlatList
            data={states[country]}
            keyExtractor={item => item.code}
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
              style={styles.inputEditMode}
              value={state}
              onChangeText={setState}
              placeholder={i18n.t('State')}
            />
          </View>
        )}
      </>
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
          style={[
            edit ? styles.inputEditMode : styles.input,
            validError.firstNameEmpty && styles.inputError
          ]}></TextInput>
        <Text style={styles.label}>{i18n.t('Last name')}</Text>
        <TextInput
          value={lastName}
          editable={edit}
          onChangeText={value => {
            setLastName(value)
          }}
          style={[
            edit ? styles.inputEditMode : styles.input,
            validError.lastNameEmpty && styles.inputError
          ]}></TextInput>
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
          style={[
            edit ? styles.inputEditMode : styles.input,
            validError.emailEmpty && styles.inputError
          ]}></TextInput>
        <Text style={styles.label}>{i18n.t('sex')}</Text>
        <TouchableOpacity
          activeOpacity={1}
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
          style={[
            edit ? styles.inputEditMode : styles.input,
            validError.positionEmpty && styles.inputError
          ]}></TextInput>
        <Text style={styles.label}>{i18n.t('Post')}</Text>
        <TextInput
          value={post}
          editable={edit}
          onChangeText={value => {
            setPost(value)
          }}
          style={[
            edit ? styles.inputEditMode : styles.input,
            validError.postEmpty && styles.inputError
          ]}></TextInput>
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
        <Text style={styles.label}>{i18n.t('Select country')}</Text>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (edit) setCountryModalVisible(true)
          }}>
          <Text style={edit ? styles.inputEditMode : styles.input}>
            {country ? countries[country] : i18n.t('Select country')}
          </Text>
        </TouchableOpacity>
        <ModalView
          visible={countryModalVisible}
          children={modalCountries()}
          onClose={() => {
            setCountryModalVisible(false)
          }}
        />

        <Text style={styles.label}>{i18n.t('Select state')}</Text>

        <TouchableOpacity
          activeOpacity={1}
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
        <Text style={styles.label}>{i18n.t('Address')}</Text>
        <TextInput
          value={address}
          editable={edit}
          onChangeText={value => {
            setAddress(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
        <Text style={styles.label}>{i18n.t('address index')}</Text>
        <TextInput
          value={addressIndex}
          editable={edit}
          keyboardType="numeric"
          onChangeText={value => {
            setAddressIndex(value)
          }}
          style={edit ? styles.inputEditMode : styles.input}></TextInput>
      </>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.containerView}>
          <ScrollView style={styles.scrollView}>
            <TouchableOpacity onPress={() => pickImage()}>
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage }
                    : getImagePath(staff)
                    ? { uri: getImagePath(staff) }
                    : require('../assets/no_image.png')
                }
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
              <Text>{i18n.t('save')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default connect(
  (state: any) => ({
    settings: state.settings
  }),
  dispatch => ({
    staffsActions: bindActionCreators(staffsActions, dispatch)
  })
)(StaffDetail)
