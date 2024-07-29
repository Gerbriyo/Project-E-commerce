import React from 'react'
import './Listing.css'
import arrow_icon from '../Listing/listing_arrow.png'

const Listing = (props) => {
    const{product}=props;
  return (
    <div className='listing'>
      HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {product.category} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  )
}

export default Listing
