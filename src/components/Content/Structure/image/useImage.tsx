'use client'
import React from 'react'
import Image from 'next/image'
import { columnconfig, cellconfig } from '../../../Grid'

type ImageProps = {
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface ExtendedImageProps extends Omit<ImageProps, 'columnconfig'> {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useImage = (grid: {
  image?: ExtendedImageProps | ExtendedImageProps[]
}) => {
  if (!grid.image) return null

  const renderImage = (
    imageItem: ExtendedImageProps,
    index: number
  ): columnconfig => {
    const {
      url,
      alt = '',
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = imageItem

    if (!url) return itemColumnConfig || {}

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <Image
          key={`image-${index}`}
          src={url}
          alt={alt || 'image'}
          style={{ width: '100%', height: 'auto' }}
          fill
          {...restProps}
        />
      ),
    }
  }

  if (Array.isArray(grid.image)) {
    return grid.image.map(renderImage)
  } else {
    return [renderImage(grid.image, 0)]
  }
}

export default useImage
