'use client'
import React from 'react'
import ComplexTextEditor, {
  ComplexTextEditorProps,
} from '../../../ComplexTextEditor'

const useComplexEditor = (props: {
  complexeditor?: ComplexTextEditorProps | ComplexTextEditorProps[]
}): React.ReactElement[] | null => {
  if (!props.complexeditor) return null

  const renderComplexEditor = (
    component: ComplexTextEditorProps,
    index: number
  ): React.ReactElement => {
    return <ComplexTextEditor key={`complexeditor-${index}`} {...component} />
  }

  if (Array.isArray(props.complexeditor)) {
    return props.complexeditor.map((item, index) =>
      renderComplexEditor(item, index)
    )
  } else {
    return [renderComplexEditor(props.complexeditor, 0)]
  }
}

export default useComplexEditor
