import React from 'react'
import TransferList, { TransferListProps } from '../../../TransferList'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedTransferListProps extends TransferListProps {
  columnconfig?: columnconfig
  cellconfig?: cellconfig
}

const useTransferList = (grid: {
  transferlist?: ExtendedTransferListProps | ExtendedTransferListProps[]
}) => {
  if (!grid.transferlist) return null

  const renderTransferList = (
    transferListItem: ExtendedTransferListProps
  ): columnconfig => {
    const {
      leftItems,
      rightItems,
      onChange,
      columnconfig,
      cellconfig,
      ...restProps
    } = transferListItem

    const mergedConfig: columnconfig = {
      ...columnconfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <TransferList
          leftItems={leftItems}
          rightItems={rightItems}
          onChange={onChange}
          {...restProps}
        />
      ),
    }

    return mergedConfig
  }

  if (Array.isArray(grid.transferlist)) {
    return grid.transferlist.map(renderTransferList)
  } else {
    return renderTransferList(grid.transferlist)
  }
}

export default useTransferList
