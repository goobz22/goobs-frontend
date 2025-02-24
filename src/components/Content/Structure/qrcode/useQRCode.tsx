import React from 'react'
import QRCodeComponent, { QRCodeProps } from '../../../../components/QRCode'

const useQRCode = (props: {
  qrcode?: QRCodeProps | QRCodeProps[]
}): React.ReactElement[] | null => {
  if (!props.qrcode) return null

  const renderQRCode = (
    component: QRCodeProps,
    index: number
  ): React.ReactElement => {
    return <QRCodeComponent key={`qrcode-${index}`} {...component} />
  }

  if (Array.isArray(props.qrcode)) {
    return props.qrcode.map((item, index) => renderQRCode(item, index))
  } else {
    return [renderQRCode(props.qrcode, 0)]
  }
}

export default useQRCode
