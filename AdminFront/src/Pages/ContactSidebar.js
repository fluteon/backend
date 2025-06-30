import React from 'react';
import { motion } from 'framer-motion';
import { WhatsApp, Email, Instagram, Facebook } from '@mui/icons-material';

const socialLinks = [
  {
    name: 'WhatsApp',
    icon: <WhatsApp />,
    link: 'https://wa.me/9892550941',
    color: '#25D366',
  },
  {
    name: 'Gmail',
    icon: <Email />,
    link: 'mailto:yourname@gmail.com',
    color: '#D44638',
  },
  {
    name: 'Instagram',
    icon: <Instagram />,
    link: 'https://www.instagram.com/fluteon1?igsh=NDFhZXBvamdzcnFr',
    color: '#E1306C',
  },
  {
    name: 'Facebook',
    icon: <Facebook />,
    link: 'https://www.facebook.com/share/1GGkBWgRpV/',
    color: '#3b5998',
  },
];

const ContactSidebar = () => {
  return (
<div className="fixed top-1/2 -translate-x-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-2 shadow-lg p-4 rounded-full">
      {socialLinks.map(({ name, icon, link, color }, index) => (
        <motion.a
          key={index}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full shadow-lg p-3 bg-white hover:bg-gray-100 "
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          style={{ color }}
          title={`Contact us on ${name}`}
        >
          {icon}
        </motion.a>
      ))}
    </div>
  );
};

export default ContactSidebar;
