import React from 'react'
import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

function SocilaMediaConnection() {
  return (
    <>
       <div className="fixed bottom-5 right-5 grid  bg-white  gap-1 shadow-lg p-4 rounded-full">
      <Link
        to="https://chat.whatsapp.com/invite/YOUR_GROUP_ID_HERE" // Add your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 text-3xl hover:scale-110 transition-transform"
      >
        <FaWhatsapp />
      </Link>
      <Link
        to="https://www.instagram.com/YOUR_USERNAME_HERE"
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-500 text-3xl hover:scale-110 transition-transform"
      >
        <FaInstagram />
      </Link>
      <Link
        to="https://www.linkedin.com/in/YOUR_PROFILE_NAME_HERE"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 text-3xl hover:scale-110 transition-transform"
      >
        <FaLinkedin />
      </Link>
    </div>
    </>
  )
}

export default SocilaMediaConnection



