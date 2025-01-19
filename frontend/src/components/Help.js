import React, { useState } from "react";

const Help = () => {
  const [question, setQuestion] = useState(""); // User's new question
  const [submitted, setSubmitted] = useState(false); // Track question submission state
  const [relatedQuestions, setRelatedQuestions] = useState([]); // Related questions after submitting a question

  const [activeFaq, setActiveFaq] = useState(null); // Track which FAQ is open (for collapsible behavior)

  // FAQs Data
  const faqs = [
    {
      question: "How do I register to vote?",
      answer: "To register, fill in your details, verify your phone number with an OTP, and complete the registration process.",
    },
    {
      question: "What do I need to log in?",
      answer: "You will need your Voter ID and Date of Birth to log in to the voting portal.",
    },
    {
      question: "Can I vote from anywhere?",
      answer: "Yes, as long as you are a registered voter and have access to the voting portal.",
    },
    {
      question: "How can I change my voter details?",
      answer: "You can update your details by visiting the voter registration page and submitting the necessary information.",
    },
  ];

  // Function to handle related questions based on user input
  const handleRelatedQuestions = (question) => {
    if (question.toLowerCase().includes("login")) {
      return [
        "How do I recover my Voter ID?",
        "What do I do if I forget my password?",
        "Can I log in from a different device?",
      ];
    } else if (question.toLowerCase().includes("register")) {
      return [
        "How can I cancel my registration?",
        "How do I check the status of my registration?",
        "What documents do I need for registration?",
      ];
    }
    return [];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setRelatedQuestions(handleRelatedQuestions(question));
  };

  // Toggle the visibility of the answer in FAQ (collapsible)
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Help & FAQs</h1>

      {/* FAQs Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-300 p-4 rounded-lg shadow-md hover:bg-gray-50 transition-all"
            >
              <button
                className="text-left w-full font-medium text-gray-800 flex justify-between items-center"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <span className="text-blue-500">
                  {activeFaq === index ? "▼" : "▶"}
                </span>
              </button>
              {activeFaq === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ask a Question Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800">Didn't Find Your Answer?</h2>
        <p className="text-gray-700">Feel free to ask us a question!</p>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <textarea
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Question
          </button>
        </form>

        {submitted && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800">Your Question:</h3>
            <p className="text-gray-700">{question}</p>
            <h3 className="mt-4 text-lg font-medium text-gray-800">Related Questions:</h3>
            <ul className="space-y-2 text-gray-600">
              {relatedQuestions.length > 0 ? (
                relatedQuestions.map((relatedQuestion, index) => (
                  <li key={index} className="list-disc pl-5">{relatedQuestion}</li>
                ))
              ) : (
                <p className="text-gray-500">No related questions found.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;
