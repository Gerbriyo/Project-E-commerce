import React from 'react'
import './NewsLetter.css'
const NewsLetter = () => {
  return (
    <div className='newsletter'>
      <h1>Get Offers Note Through Email</h1>
      <p>Stay Updated with Alpha Finds</p>
      <div>
        <input type='email' placeholder='Enter your email'/>
        <button>Subscribe</button>
      </div>
    </div>
  )
}

export default NewsLetter
