import React from 'react'
import { StyledComponent } from 'goobs-repo'
import { StyledComponentProps } from './../../../../types/content'
import { columnconfig } from 'goobs-repo'

const useStyledComponent = (grid: {
  styledcomponent?: StyledComponentProps | StyledComponentProps[]
}) => {
  if (!grid.styledcomponent) return null

  const renderStyledComponent = (
    component: StyledComponentProps,
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
      columnconfig,
      serverActionValidation,
      valuestatus,
      cellconfig,
    } = component

    // Merge the cellconfig with the columnconfig
    const mergedConfig = {
      ...columnconfig,
      ...cellconfig,
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
          serverActionValidation={serverActionValidation}
          valuestatus={valuestatus}
        />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.styledcomponent)) {
    return grid.styledcomponent.map(renderStyledComponent)
  } else {
    return [renderStyledComponent(grid.styledcomponent, 0)]
  }
}

export default useStyledComponent
