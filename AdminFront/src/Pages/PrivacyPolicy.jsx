import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-12 lg:px-24 flex flex-col lg:flex-row items-center justify-center gap-12">
      {/* Left: Text Content */}
      <div className="w-full lg:w-1/2 max-w-2xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Privacy Policy - Fluteon
        </h2>
        <p className="text-gray-600 mb-4">
          At Fluteon, your privacy is of utmost importance to us. We are
          committed to protecting the personal information of our users,
          customers, and visitors. This privacy policy outlines how we collect,
          use, and safeguard your data.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          What We Collect:
        </h3>
        <ul className="list-disc ml-5 text-gray-600 space-y-1">
          <li>Name, phone number, and shipping address</li>
          <li>Payment details (processed securely)</li>
          <li>Browsing behavior and interaction on Fluteon</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          How We Use Your Information:
        </h3>
        <ul className="list-disc ml-5 text-gray-600 space-y-1">
          <li>To process your orders smoothly</li>
          <li>To improve your shopping experience</li>
          <li>To provide customer support and updates</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          Your Consent & Control:
        </h3>
        <p className="text-gray-600">
          By using Fluteon, you consent to our privacy policy. You have full
          control over your personal data and can request to update or delete
          your data at any time.
        </p>

        <p className="text-sm text-gray-500 mt-6">
          Last updated: June 2025
        </p>
      </div>

      {/* Right: Illustration */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src="https://hub92prints.com/wp-content/uploads/2017/10/TermsAndConditions.jpg"
          alt="Privacy Policy Illustration"
          className="w-full max-w-sm h-full object-contain rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}

export default PrivacyPolicy