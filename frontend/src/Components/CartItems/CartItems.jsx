import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

    // Function to download the cart items as PDF
    const downloadCartItemsPDF = () => {
        const doc = new jsPDF();

        doc.text('Cart Items', 14, 10);  //position where the text "Cart Items" will be placed on the PDF document.

        const tableColumn = ["Product Title", "Price", "Quantity", "Total"];
        const tableRows = [];

        all_product.forEach((e) => {
            if (cartItems[e.id] > 0) {
                const productData = [
                    e.name,
                    `₹${e.new_price}`,
                    cartItems[e.id],
                    `₹${e.new_price * cartItems[e.id]}`
                ];
                tableRows.push(productData);
            }
        });

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.text(`Total: ₹${getTotalCartAmount()}`, 14, doc.lastAutoTable.finalY + 10);
        doc.save("cart_items.pdf");
    };

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return (
                        <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt="" className='carticon-product-icon' />
                                <p>{e.name}</p>
                                <p>₹{e.new_price}</p>
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p>₹{e.new_price * cartItems[e.id]}</p>
                                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <hl>Cart Totals</hl>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>₹{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>₹{getTotalCartAmount()}</h3>
                        </div>
                        <button onClick={downloadCartItemsPDF}>Proceed to Checkout</button>
                    </div>
                    <div className='cartitems-promocode'>
                        <p>Enter the Promocode</p>
                        <div className='cartitems-promobox'>
                            <input type="text" placeholder='Promo code' />
                            <button>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;
