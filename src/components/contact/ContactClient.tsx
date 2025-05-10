"use client";

import { useState } from "react";
import HeroSection from "./HeroSection";
import ContactFormSection from "./ContactFormSection";
import ManagementSection from "./ManagementSection";
import FaqSection from "./FaqSection";
import SocialSection from "./SocialSection";
import { ToastContainer, toast, Bounce } from "react-toastify";
export default function ContactClient() {
  // Track form submission status for notifications
  const [formSubmitStatus, setFormSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  // Handle form submission status from child components
  const handleFormSubmit = (status: "success" | "error", message: string) => {
    setFormSubmitStatus({
      type: status,
      message,
    });
    if (status == "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      toast.error("🦄 Wow so easy!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Hero Section with parallax effect */}
      <HeroSection />

      {/* Main content */}
      <div className="relative z-10">
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}
