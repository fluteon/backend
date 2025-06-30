import React from 'react'

const TearmsCondition = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-12 lg:px-24 flex flex-col lg:flex-row items-center justify-center gap-12">
      {/* Left: Text Content */}
      <div className="w-full lg:w-1/2 max-w-2xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Terms & Conditions - Fluteon
        </h2>
        <p className="text-gray-600 mb-4">
          Welcome to Fluteon! By accessing or using our website, you agree to be
          bound by the following terms and conditions. Please read them carefully.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          1. Use of Website
        </h3>
        <p className="text-gray-600 mb-4">
          Our site is intended for personal and non-commercial use. Any misuse,
          including fraudulent activities, will result in termination of your
          account and possible legal action.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          2. Orders & Payments
        </h3>
        <p className="text-gray-600 mb-4">
          All purchases made on Fluteon are subject to availability and
          confirmation of the order price. We reserve the right to cancel or
          refuse any order for any reason.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          3. Shipping & Returns
        </h3>
        <p className="text-gray-600 mb-4">
          We aim to deliver your order within the promised timeframe. Return
          policies are applicable only within 7 days of delivery, provided the
          product is unused and in original packaging.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          4. Intellectual Property
        </h3>
        <p className="text-gray-600 mb-4">
          All content on Fluteon, including images, logos, and designs, is the
          property of Fluteon and cannot be used without written permission.
        </p>

        <p className="text-sm text-gray-500 mt-6">
          Last updated: June 2025
        </p>
      </div>

      {/* Right: Illustration */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src="https://hub92prints.com/wp-content/uploads/2017/10/TermsAndConditions.jpg"
          alt="Terms and Conditions Illustration"
          className="w-full max-w-sm h-full object-contain rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}

export default TearmsCondition