'use client'
import React from 'react'
import { CustomButton } from 'goobs-repo'
import { CustomButtonProps } from './../../../../types/content'
import { columnconfig } from 'goobs-repo'

const useButton = (grid: {
  button?: CustomButtonProps | CustomButtonProps[]
}) => {
  if (!grid.button) return null

  const renderButton = (
    buttonItem: CustomButtonProps,
    index: number
  ): columnconfig => {
    const {
      text,
      name,
      backgroundcolor,
      outlinecolor,
      fontcolor,
      width,
      fontlocation,
      fontvariant,
      icon,
      iconcolor,
      iconlocation,
      variant,
      onClick,
      helperfooter,
      columnconfig,
      cellconfig,
    } = buttonItem

    // Merge the cellconfig with the columnconfig
    const mergedConfig = {
      ...columnconfig,
      ...cellconfig,
      component: (
        <CustomButton
          key={`button-${index}`}
          text={text}
          name={name}
          backgroundcolor={backgroundcolor}
          outlinecolor={outlinecolor}
          fontcolor={fontcolor}
          fontlocation={fontlocation}
          fontvariant={fontvariant}
          icon={icon}
          width={width}
          iconcolor={iconcolor}
          iconlocation={iconlocation}
          variant={variant}
          onClick={onClick}
          helperfooter={helperfooter}
          fullWidth
        />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.button)) {
    return grid.button.map(renderButton)
  } else {
    return [renderButton(grid.button, 0)]
  }
}

export default useButton
