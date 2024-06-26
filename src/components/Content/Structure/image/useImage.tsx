'use client'

import React from 'react'
import Image from 'next/image'
import { ImageProps } from './../../../../types/content/image'
import { columnconfig } from 'goobs-repo'

const useImage = (grid: { image?: ImageProps | ImageProps[] }) => {
  if (!grid.image) return null

  const renderImage = (imageItem: ImageProps, index: number): columnconfig => {
    const { url, alt = '', columnconfig } = imageItem

    if (!url) return columnconfig

    // Extend the existing columnconfig with the component
    return {
      ...columnconfig,
      component: (
        <Image
          key={`image-${index}`}
          src={url}
          alt={alt || 'image'}
          style={{ width: '100%', height: 'auto' }}
          fill
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
