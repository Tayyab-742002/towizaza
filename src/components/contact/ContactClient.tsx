'use client';

import { useState } from 'react';
import HeroSection from './HeroSection';
import ContactFormSection from './ContactFormSection';
import ManagementSection from './ManagementSection';
import FaqSection from './FaqSection';
import SocialSection from './SocialSection';

export default function ContactClient() {
  // Track form submission status for notifications
  const [formSubmitStatus, setFormSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  // Handle form submission status from child components
  const handleFormSubmit = (status: 'success' | 'error', message: string) => {
    setFormSubmitStatus({
      type: status,
      message,
    });
    
    // Reset after 5 seconds
    setTimeout(() => {
      setFormSubmitStatus({
        type: null,
        message: '',
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Hero Section with parallax effect */}
      <HeroSection />
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Global notification for form submission */}
        {formSubmitStatus.type && (
          <div 
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl max-w-md ${
              formSubmitStatus.type === 'success' 
                ? 'bg-green-600/90 border border-green-400/20' 
                : 'bg-red-600/90 border border-red-400/20'
            } backdrop-blur-md text-white flex items-center gap-3`}
          >
            {formSubmitStatus.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
              </svg>
            )}
            <span>{formSubmitStatus.message}</span>
          </div>
        )}
        
        {/* Contact form and management info */}
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ContactFormSection onFormSubmit={handleFormSubmit} />
            <ManagementSection />
          </div>
        </div>
        
        {/* FAQ Section */}
        <FaqSection />
        
        {/* Social Connect Section */}
        <SocialSection />
      </div>
    </div>
  );
} 