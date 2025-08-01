import React from 'react'
import { v4 as uuidv4 } from 'uuid'

// Components
import InputOption from './InputOption'
import RadioGroupOption from './RadioGroupOption'
import { CheckboxOption } from './CheckboxOption.tsx'
import SelectBoxOption from './SelectBoxOption'
import ImageOption from './ImageOption'

export const ProductDetailOptions = ({
  options,
  selectedOptions,
  changeOptionHandler,
  navigation
}) => {
  const renderOptionItem = item => {
    const option = { ...item }
    const defaultValue = selectedOptions[item.selectDefaultId]

    switch (item.option_type) {
      case 'P':
        return (
          <ImageOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            onChange={val => changeOptionHandler(option.selectDefaultId, val)}
          />
        )

      case 'T':
        return (
          <InputOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            onChange={val => changeOptionHandler(option.selectDefaultId, val)}
          />
        )

      case 'I':
        return (
          <InputOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            onChange={val => changeOptionHandler(option.selectDefaultId, val)}
          />
        )

      case 'S':
        return (
          <SelectBoxOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            navigation={navigation}
            onChange={val => changeOptionHandler(option.selectDefaultId, val)}
          />
        )

      case 'R':
        return (
          <RadioGroupOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            onChange={val => changeOptionHandler(option.selectDefaultId, val)}
          />
        )

      case 'C':
        return (
          <CheckboxOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            onChange={val => changeOptionHandler(option.selectDefaultId, val)}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      {options.map(option => {
        return renderOptionItem(option)
      })}
    </>
  )
}
