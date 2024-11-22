import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import axiosInstance from '../config/axios';

const initialLeads = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    companyName: 'Tech Innovations Inc.',
    linkedinProfile: 'https://linkedin.com/in/johndoe',
    jobTitle: 'Sales Manager',
    emailAddress: 'john.doe@techinnovations.com',
    phoneNumber: '+1 (555) 123-4567',
  },
];

const LeadsListPage = () => {
  const [leads, setLeads] = useState(initialLeads);
  const [currentPage, setCurrentPage] = useState(1);
  const [revealedEmails, setRevealedEmails] = useState(new Set());
  const leadsPerPage = 5;

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount, leadId) => {
    const data = JSON.stringify({
      amount: amount * 100,
      currency: 'INR',
    });

    const config = {
      method: 'post',
      url: 'http://localhost:5000/api/payments/create-order',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    try {
      const response = await axiosInstance.request(config);
      handleRazorpayScreen(response.data.amount, leadId);
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
    }
  };

  const handleRazorpayScreen = async (amount, leadId) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Failed to load Razorpay SDK. Check your internet connection.');
      return;
    }

    const options = {
      key: 'rzp_test_SrrurMUZ8xOO7f',
      amount: amount,
      currency: 'INR',
      name: 'Leads Management',
      description: 'Reveal email payment',
      handler: function (response) {
        console.log('Payment successful:', response);
        handleRevealEmail(leadId);
      },
      prefill: {
        name: 'Leads Management User',
        email: 'user@example.com',
      },
      theme: {
        color: '#F4C430',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // Email reveal handler
  const handleRevealEmail = (leadId) => {
    setRevealedEmails((prev) => new Set(prev).add(leadId));
  };

  // Pagination calculations
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  // Pagination handlers
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Leads Management</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {currentLeads.map((lead) => (
              <div
                key={lead.id}
                className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </h3>
                  <p className="text-gray-600">{lead.companyName}</p>
                  <p className="text-sm text-gray-500">{lead.jobTitle}</p>
                  <a
                    href={lead.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    LinkedIn Profile
                  </a>
                  <p className="mt-2 text-gray-700">Phone: {lead.phoneNumber}</p>
                </div>
                <div>
                  {revealedEmails.has(lead.id) ? (
                    <p className="text-green-600 font-medium">
                      {lead.emailAddress}
                    </p>
                  ) : (
                    <button
                      onClick={() => createRazorpayOrder(100, lead.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                     Pay to Reveal Email
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" /> Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next <ChevronRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsListPage;
