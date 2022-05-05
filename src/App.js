import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import {Products, Navbar, Cart, Checkout} from './Components';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';


function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');


  const fetchProducts = async () => {
       const { data } = await commerce.products.list();

       setProducts(data);
  }

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  }

  const handleAddToCart = async (productid, quantity) => {
   const {cart} = await commerce.cart.add(productid, quantity);

   setCart(cart);
}

const handleUpdateCartQty = async (productid, quantity) => {
  const {cart} = await commerce.cart.update(productid, {quantity});

  setCart(cart);
}

const handleRemoveFromCart = async (productid) => {
  const {cart} = await commerce.cart.remove(productid);

  setCart(cart);
}

const handleEmptyCart = async () => {
  const {cart} = await commerce.cart.empty();

  setCart(cart);
}

const refreshCart = async () =>{
  const newCart = await commerce.cart.refresh();
  setCart(newCart);
}

const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
  try {
      const inComingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
      setOrder(inComingOrder);
      refreshCart();

  } catch (error) {
    setErrorMessage(error.data.error.message);
    
  }
}


  useEffect(() =>{
       fetchProducts();
       fetchCart();
  }, []);

 
 //console.log(cart)

  return (

    <Router>
      <div>
         <Navbar totalItems = {cart.total_items}/>
         <Routes>
            <Route path='/' element={<Products products = {products} onAddToCart = {handleAddToCart}/>} />
            <Route path='/cart' element={<Cart cart={cart} 
            handleUpdateCartQty = {handleUpdateCartQty}
            handleRemoveFromCart = {handleRemoveFromCart}
            handleEmptyCart = {handleEmptyCart}
            />} />
             
            <Route path='/checkout' element={<Checkout cart={cart}
            order = {order}
            onCaptureCheckout = {handleCaptureCheckout}
            error = {errorMessage}
            />} />
          </Routes>
      </div>
   </Router>
    
  )
}

export default App
 