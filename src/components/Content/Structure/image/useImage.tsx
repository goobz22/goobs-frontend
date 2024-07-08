'use client'
import React from 'react'
import Image from 'next/image'
import { columnconfig, cellconfig } from '../../../Grid'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

type ImageProps = {
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface ExtendedImageProps extends Omit<ImageProps, 'columnconfig'> {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
}

const useImage = (grid: {
  image?: ExtendedImageProps | ExtendedImageProps[]
}): columnconfig | columnconfig[] | null => {
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

    if (!url) {
      throw new Error('URL is required for image')
    }

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
    return renderImage(grid.image, 0)
  }
}

export default useImage
