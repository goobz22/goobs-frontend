'use client'
import React from 'react'
import RoutingNumber, {
  RoutingNumberProps,
} from '../../../Field/Number/RoutingNumber'

const useRoutingNumber = (props: {
  routingnumber?: RoutingNumberProps | RoutingNumberProps[]
}): React.ReactElement[] | null => {
  if (!props.routingnumber) return null

  const renderRoutingNumber = (
    component: RoutingNumberProps,
    index: number
  ): React.ReactElement => {
    return <RoutingNumber key={`routingnumber-${index}`} {...component} />
  }

  if (Array.isArray(props.routingnumber)) {
    return props.routingnumber.map((item, index) =>
      renderRoutingNumber(item, index)
    )
  } else {
    return [renderRoutingNumber(props.routingnumber, 0)]
  }
}

export default useRoutingNumber
