import React from 'react';
import Header from '../section/Header2';

const AboutUs = () => {
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-100" style={{ marginTop: '60px' }}>
      {/* About Us Section */}
      <div className="bg-blue-500 text-black py-12">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl mb-8">
            At Gamage Recruiters, we believe in connecting talented individuals with opportunities that align with their aspirations and potential. Established with a mission to revolutionize recruitment, we take pride in being a trusted partner for both employers and job seekers.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
            <p className="text-gray-600">
              To bridge the gap between top-tier talent and thriving organizations by providing innovative, reliable, and tailored recruitment solutions.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">What We Offer</h2>
            <ul className="space-y-4 text-gray-600">
              <li><strong>For Employers:</strong> Comprehensive staffing solutions, ensuring you find the right candidate who aligns with your company's vision and culture.</li>
              <li><strong>For Job Seekers:</strong> A seamless experience to discover roles that match your skills, values, and career ambitions.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">Why Choose Us?</h2>
          <ul className="space-y-4 text-gray-600">
            <li><strong>Personalized Service:</strong> Every client and candidate is unique. We tailor our approach to meet your specific needs.</li>
            <li><strong>Professional Expertise:</strong> With years of experience in the recruitment industry, our team ensures the highest standards in every process.</li>
            <li><strong>Results-Driven Approach:</strong> Your success is our priority. We focus on delivering impactful results that create long-term value.</li>
          </ul>
        </div>

        <div className="text-center mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">Join Us in Shaping Careers</h2>
          <p className="text-gray-600 mt-4">
            Whether you're seeking the perfect candidate to drive your business forward or searching for your dream job, <strong>Gamage Recruiters</strong> is here to make it happen. Let’s grow together!
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default AboutUs;
