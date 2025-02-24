'use client'
import React from 'react'
import CodeCopy, { CodeCopyProps } from './../../../../components/CodeCopy'

const useCodeCopy = (props: {
  codecopy?: CodeCopyProps | CodeCopyProps[]
}): React.ReactElement[] | null => {
  if (!props.codecopy) return null

  const renderCodeCopy = (
    codeCopyProps: CodeCopyProps,
    index: number
  ): React.ReactElement => {
    return <CodeCopy key={`codecopy-${index}`} {...codeCopyProps} />
  }

  if (Array.isArray(props.codecopy)) {
    return props.codecopy.map((item, index) => renderCodeCopy(item, index))
  } else {
    return [renderCodeCopy(props.codecopy, 0)]
  }
}

export default useCodeCopy
