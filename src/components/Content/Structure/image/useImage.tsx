'use client'
import React from 'react'
import cssStyles from './Image.module.css'

export interface ImageProps {
  url: string
  alt?: string
  width?: number
  height?: number
}

/**
 * Render image items. Framework-agnostic: by default renders a plain `<img>`
 * (the `.image` class fills its container width and preserves aspect ratio). A
 * Next.js consumer can inject `imageComponent={NextImage}` (provide width/height
 * in the item) for optimization. Avoids a module-scope `next/image` import,
 * which reads `process.env.__NEXT_IMAGE_OPTS` at load and throws outside Next.
 */
const useImage = (props: {
  image?: ImageProps | ImageProps[]
  imageComponent?: React.ElementType
}): React.ReactElement[] | null => {
  if (!props.image) return null

  const ImageEl: React.ElementType = props.imageComponent ?? 'img'

  const renderImage = (
    imageItem: ImageProps,
    index: number
  ): React.ReactElement => {
    const { url, alt = '', ...restProps } = imageItem

    if (!url) {
      throw new Error('URL is required for image')
    }

    return (
      <ImageEl
        key={`image-${index}`}
        src={url}
        alt={alt || 'image'}
        className={cssStyles.image}
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
