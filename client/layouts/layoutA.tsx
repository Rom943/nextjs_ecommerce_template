import React from 'react'
import Nested from './nested'

type LayoutAProps = {
  name:string
}

const layoutA: React.FC<LayoutAProps> = ({name}) => {
  return (
    <div>{name}
        <Nested/>
    </div>
  )
}

export default layoutA