import React from 'react'


export type CartLayoutProps = {
    defualtLayout: string;
    customLayout?: string;
}

const Cart:React.FC<CartLayoutProps> = ({defualtLayout,customLayout}) => {

 const CartLayout = require(`../../layouts/${customLayout?customLayout:defualtLayout}/components/cart/Cart.tsx`).default;

  return <CartLayout/>
}

export default Cart;