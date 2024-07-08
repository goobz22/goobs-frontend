import React from 'react'
import TransferList, { TransferListProps } from '../../../TransferList'
import { columnconfig, cellconfig } from '../../../Grid'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedTransferListProps
  extends Omit<TransferListProps, 'columnconfig'> {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
}

const useTransferList = (grid: {
  transferlist?: ExtendedTransferListProps | ExtendedTransferListProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.transferlist) return null

  const renderTransferList = (
    transferListItem: ExtendedTransferListProps,
    index: number
  ): columnconfig => {
    const {
      leftItems,
      rightItems,
      onChange,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = transferListItem

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
        <TransferList
          key={`transferlist-${index}`}
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
    return grid.transferlist.map((item, index) =>
      renderTransferList(item, index)
    )
  } else {
    return renderTransferList(grid.transferlist, 0)
  }
}

export default useTransferList
