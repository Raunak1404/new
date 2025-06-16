import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission to your backend
    alert('Your message has been sent!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow py-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-8">
                <Mail className="text-[var(--accent)] mr-3" size={28} />
                <h1 className="text-3xl font-bold">Contact Us</h1>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="card">
                    <h2 className="text-xl font-bold mb-6">Get in Touch</h2>
                    
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-12 h-12 rounded-full bg-[var(--accent)] bg-opacity-20 flex items-center justify-center text-[var(--accent)]">
                            <Mail size={20} />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">Email</h3>
                          <p className="text-[var(--text-secondary)] mt-1">support@codepractice.com</p>
                          <p className="text-sm text-[var(--text-secondary)]">For general inquiries</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-12 h-12 rounded-full bg-[var(--accent)] bg-opacity-20 flex items-center justify-center text-[var(--accent)]">
                            <Phone size={20} />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">Phone</h3>
                          <p className="text-[var(--text-secondary)] mt-1">+1 (555) 123-4567</p>
                          <p className="text-sm text-[var(--text-secondary)]">Mon-Fri, 9AM-5PM EST</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-12 h-12 rounded-full bg-[var(--accent)] bg-opacity-20 flex items-center justify-center text-[var(--accent)]">
                            <MapPin size={20} />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">Location</h3>
                          <p className="text-[var(--text-secondary)] mt-1">123 Coding Lane</p>
                          <p className="text-sm text-[var(--text-secondary)]">Tech City, TC 10101</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-12 h-12 rounded-full bg-[var(--accent)] bg-opacity-20 flex items-center justify-center text-[var(--accent)]">
                            <MessageSquare size={20} />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">Support</h3>
                          <p className="text-[var(--text-secondary)] mt-1">help@codepractice.com</p>
                          <p className="text-sm text-[var(--text-secondary)]">Technical support & issues</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card">
                    <h2 className="text-xl font-bold mb-4">Connect With Us</h2>
                    <p className="text-[var(--text-secondary)] mb-4">
                      Follow us on social media to stay updated with the latest coding challenges, tips, and community events.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center hover:bg-[var(--accent)] hover:bg-opacity-20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center hover:bg-[var(--accent)] hover:bg-opacity-20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center hover:bg-[var(--accent)] hover:bg-opacity-20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center hover:bg-[var(--accent)] hover:bg-opacity-20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center hover:bg-[var(--accent)] hover:bg-opacity-20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
                          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className="card">
                    <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-[var(--primary)] border border-gray-700 focus:outline-none focus:border-[var(--accent)]"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                            Your Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-[var(--primary)] border border-gray-700 focus:outline-none focus:border-[var(--accent)]"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 rounded-lg bg-[var(--primary)] border border-gray-700 focus:outline-none focus:border-[var(--accent)]"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="feedback">Feedback</option>
                          <option value="bug">Report a Bug</option>
                          <option value="feature">Feature Request</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-4 py-2 rounded-lg bg-[var(--primary)] border border-gray-700 focus:outline-none focus:border-[var(--accent)]"
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="btn-primary flex items-center justify-center"
                      >
                        <Send size={16} className="mr-2" />
                        Send Message
                      </button>
                    </form>
                  </div>
                  
                  {/* FAQ Section */}
                  <div className="card mt-8">
                    <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
                    
                    <div className="space-y-4">
                      {[
                        {
                          question: "How do I change my account details?",
                          answer: "You can update your account information from your profile page. Click on your profile picture, then select the edit icon next to your name or other details you wish to change."
                        },
                        {
                          question: "Can I use multiple programming languages?",
                          answer: "Yes, our platform supports multiple programming languages including Java, Python, C, C++, and JavaScript. You can select your preferred language from the dropdown menu in the code editor."
                        },
                        {
                          question: "How are ranked matches scored?",
                          answer: "Ranked matches are scored based on solution correctness, efficiency, and completion time. If both solutions are correct, the faster coder wins. Points awarded also depend on the difficulty of the problem and your current rank."
                        },
                        {
                          question: "Is there a mobile app available?",
                          answer: "We're currently developing mobile apps for iOS and Android. In the meantime, our website is fully responsive and optimized for mobile browsers."
                        }
                      ].map((faq, index) => (
                        <div key={index} className="bg-[var(--primary)] p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">{faq.question}</h3>
                          <p className="text-sm text-[var(--text-secondary)]">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ContactPage;