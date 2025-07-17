import React, { Component } from 'react'
import DeviceInfo from 'react-native-device-info'
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  I18nManager
} from 'react-native'
import { v4 as uuidv4 } from 'uuid'

// Utils
import i18n from '../utils/i18n'

// Components
import Section from '../components/Section'
import SectionRow from '../components/SectionRow'
import theme from '../config/theme'

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 300,
    resizeMode: 'contain'
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  information: {
    height: 100,
    width: 300,
    resizeMode: 'contain'
  },
  informationWrapper: {
    justifyContent: 'center',
    marginBottom: 10
  },
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  },
  crollContainer: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor,
    paddingHorizontal: I18nManager.isRTL
      ? theme.$containerPadding / 2
      : theme.$containerPadding,
    marginLeft: I18nManager.isRTL ? theme.$containerPadding : 0
  }
})

export default class AppDetail extends Component {
  renderLogo() {
    return (
      <Section>
        <View style={styles.logoWrapper}>
          {theme.$logoUrl !== '' && (
            <Image source={{ uri: theme.$logoUrl }} style={styles.logo} />
          )}
        </View>
      </Section>
    )
  }
  renderVersion() {
    const version = DeviceInfo.getVersion()
    return (
      <View>
        <SectionRow key={uuidv4()} name={'Version'} value={version} />
      </View>
    )
  }
  renderName() {
    const nameApp = DeviceInfo.getApplicationName()
    return (
      <View>
        <SectionRow key={uuidv4()} name={'Name'} value={nameApp} />
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.crollContainer}>
          <Section topDivider title={i18n.t('App Information')}>
            {this.renderLogo()}
            <View style={styles.informationWrapper}>
              {this.renderName()}
              {this.renderVersion()}
            </View>
          </Section>
        </ScrollView>
      </View>
    )
  }
}
