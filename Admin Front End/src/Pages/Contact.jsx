import { Button } from '@mui/material';
import React from 'react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to send form data (e.g., via emailjs or backend API)
    alert("Message submitted!");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row items-stretch justify-center gap-10 px-6 py-12 lg:px-24">
      
      {/* Left: Contact Form */}
      <div className="w-full lg:w-1/2 max-w-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch with <span className="text-pink-600">Fluteon</span></h2>
        <p className="text-gray-600 mb-8">
          Have questions about our collection or need styling advice? We’re here to help! Fill out the form below.
        </p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="Your Phone Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Your Message</label>
            <textarea
              rows="5"
              placeholder="How can we assist you?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

<Button
  type="submit"
  variant="contained"
  sx={{
    width: '100%',
    backgroundColor: '#ec4899', // Tailwind's pink-600
    color: 'white', // Tailwind's indigo-900
    fontWeight: '600',
    paddingY: '8px',
    borderRadius: '8px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#db2777', // Tailwind's pink-700
    },
  }}
>
  Send Message
</Button>
        </form>
      </div>

      {/* Right: Contact Illustration */}
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/contact-us-illustration-download-in-svg-png-gif-file-formats--call-logo-laptop-helping-customer-service-pack-network-communication-illustrations-2912020.png"
          alt="Customer service call"
          className="h-full max-h-[600px] rounded-lg shadow-md object-contain"
        />
      </div>
    </div>
  );
};

export default Contact;
