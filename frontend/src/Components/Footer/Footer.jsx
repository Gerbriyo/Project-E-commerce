import React from 'react'
import './Footer.css'
import logo from '../Footer/logo.png'
import instagram_icon from '../Footer/instagram_icon.png'
import pintester_icon from '../Footer/pintester_icon.png'
import whatsapp_icon from '../Footer/whatsapp_icon.png'
const Footer = () => {
  return (
    <div className='footer'>
        <div className='footer-logo'>
            <img src={logo} alt='' style={{ width: '100px', height: '100px' }}/>
            <p>
            Alpha Finds
            </p>
        </div>
      <ul className='footer-links'>
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className='footer-social-icon'>
        <div className='footer-icons-container'>
            <img src={instagram_icon} alt=''/>
        </div>
        <div className='footer-icons-container'>
            <img src={pintester_icon} alt=''/>
        </div>
        <div className='footer-icons-container'>
            <img src={whatsapp_icon} alt=''/>
        </div>
      </div>
      <div className='footer-copyright'>
        <hr/>
        <p>Copyright @ 2024 - All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Footer
