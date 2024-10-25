import React, { FC } from 'react'
import DashboardHeader from "./DashboardHeader"

type Props = {}

const DashboardHero:FC<Props> = (props) => {
  return (
    <div>
        <DashboardHeader />
    </div>
  )
}

export default DashboardHero