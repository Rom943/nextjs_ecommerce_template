import React from 'react'

type LayoutAProps = {
  name:string
}

const layoutB:React.FC<LayoutAProps> = ({name}) => {
  return (

    <div>{name}layoutB</div>
  )
}

export default layoutB