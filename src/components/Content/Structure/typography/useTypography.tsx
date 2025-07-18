import React from 'react'
import Typography, { TypographyProps } from '../../../Typography'

const useTypography = (props: {
  typography?: TypographyProps | TypographyProps[]
}): React.ReactElement[] | null => {
  if (!props.typography) return null

  const renderTypography = (
    typographyItem: TypographyProps,
    index: number
  ): React.ReactElement => {
    const { text, ...restProps } = typographyItem

    return <Typography key={`typography-${index}`} text={text} {...restProps} />
  }

  if (Array.isArray(props.typography)) {
    return props.typography.map((item, index) => renderTypography(item, index))
  } else {
    return [renderTypography(props.typography, 0)]
  }
}

export default useTypography
