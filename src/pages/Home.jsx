
import React, { useState, useEffect } from 'react';
import { Waves, Calendar, ShoppingBag, BookOpen, Users, Award, Clock, ChevronRight, Play, ArrowRight, Check, Zap, Shield, Heart, Target, Star } from 'lucide-react';
import './Home.css';


function Home(){
   const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [stats, setStats] = useState({
    students: 0,
    sessions: 0,
    instructors: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    const targets = { students: 5000, sessions: 15000, instructors: 50, satisfaction: 98 };
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        students: Math.floor(targets.students * progress),
        sessions: Math.floor(targets.sessions * progress),
        instructors: Math.floor(targets.instructors * progress),
        satisfaction: Math.floor(targets.satisfaction * progress)
      });

      if (currentStep >= steps) clearInterval(timer);
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: "Alex Patterson",
      role: "Competitive Swimmer",
      image: "👨‍💼",
      rating: 5,
      text: "The instructors are amazing and the booking process is incredibly easy! My swimming technique has improved dramatically in just 3 months.",
      achievement: "Advanced Level"
    },
    {
      name: "Jamie Lawrence",
      role: "Fitness Enthusiast",
      image: "👩‍💼",
      rating: 5,
      text: "Great selection of swimming gear and lightning-fast delivery. The quality of equipment is top-notch and the prices are very competitive.",
      achievement: "Intermediate Level"
    },
    {
      name: "Morgan Sullivan",
      role: "Beginner Swimmer",
      image: "👨‍🎓",
      rating: 5,
      text: "I improved my swimming skills thanks to the helpful articles and patient instructors. I went from being afraid of water to swimming confidently!",
      achievement: "Beginner to Intermediate"
    },
    {
      name: "Casey Martinez",
      role: "Parent",
      image: "👩‍👧",
      rating: 5,
      text: "My kids absolutely love their swimming lessons here! The safety measures and professional approach give me complete peace of mind.",
      achievement: "Family Member"
    }
  ];

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "AI-powered session matching based on your skill level and availability",
      color: "blue"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Instructors",
      description: "Certified professionals with years of competitive and teaching experience",
      color: "purple"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Premium Equipment",
      description: "High-quality gear from top brands at competitive prices",
      color: "orange"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Learning Hub",
      description: "Extensive library of tutorials, tips, and swimming techniques",
      color: "green"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safety First",
      description: "Certified lifeguards on duty at all times"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Tracking",
      description: "Monitor your progress with detailed analytics"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Flexible Plans",
      description: "Choose from various membership options"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Community",
      description: "Join a supportive swimming community"
    }
  ];

  const upcomingSessions = [
    { level: "Beginner", time: "9:00 AM", spots: 3, instructor: "Sarah Johnson" },
    { level: "Intermediate", time: "11:00 AM", spots: 5, instructor: "Mike Davis" },
    { level: "Advanced", time: "2:00 PM", spots: 2, instructor: "Emily Chen" }
  ];

  const handleNavigate = (path) => {
    console.log(`Navigate to: ${path}`);
    alert(`Navigation to ${path} - In production, this would route to the page`);
  };

  return (
    <div className="advanced-home">
      {/* Enhanced Hero Section */}
      <section className="hero-section">
        {/* Animated Background */}
        <div className="hero-background">
          <div className="hero-bubbles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="floating-bubble"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.3
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <div className="hero-badge">
            <Waves className="w-5 h-5" />
            <span className="hero-badge-text">Trusted by 5000+ Swimmers</span>
          </div>
          
          <h1 className="hero-title">
            Dive Into Your
            <span className="gradient-text">Swimming Journey</span>
          </h1>
          
          <p className="hero-subtitle">
            Transform your swimming skills with professional instruction, state-of-the-art facilities, and a supportive community
          </p>
          
          <div className="hero-buttons">
            <button onClick={() => handleNavigate('/sessions')} className="btn-hero-primary">
              Start Swimming
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => handleNavigate('/shop')} className="btn-hero-secondary">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">{stats.students.toLocaleString()}+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.sessions.toLocaleString()}+</div>
              <div className="stat-label">Sessions Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.instructors}+</div>
              <div className="stat-label">Expert Instructors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.satisfaction}%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-indicator-inner">
            <div className="scroll-indicator-dot" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            Experience the difference with our comprehensive swimming platform
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" onClick={() => handleNavigate('/sessions')}>
              <div className={`feature-icon ${feature.color}`}>
                {feature.icon}
              </div>
              
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              
              <div className="feature-link">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Sessions Preview */}
      <section className="sessions-section">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="sessions-header">
            <div className="sessions-header-content">
              <h2>Today's Sessions</h2>
              <p>Join a session that matches your skill level</p>
            </div>
            <button onClick={() => handleNavigate('/sessions')} className="btn-view-all">
              View All Sessions
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="sessions-grid">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="session-card" onClick={() => handleNavigate('/sessions')}>
                <div className="session-header">
                  <span className={`session-level ${session.level.toLowerCase()}`}>
                    {session.level}
                  </span>
                  <span className="session-spots">{session.spots} spots left</span>
                </div>
                
                <h3 className="session-title">{session.level} Swimming</h3>
                
                <div className="session-details">
                  <div className="session-detail-item">
                    <Clock className="w-4 h-4" />
                    <span>{session.time}</span>
                  </div>
                  <div className="session-detail-item">
                    <Users className="w-4 h-4" />
                    <span>Instructor: {session.instructor}</span>
                  </div>
                </div>
                
                <button className="btn-book-now">Book Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="benefits-section">
        <div className="benefits-grid">
          <div className="benefits-content">
            <h2>Everything You Need to Succeed</h2>
            <p>
              We provide comprehensive support for your swimming journey with professional guidance and top-tier facilities
            </p>
            
            <div className="benefits-list">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <div className="benefit-icon">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="benefit-title">{benefit.title}</h3>
                    <p className="benefit-description">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => handleNavigate('/sessions')} className="btn-get-started">
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="benefits-visual">
            <div className="benefits-visual-bg" />
            <div className="benefits-visual-card">
              <div className="benefits-checklist">
                <div className="checklist-item green">
                  <Check className="checklist-icon green" />
                  <span className="checklist-text">Professional Equipment</span>
                </div>
                <div className="checklist-item blue">
                  <Check className="checklist-icon blue" />
                  <span className="checklist-text">Olympic-Size Pools</span>
                </div>
                <div className="checklist-item purple">
                  <Check className="checklist-icon purple" />
                  <span className="checklist-text">Certified Instructors</span>
                </div>
                <div className="checklist-item orange">
                  <Check className="checklist-icon orange" />
                  <span className="checklist-text">Flexible Schedule</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2>What Our Members Say</h2>
            <p>Join thousands of satisfied swimmers</p>
          </div>

          <div className="testimonial-card-wrapper">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-avatar">{testimonials[activeTestimonial].image}</div>
                
                <div className="testimonial-rating">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                
                <p className="testimonial-text">
                  "{testimonials[activeTestimonial].text}"
                </p>
                
                <div className="testimonial-author">
                  <div className="testimonial-name">{testimonials[activeTestimonial].name}</div>
                  <div className="testimonial-role">{testimonials[activeTestimonial].role}</div>
                </div>
                
                <div className="testimonial-achievement">
                  <Award className="w-4 h-4" />
                  {testimonials[activeTestimonial].achievement}
                </div>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`carousel-indicator ${index === activeTestimonial ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-bubbles">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="floating-bubble"
                style={{
                  width: `${Math.random() * 150 + 50}px`,
                  height: `${Math.random() * 150 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 15 + 10}s`
                }}
              />
            ))}
          </div>

          <div className="cta-content">
            <h2>Ready to Make a Splash?</h2>
            <p>
              Join our swimming school today and experience professional training with state-of-the-art facilities
            </p>
            
            <div className="cta-buttons">
              <button onClick={() => handleNavigate('/sessions')} className="btn-hero-primary">
                Book Your First Session
              </button>
              <button onClick={() => handleNavigate('/profile')} className="btn-hero-secondary">
                View Membership Plans
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <Waves className="w-8 h-8" style={{ color: '#22d3ee' }} />
            <span className="footer-logo-text">Swimming School</span>
          </div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Swimming School Management Platform. All rights reserved.
          </p>
          <div className="footer-links">
            <button onClick={() => handleNavigate('/privacy')} className="footer-link">
              Privacy Policy
            </button>
            <button onClick={() => handleNavigate('/terms')} className="footer-link">
              Terms of Service
            </button>
            <button onClick={() => handleNavigate('/contact')} className="footer-link">
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;