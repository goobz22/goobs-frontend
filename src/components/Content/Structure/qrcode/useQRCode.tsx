import React from 'react'
import QRCodeComponent, { QRCodeProps } from '../../../../components/QRCode'
import { columnconfig, cellconfig } from '../../../Grid'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedQRCodeProps extends Omit<QRCodeProps, 'sx'> {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
}

const useQRCode = (grid: {
  qrcode?: ExtendedQRCodeProps | ExtendedQRCodeProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.qrcode) return null

  const renderQRCode = (
    component: ExtendedQRCodeProps,
    index: number
  ): columnconfig => {
    const {
      value,
      size,
      title,
      columnconfig: itemColumnConfig,
      cellconfig,
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
      },
      component: (
        <QRCodeComponent
          key={`qrcode-${index}`}
          value={value}
          size={size}
          title={title}
          {...restProps}
        />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.qrcode)) {
    return grid.qrcode.map(renderQRCode)
  } else {
    return renderQRCode(grid.qrcode, 0)
  }
}

export default useQRCode
