import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: ""
    });
    const [loading, setLoading] = useState(false); // loading state for async operations.
    const [error, setError] = useState(null);

    const imageHandler = (e) => {   //handle the file input change event and update
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {   //handle changes in the input fields and update
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { name, old_price, new_price } = productDetails;
        if (!name || !old_price || !new_price || !image) {
            return false;
        }
        return true;
    };

    const Add_Product = async () => {
        if (!validateForm()) {   //validate the form, ensuring all required fields are filled 
            alert("Please fill all fields and upload an image.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            let responseData;
            let formData = new FormData();
            formData.append('file', image);

            const imageResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData,
            });
            const imageData = await imageResponse.json();
            if (imageData.success) {
                productDetails.image = imageData.image_url;

                const productResponse = await fetch('http://localhost:4000/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productDetails),
                });
                const productData = await productResponse.json();
                if (productData.success) {
                    alert("Product Added");
                    setProductDetails({
                        name: "",
                        image: "",
                        category: "women",
                        new_price: "",
                        old_price: ""
                    });
                    setImage(null);
                } else {
                    alert("Failed to add product");
                }
            } else {
                alert("Failed to upload image");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='add-product'>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <div className='addproduct-itemfield'>
                <p>Product Title</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type='text'
                    name='name'
                    placeholder='Enter Product'
                />
            </div>

            <div className='addproduct-price'>
                <div className='addproduct-itemfield'>
                    <p>Price</p>
                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type='text'
                        name='old_price'
                        placeholder='Enter Old Price'
                    />
                </div>
                <div className='addproduct-itemfield'>
                    <p>Offer Price</p>
                    <input
                        value={productDetails.new_price}
                        onChange={changeHandler}
                        type='text'
                        name='new_price'
                        placeholder='Enter New Price'
                    />
                </div>
            </div>
            <div className='addproduct-itemfield'>
                <p>Product Category</p>
                <select
                    value={productDetails.category}
                    onChange={changeHandler}
                    name='category'
                    className='add-product-selector'
                >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kids</option>
                </select>
            </div>
            <div className='addproduct-itemfield'>
                <label htmlFor='file-input'>
                    <img
                        src={image ? URL.createObjectURL(image) : upload_area}
                        className='addproduct-thumnail-img'
                        alt=""
                    />
                </label>
                <input
                    onChange={imageHandler}
                    type='file'
                    name='image'
                    id='file-input'
                    hidden
                />
            </div>
            <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
        </div>
    );
};

export default AddProduct;
