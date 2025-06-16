import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Star, Users, Award, Swords, BookOpen, ChevronDown } from 'lucide-react';
import LogoIcon from '../components/LogoIcon';
import PageTransition from '../components/PageTransition';

const HomePage = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Floating animation variants
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: { 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  };

  // Pulse animation variants
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 3, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  };

  // Rotate animation variants
  const rotateAnimation = {
    rotate: [0, 5, 0, -5, 0],
    transition: { 
      duration: 5, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  };

  // Background blob animation variants
  const blobAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.5, 0.7, 0.5],
    transition: { 
      duration: 8, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <header className="bg-[var(--primary)] relative min-h-screen flex items-center">
          {/* Animated background */}
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Animated blobs */}
            <motion.div 
              className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--accent)] filter blur-[200px] opacity-10"
              animate={blobAnimation}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent-secondary)] filter blur-[180px] opacity-10"
              animate={{
                ...blobAnimation,
                transition: { 
                  ...blobAnimation.transition,
                  delay: 2 
                }
              }}
            />
            <motion.div 
              className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full bg-purple-500 filter blur-[150px] opacity-5"
              animate={{
                ...blobAnimation,
                transition: { 
                  ...blobAnimation.transition,
                  delay: 4 
                }
              }}
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14] to-[var(--primary)] opacity-50"></div>
          <div className="container-custom z-10 py-24">
            <nav className="flex justify-between items-center mb-16">
              <motion.div 
                className="flex items-center gap-3 click-animate hover:scale-105 transition-transform"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <LogoIcon size={40} />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]">
                    CodoSphere
                  </span>
                  <motion.span 
                    className="text-sm font-medium text-[var(--accent-secondary)]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Compete. Conquer. Repeat.
                  </motion.span>
                </div>
              </motion.div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Link to="/profile" className="btn-primary">
                  Get Started
                </Link>
              </motion.div>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold mb-6"
                  animate={{ 
                    textShadow: [
                      "0 0 0px rgba(244, 91, 105, 0)",
                      "0 0 15px rgba(244, 91, 105, 0.5)",
                      "0 0 0px rgba(244, 91, 105, 0)"
                    ]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                >
                  Elevate Your <motion.span 
                    className="text-[var(--accent)]"
                    animate={{
                      color: ["#f45b69", "#ff7b86", "#f45b69"]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                  >Coding Skills</motion.span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-[var(--text-secondary)] mb-8"
                  animate={floatingAnimation}
                >
                  Practice daily, compete in challenges, and track your progress to become a better programmer.
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/profile" className="btn-primary text-center block">
                      Get Started
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      onClick={scrollToFeatures} 
                      className="btn-secondary flex items-center justify-center gap-2 w-full"
                    >
                      Learn More 
                      <motion.div
                        animate={{
                          y: [0, 5, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="hidden lg:block"
              >
                <motion.div 
                  className="relative"
                  animate={rotateAnimation}
                >
                  <motion.div 
                    className="absolute -left-6 -top-6 w-72 h-72 bg-[var(--accent)] rounded-full filter blur-[120px] opacity-10"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <motion.div
                    className="card rounded-xl overflow-hidden shadow-2xl"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-[#131b2e] p-3 flex items-center">
                      <div className="flex gap-1.5">
                        <motion.div 
                          className="w-3 h-3 bg-red-500 rounded-full"
                          whileHover={{ scale: 1.5 }}
                        />
                        <motion.div 
                          className="w-3 h-3 bg-yellow-500 rounded-full"
                          whileHover={{ scale: 1.5 }}
                        />
                        <motion.div 
                          className="w-3 h-3 bg-green-500 rounded-full"
                          whileHover={{ scale: 1.5 }}
                        />
                      </div>
                    </div>
                    <div className="p-6 font-mono text-sm">
                      <div className="text-[#637777]">// Solve the Two Sum problem</div>
                      <div className="mt-2">
                        <span className="text-[#c792ea]">function</span>{" "}
                        <span className="text-[#82aaff]">twoSum</span>(
                        <span className="text-[#f78c6c]">nums</span>,{" "}
                        <span className="text-[#f78c6c]">target</span>) {"{"}
                      </div>
                      <div className="pl-4">
                        <span className="text-[#c792ea]">const</span>{" "}
                        <span className="text-[#ffcb6b]">map</span> ={" "}
                        <span className="text-[#89ddff]">new</span>{" "}
                        <span className="text-[#ffcb6b]">Map</span>();
                      </div>
                      <div className="pl-4">
                        <span className="text-[#c792ea]">for</span> (
                        <span className="text-[#c792ea]">let</span>{" "}
                        <span className="text-[#ffcb6b]">i</span> ={" "}
                        <span className="text-[#f78c6c]">0</span>;{" "}
                        <span className="text-[#ffcb6b]">i</span> &lt;{" "}
                        <span className="text-[#f78c6c]">nums</span>.length;{" "}
                        <span className="text-[#ffcb6b]">i</span>++) {"{"}
                      </div>
                      {/* Code content continues */}
                      <div className="pl-8">
                        <span className="text-[#c792ea]">const</span>{" "}
                        <span className="text-[#ffcb6b]">complement</span> ={" "}
                        <span className="text-[#f78c6c]">target</span> -{" "}
                        <span className="text-[#f78c6c]">nums</span>[
                        <span className="text-[#ffcb6b]">i</span>];
                      </div>
                      <div className="pl-8 text-[#fff]">
                        {/* Code cursor blinking animation */}
                        <motion.span 
                          className="relative after:content-[''] after:absolute after:right-0 after:w-2 after:h-5 after:bg-[var(--accent)]"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                        </motion.span>
                      </div>
                      {/* Code content continues */}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                transition: { 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
              onClick={scrollToFeatures}
            >
              <motion.span 
                className="text-sm text-[var(--text-secondary)] mb-2"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                Scroll to learn more
              </motion.span>
              <motion.div
                animate={{
                  y: [0, 5, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <ChevronDown className="text-[var(--accent)]" />
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* Features Section */}
        <section ref={featuresRef} className="py-24 bg-[var(--secondary)]">
          <div className="container-custom">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-4"
              >
                Features That <motion.span 
                  className="text-[var(--accent)]"
                  animate={{ 
                    textShadow: [
                      "0 0 0px rgba(244, 91, 105, 0)",
                      "0 0 10px rgba(244, 91, 105, 0.5)",
                      "0 0 0px rgba(244, 91, 105, 0)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >Set Us Apart</motion.span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto"
              >
                Our platform offers everything you need to improve your coding skills and prepare for technical interviews.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Code size={40} className="text-[var(--accent)]" />,
                  title: "Daily Coding Challenges",
                  description: "Practice with new problems every day, sorted by difficulty level to match your skill."
                },
                {
                  icon: <Star size={40} className="text-[var(--accent)]" />,
                  title: "Question of the Day",
                  description: "Tackle a specially curated daily problem to expand your problem-solving toolkit."
                },
                {
                  icon: <Swords size={40} className="text-[var(--accent)]" />,
                  title: "1v1 Ranked Matches",
                  description: "Compete against other coders in real-time to solve problems under pressure."
                },
                {
                  icon: <BookOpen size={40} className="text-[var(--accent)]" />,
                  title: "Comprehensive Study Materials",
                  description: "Learn key algorithms and data structures with our detailed guides and examples."
                },
                {
                  icon: <Award size={40} className="text-[var(--accent)]" />,
                  title: "Achievements & Badges",
                  description: "Earn recognition for your progress and showcase your accomplishments."
                },
                {
                  icon: <Users size={40} className="text-[var(--accent)]" />,
                  title: "Global Leaderboard",
                  description: "See how you rank against other programmers locally and globally."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="card hover:shadow-xl transition-all duration-300"
                >
                  <motion.div 
                    className="mb-4"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-[var(--text-secondary)]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/profile" className="btn-primary text-lg py-3 px-8 inline-block">
                  Get Started Now
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-24 bg-[var(--primary)]">
          <div className="container-custom">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-4"
              >
                Get In <motion.span 
                  className="text-[var(--accent)]"
                  animate={{ 
                    textShadow: [
                      "0 0 0px rgba(244, 91, 105, 0)",
                      "0 0 10px rgba(244, 91, 105, 0.5)",
                      "0 0 0px rgba(244, 91, 105, 0)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >Touch</motion.span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto"
              >
                Have questions or feedback? We'd love to hear from you. Reach out to our team using any of the methods below.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Email Us",
                  details: "support@codosphere.com",
                  description: "For general inquiries and support"
                },
                {
                  title: "Call Us",
                  details: "+65 84218885",
                  description: "Monday to Friday, 9AM-5PM EST"
                },
                {
                  title: "Visit Us",
                  details: "Hall of Residence 16, Nanyang Technological University, Singapore",
                  description: "Our headquarters location"
                }
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="card text-center"
                >
                  <motion.h3 
                    className="text-xl font-semibold mb-2"
                    animate={pulseAnimation}
                  >
                    {contact.title}
                  </motion.h3>
                  <motion.p 
                    className="text-[var(--accent)] font-medium mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {contact.details}
                  </motion.p>
                  <p className="text-[var(--text-secondary)] text-sm">{contact.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-[var(--secondary)] py-8 text-center">
          <div className="container-custom">
            <motion.div 
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <LogoIcon size={24} />
              </motion.div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]">
                CodoSphere
              </span>
            </motion.div>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              © {new Date().getFullYear()} CodoSphere. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default HomePage;