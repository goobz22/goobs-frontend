import React from 'react'
import TransferList, { type TransferListProps } from '../../../TransferList'

const useTransferList = (props: {
  transferlist?: TransferListProps | TransferListProps[]
}): React.ReactElement[] | null => {
  if (!props.transferlist) return null

  const renderTransferList = (
    transferListItem: TransferListProps,
    index: number
  ): React.ReactElement => {
    return <TransferList key={`transferlist-${index}`} {...transferListItem} />
  }

  if (Array.isArray(props.transferlist)) {
    return props.transferlist.map((item, index) =>
      renderTransferList(item, index)
    )
  } else {
    return [renderTransferList(props.transferlist, 0)]
  }
}

export default useTransferList
