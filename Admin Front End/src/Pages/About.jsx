import React from 'react'
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate()
 return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        {/* Text content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">Fluteon</span>
          </h2>
          <p className="text-gray-600 mb-4">
            At Fluteon, we believe fashion is an expression of self-love and confidence. Our exclusive collection of women's clothing is curated to empower you with elegance, comfort, and timeless style.
          </p>
          <p className="text-gray-600 mb-6">
            Whether you're dressing for a casual day out or a special occasion, Fluteon brings you handpicked styles that embrace every moment with grace. Join our community and elevate your wardrobe with pieces that speak your story.
          </p>
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition"
            onClick={() =>navigate("/home")}
          >
            Explore Collection
          </button>
        </div>

        {/* Illustration */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="https://static.vecteezy.com/system/resources/previews/012/335/177/non_2x/online-shopping-concept-with-people-buying-things-in-a-web-online-store-men-and-women-choosing-clothes-in-an-online-shop-e-commerce-and-shopping-online-illustration-in-flat-style-vector.jpg"
            alt="About Fluteon - Women's Fashion"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default About