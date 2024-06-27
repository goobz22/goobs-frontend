'use client'
import React from 'react'
import CustomButton, { CustomButtonProps } from './../../../Button'
import { columnconfig, cellconfig } from '../../../Grid'
import { TypographyPropsVariantOverrides } from '@mui/material'

export interface ExtendedButtonProps extends CustomButtonProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useButton = (grid: {
  button?: ExtendedButtonProps | ExtendedButtonProps[]
}) => {
  if (!grid.button) return null

  const renderButton = (
    buttonItem: ExtendedButtonProps,
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
      iconsize,
      iconlocation,
      variant,
      onClick,
      helperfooter,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = buttonItem

    const mergedConfig: columnconfig = {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <CustomButton
          key={`button-${index}`}
          text={text}
          name={name}
          backgroundcolor={backgroundcolor}
          outlinecolor={outlinecolor}
          fontcolor={fontcolor}
          width={width}
          fontlocation={fontlocation}
          fontvariant={fontvariant as keyof TypographyPropsVariantOverrides}
          icon={icon}
          iconcolor={iconcolor}
          iconsize={iconsize}
          iconlocation={iconlocation}
          variant={variant}
          onClick={onClick}
          helperfooter={helperfooter}
          {...restProps}
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
