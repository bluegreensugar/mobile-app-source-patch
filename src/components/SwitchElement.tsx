import React from 'react'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Switch } from 'react-native'

type Theme = 'light' | 'dark'

export const SwitchElement = () => {
  const [theme, setTheme] = useState<Theme>()

  useEffect(() => {
    const getSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeProfile')
        if (savedTheme === 'light' || savedTheme === 'dark')
          setTheme(savedTheme)
      } catch (e) {
        console.error('Error: getSavedTheme')
      }
    }
    getSavedTheme()
  }, [])

  const toggleSwitch = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    try {
      setTheme(newTheme)
      await AsyncStorage.setItem('themeProfile', newTheme)
    } catch (e) {
      console.error('Error: switchTheme')
    }
  }
  return (
    <Switch
      trackColor={{ false: '#767577', true: '#93b7f6d9' }}
      thumbColor={theme === 'dark' ? '#514bf54f' : '#f4f3f4'}
      onValueChange={toggleSwitch}
      value={theme === 'dark'}
    />
  )
}
