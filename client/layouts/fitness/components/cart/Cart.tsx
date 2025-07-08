import React, { useState } from "react";
import cartIcon from "./market.png";
import styles from "./Cart.module.css";

const Cart: React.FC = () => {
  const [displayCart, setDisplayCart] = useState<boolean>(false);

  return (
    <>
      <div className={styles.cart_icon_container}>
        <img
          onClick={() => setDisplayCart(!displayCart)}
          width={30}
          height={30}
          src={cartIcon.src}
        />
      </div>
      {displayCart && 
      <div className={styles.cart_container} onMouseLeave={() => setDisplayCart(false)}>
        cart
      </div>}
    </>
  );
};

export default Cart;
