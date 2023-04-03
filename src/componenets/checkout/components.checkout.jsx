import "./components.checkout.css"
import productsData from "../../data/data.products.json";
import React, { useState ,useEffect} from 'react'
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";


const Checkout = ({fbProducts,orderedItems,setOrderedItems,uremail,cartCount,setCartCount,cartItems,setCartItems,totalPrice,setTotalPrice}) => {
  // useEffect(() => {
  //   const getCartProducts = async () => {
  //     try {
  //       const cartProductsRef = await db.collection('users').where("email","==",`${uremail}`).get();
  //       if (!cartProductsRef.empty) {
  //         const cartProducts = cartProductsRef.docs[0].data().cartItems;
    
  //         if (cartProducts !== []) {
  //           console.log("cartProducts" , cartProducts)
  //           let sub = [];
  //           cartProducts.forEach((i) => {
  //             sub = i.split(",");
  //             setCartItems([sub[0],parseInt(sub[1]),sub[2],parseInt(sub[3])]);
  //             console.log(sub)
  //           });
  //         } else {
  //           setCartItems([])
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
    
    
    
  //   getCartProducts();
  // }, [uid]);
  useEffect(()=>{
    const setCartProducts = async () => {
      console.log("cartItems",cartItems)
      const userRef = await db.collection('users').where("email","==",`${uremail}`).get();
      const docSnapshot = userRef.docs[0]; // Get the first document in the QuerySnapshot
      console.log(docSnapshot)
      localStorage.setItem("cartItems",JSON.stringify(cartItems))
      localStorage.setItem("orderedItems",JSON.stringify(orderedItems))

      let ci = cartItems.map((i) => {
        return [i[0],String(i[1]),i[2],String(i[3])].join(",")
      })
      let di = orderedItems.map((i) => {
        return [i[0],String(i[1]),i[2],String(i[3])].join(",")
      })
      
       docSnapshot.ref.update({ cartItems: ci })
       docSnapshot.ref.update({ orderedItems: di })
       
      .then(() => {
        console.log("Cart items updated successfully"); 
      })
      .catch((error) => {
        console.error("Error updating cart items: ", error);
      });

    }
    setCartProducts()
  },[cartItems,uremail,cartCount,orderedItems])

  //increases or decreases the count in the checkout page also if the count is zero it removes from the checkout
  const quantityChanger = (mpSku,op,mpPrice) => {
      let newCartItems = cartItems.map((i) => { 
        console.log("i", typeof(i))
        console.log("i", i)

          // i = i.split(",")

        
        // console.log("bi", typeof(i))
        // console.log("bi", i)


        // console.log("i", i)
        if (i[1]==0){
          return "null"
        }
        if (i[0] == mpSku && op=="+"){
          return [i[0],String(parseInt(i[1])+1),i[2],i[3]]
        }else if(i[0] == mpSku && op=="-"){
          return [i[0],String(parseInt(i[1])-1),i[2],i[3]]

        }
        else{
          return i
        }

      })
      newCartItems = newCartItems.filter((i) => {
        return true ? i[1]!=0 : false
      })
      console.log("newCArtItems",newCartItems)
      let p = 0
      let sum=0
      for (let i in newCartItems){
        p= p+ (parseInt(newCartItems[i][1])*parseInt(newCartItems[i][3]))
        sum+= parseInt(newCartItems[i][1])
        // console.log("count",newCartItems[i][1])
        // console.log("i-price",newCartItems[i][3])
        // console.log("price",p)
      }

      setTotalPrice(p)
      setCartCount(sum)
      setCartItems(newCartItems)
      localStorage.setItem("cartItems",JSON.stringify(cartItems))

    
  }

  // sets the total price by multiplying count and price and finally by summing those
  useEffect(() => {
    let p = 0
    console.log("type",typeof(cartItems),cartItems)
      for (let i in cartItems){

        let it = cartItems[i]
        console.log("it",it)
        p= p+ (parseInt(it[1])*parseInt(it[3]))
        // console.log("c i",cartItems[i])
        // console.log("c i 0",cartItems[i][0])
        // console.log("price",p)
      }
      setTotalPrice(p)
}, [cartCount])
  
  
  
  return (
    <>
      <h1>check out</h1>
    
    <div className="checkout-card-holder">

    {cartItems.map((item) => {
      // let matchingProduct = fbProducts.find((product) => product.sku == item[0]);
      console.log("item",typeof(item))
      for (let i in fbProducts){
        // console.log("fb.p.sku",fbProducts[i].sku)




        // console.log("item[0]",item)
     
          if (fbProducts[i].sku=== item[0]){
            var matchingProduct = fbProducts[i]
            break
          }
        
      }
      console.log("mp",matchingProduct)
      // console.log("fb",fbProducts)
      // console.log("item",item)
      // console.log("mp",matchingProduct)
      return (
        <div key={item[0]} className="checkout-card"> 
          {matchingProduct && (
            <>
              <div>
                <Link to={`/dresses/${matchingProduct.sku}`}><img src={matchingProduct.image} alt="" /></Link>
              <h1>{matchingProduct.name} </h1>
              <p>${matchingProduct.price}</p>
              </div>
              <div>
              <button onClick={()=>quantityChanger(matchingProduct.sku,"+",matchingProduct.price)}>+</button>
              <p>quantity: {item[1]}</p>
              <button onClick={()=>quantityChanger(matchingProduct.sku,"-")}>-</button>
              </div>
            </>
          )}
        </div>
      );
    })}
    </div>
    <p>Total price  :   {totalPrice}</p>
    <button onClick={() => {
      console.log("order itrems" ,cartItems)
      setOrderedItems((prev) => {return prev ? prev.concat(cartItems) : cartItems})
      localStorage.setItem("orderedItems" , JSON.stringify(orderedItems))
      setCartItems([])
      setCartCount(0)
      localStorage.setItem("cartItems",JSON.stringify([]))
      localStorage.setItem("cartCount",0)
      }}>Buy now</button>
    </>

  );
};


export default Checkout