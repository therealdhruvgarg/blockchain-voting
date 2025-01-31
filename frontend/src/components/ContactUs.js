import React, { useState } from 'react';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!name || !email || !message) {
      setError('Please fill in all fields.');
      return;
    }

    // Simulate a successful form submission (You would send this data to a backend in a real-world app)
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Block - Contact Us Form (Reduced width) */}
        <div className="lg:w-2/3 w-full">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Contact Us</h1>

          {/* Thank You message */}
          {isSubmitted ? (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-green-600">Thank you for contacting us!</h2>
              <p className="text-gray-600 mt-4">We have received your message and will get back to you as soon as possible.</p>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && <p className="text-red-500 text-center">{error}</p>}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows="6"
                    placeholder="Enter your message"
                    required
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Right Block - Contact Information and Map (Wider width) */}
        <div className="lg:w-1/3 w-full border-l-2 pl-8 lg:pl-12 pt-8 lg:pt-0">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <p className="text-gray-600 mb-4">If you have any questions or need assistance, feel free to reach out to us:</p>

          <div>
            <p className="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:info@bharat-evoting.gov.in" className="text-blue-500">info@bharat-evoting.gov.in</a></p>
            <p className="text-gray-700"><strong>Phone:</strong> <a href="tel:+91800111950" className="text-blue-500">1800-111-950</a></p>
          </div>

          {/* Embedded Google Map */}
          <div className="mt-6">
            <iframe
              width="100%"
              height="300"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111985.01669348642!2d77.08018244335935!3d28.703649900000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd4cbd110c0f%3A0xe294167d37eebede!2sElection%20Commission%20of%20India-%20ECI%20HQ!5e0!3m2!1sen!2sin!4v1736588392418!5m2!1sen!2sin"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              title="Map Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
