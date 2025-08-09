'use client'
import React from 'react'
import AccountNumber, {
  type AccountNumberProps,
} from '../../../Field/Number/AccountNumber'

const useAccountNumber = (props: {
  accountnumber?: AccountNumberProps | AccountNumberProps[]
}): React.ReactElement[] | null => {
  if (!props.accountnumber) return null

  const renderAccountNumber = (
    component: AccountNumberProps,
    index: number
  ): React.ReactElement => {
    return <AccountNumber key={`accountnumber-${index}`} {...component} />
  }

  if (Array.isArray(props.accountnumber)) {
    return props.accountnumber.map((item, index) =>
      renderAccountNumber(item, index)
    )
  } else {
    return [renderAccountNumber(props.accountnumber, 0)]
  }
}

export default useAccountNumber
