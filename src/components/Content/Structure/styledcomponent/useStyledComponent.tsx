import React from 'react'
import StyledComponent, {
  StyledComponentProps,
} from '../../../../components/StyledComponent'
import { columnconfig, cellconfig } from '../../../Grid'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedStyledComponentProps
  extends Omit<StyledComponentProps, 'columnconfig'> {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
}

const useStyledComponent = (grid: {
  styledcomponent?:
    | ExtendedStyledComponentProps
    | ExtendedStyledComponentProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.styledcomponent) return null

  const renderStyledComponent = (
    component: ExtendedStyledComponentProps,
    index: number
  ): columnconfig => {
    const {
      name,
      outlinecolor,
      iconcolor,
      backgroundcolor,
      combinedfontcolor,
      unshrunkfontcolor,
      shrunkfontcolor,
      autoComplete,
      componentvariant,
      options,
      helperfooter,
      placeholder,
      minRows,
      label,
      shrunklabellocation,
      value,
      onChange,
      defaultValue,
      inputRef,
      columnconfig: itemColumnConfig,
      valuestatus,
      cellconfig,
      required,
      ...restProps
    } = component

    if (
      !itemColumnConfig ||
      typeof itemColumnConfig !== 'object' ||
      typeof itemColumnConfig.row !== 'number' ||
      typeof itemColumnConfig.column !== 'number'
    ) {
      throw new Error(
        'columnconfig must be an object with row and column as numbers'
      )
    }

    // Merge the cellconfig with the columnconfig
    const mergedConfig: columnconfig = {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <StyledComponent
          key={`styledcomponent-${index}`}
          name={name}
          outlinecolor={outlinecolor}
          iconcolor={iconcolor}
          backgroundcolor={backgroundcolor}
          combinedfontcolor={combinedfontcolor}
          unshrunkfontcolor={unshrunkfontcolor}
          shrunkfontcolor={shrunkfontcolor}
          autoComplete={autoComplete}
          componentvariant={componentvariant}
          options={options}
          helperfooter={helperfooter}
          placeholder={placeholder}
          minRows={minRows}
          label={label}
          shrunklabellocation={shrunklabellocation}
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          inputRef={inputRef}
          valuestatus={valuestatus}
          required={required}
          {...restProps}
        />
      ),
    }
    return mergedConfig
  }

  if (Array.isArray(grid.styledcomponent)) {
    return grid.styledcomponent.map(renderStyledComponent)
  } else {
    return renderStyledComponent(grid.styledcomponent, 0)
  }
}

export default useStyledComponent
