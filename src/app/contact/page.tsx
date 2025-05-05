export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-10">Contact</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <section className="glass-dark p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Booking Inquiries</h2>
            <p className="text-light/80 mb-8">
              Interested in booking Towizaza for a show, festival, or private event? Fill out the form below with your event details.
            </p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-light/80 mb-2" htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    className="w-full bg-dark/50 border border-light/20 rounded px-4 py-2 focus:outline-none focus:border-accent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-light/80 mb-2" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    className="w-full bg-dark/50 border border-light/20 rounded px-4 py-2 focus:outline-none focus:border-accent"
                    placeholder="Your email"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-light/80 mb-2" htmlFor="event-type">Event Type</label>
                <select 
                  id="event-type"
                  className="w-full bg-dark/50 border border-light/20 rounded px-4 py-2 focus:outline-none focus:border-accent appearance-none"
                >
                  <option value="">Select event type</option>
                  <option value="festival">Festival</option>
                  <option value="club">Club Night</option>
                  <option value="private">Private Event</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-light/80 mb-2" htmlFor="event-date">Event Date</label>
                <input 
                  type="date" 
                  id="event-date"
                  className="w-full bg-dark/50 border border-light/20 rounded px-4 py-2 focus:outline-none focus:border-accent"
                />
              </div>
              
              <div>
                <label className="block text-light/80 mb-2" htmlFor="message">Event Details</label>
                <textarea 
                  id="message"
                  rows={4}
                  className="w-full bg-dark/50 border border-light/20 rounded px-4 py-2 focus:outline-none focus:border-accent"
                  placeholder="Tell us about your event..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-light font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
              >
                Submit Inquiry
              </button>
            </form>
          </section>
          
          {/* Management Info */}
          <section>
            <div className="glass p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-bold mb-6">Management</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Artist Management</h3>
                    <p className="text-light/80">Maya Daniels</p>
                    <a href="mailto:management@towizaza.com" className="text-accent hover:text-accent/80">
                      management@towizaza.com
                    </a>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Booking Agent</h3>
                    <p className="text-light/80">Alex Rivera</p>
                    <a href="mailto:bookings@towizaza.com" className="text-accent hover:text-accent/80">
                      bookings@towizaza.com
                    </a>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Press Inquiries</h3>
                    <p className="text-light/80">Jamie Wong</p>
                    <a href="mailto:press@towizaza.com" className="text-accent hover:text-accent/80">
                      press@towizaza.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fan Mail Section */}
            <div className="glass-dark p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-6">Fan Mail</h2>
              <p className="text-light/80 mb-6">
                Want to send a message directly to Towizaza? Drop a note here and it will be personally read.
              </p>
              
              <form className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    className="w-full bg-dark/50 border border-light/20 rounded px-4 py-2 focus:outline-none focus:border-accent"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <textarea 
                    rows={3}
                    className="w-full bg-dark/50 border border-light/20 rounded px-4 py-2 focus:outline-none focus:border-accent"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-light py-2 px-6 rounded-full w-full"
                >
                  Send Message
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 