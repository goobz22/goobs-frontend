'use client'
import React from 'react'
import Image from 'next/image'

export interface ImageProps {
  url: string
  alt?: string
  width?: number
  height?: number
}

const useImage = (props: {
  image?: ImageProps | ImageProps[]
}): React.ReactElement[] | null => {
  if (!props.image) return null

  const renderImage = (
    imageItem: ImageProps,
    index: number
  ): React.ReactElement => {
    const { url, alt = '', ...restProps } = imageItem

    if (!url) {
      throw new Error('URL is required for image')
    }

    return (
      <Image
        key={`image-${index}`}
        src={url}
        alt={alt || 'image'}
        style={{ width: '100%', height: 'auto' }}
        fill
        {...restProps}
      />
    )
  }

  if (Array.isArray(props.image)) {
    return props.image.map((item, index) => renderImage(item, index))
  } else {
    return [renderImage(props.image, 0)]
  }
}

export default useImage
