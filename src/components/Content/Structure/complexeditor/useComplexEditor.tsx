'use client'
import React from 'react'
import ComplexTextEditor, {
  ComplexTextEditorProps,
} from '../../../ComplexTextEditor'
import { columnconfig, cellconfig } from '../../../Grid'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

// Extend the existing ComplexTextEditorProps
export type ExtendedComplexEditorProps = ComplexTextEditorProps & {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
}

const useComplexEditor = (grid: {
  complexeditor?: ExtendedComplexEditorProps | ExtendedComplexEditorProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.complexeditor) return null

  const renderComplexEditor = (
    component: ExtendedComplexEditorProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      backgroundcolor,
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

    const mergedConfig: columnconfig = {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
        backgroundColor: backgroundcolor,
      },
      component: (
        <ComplexTextEditor key={`complexeditor-${index}`} {...restProps} />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.complexeditor)) {
    return grid.complexeditor.map(renderComplexEditor)
  } else {
    return renderComplexEditor(grid.complexeditor, 0)
  }
}

export default useComplexEditor
