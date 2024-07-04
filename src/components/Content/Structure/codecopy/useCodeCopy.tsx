'use client'
import React from 'react'
import CodeCopy, { CodeCopyProps } from './../../../../components/CodeCopy'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedCodeCopyProps extends CodeCopyProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useCodeCopy = (grid: {
  codecopy?: ExtendedCodeCopyProps | ExtendedCodeCopyProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.codecopy) return null

  const renderCodeCopy = (
    codeCopyProps: ExtendedCodeCopyProps,
    index: number
  ): columnconfig => {
    const {
      code,
      language,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = codeCopyProps

    // Merge the existing columnconfig with the new props
    const mergedConfig: columnconfig = {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <CodeCopy
          key={`codecopy-${index}`}
          code={code}
          language={language}
          {...restProps}
        />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.codecopy)) {
    return grid.codecopy.map(renderCodeCopy)
  } else {
    return renderCodeCopy(grid.codecopy, 0)
  }
}

export default useCodeCopy
