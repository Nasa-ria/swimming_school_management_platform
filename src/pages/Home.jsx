import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CAROUSEL_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=1600&auto=format',
    title: 'Elevate Your Aquatic Potential',
    subtitle: 'Join Alraad Swim, where world-class instructors and state-of-the-art facilities converge to create a transformative swimming experience for all ages.'
  },
  {
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1600&auto=format',
    title: 'Master Your Technique',
    subtitle: 'From foundational breathing to competitive stroke refinement, our tailored sessions accelerate your progress in the water.'
  },
  {
    image: 'https://images.unsplash.com/photo-1600965962361-9025dd314715?w=1600&auto=format',
    title: 'World-Class Instructors',
    subtitle: 'Train alongside professionals dedicated to your safety, confidence, and ultimate aquatic success.'
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-page-saas">
      {/* Hero Carousel Section */}
      <section style={{ height: '90vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {CAROUSEL_SLIDES.map((slide, index) => (
          <div 
            key={index}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: `linear-gradient(rgba(10, 22, 40, 0.75), rgba(10, 22, 40, 0.85)), url("${slide.image}") center/cover no-repeat`,
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: currentSlide === index ? 1 : 0
            }}
          />
        ))}
        
        <div className="portal-container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          {CAROUSEL_SLIDES.map((slide, index) => (
            <div 
              key={`content-${index}`}
              style={{
                maxWidth: '800px',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)',
                position: currentSlide === index ? 'relative' : 'absolute',
                pointerEvents: currentSlide === index ? 'auto' : 'none',
              }}
            >
              {currentSlide === index && (
                <>
                  <span className="badge-saas success" style={{ marginBottom: '1.5rem', padding: '8px 20px', letterSpacing: '0.05em', animation: 'fadeUp 0.8s ease-out' }}>PREMIUM SWIMMING ACADEMY</span>
                  <h1 style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.05, color: 'white', animation: 'fadeUp 1s ease-out' }}>{slide.title}</h1>
                  <p style={{ fontSize: '1.25rem', marginBottom: '3rem', opacity: 0.9, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', animation: 'fadeUp 1.2s ease-out' }}>
                    {slide.subtitle}
                  </p>
                  <div style={{ display: 'flex', gap: '1.25rem', animation: 'fadeUp 1.4s ease-out' }}>
                    <Link to="/sessions" className="btn-saas btn-saas-primary" style={{ padding: '16px 40px', fontSize: '1rem' }}>Explore Programs</Link>
                    <Link to="/register" className="btn-saas btn-saas-outline" style={{ padding: '16px 40px', fontSize: '1rem', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Join the Academy</Link>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Carousel Indicators */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 10 }}>
          {CAROUSEL_SLIDES.map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? '32px' : '12px',
                height: '12px',
                borderRadius: '6px',
                background: currentSlide === index ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust/Stats Section */}
      <section style={{ padding: '4rem 0', background: 'white', borderBottom: '1px solid var(--border-light)' }}>
        <div className="portal-container">
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)' }}>2.5k+</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Swimmers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)' }}>15+</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Expert Coaches</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)' }}>98%</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Success Rate</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)' }}>4.9/5</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Student Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '8rem 0', backgroundColor: '#fcfdfe' }}>
        <div className="portal-container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1.25rem' }}>Why Alraad Swim?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>We combine technical excellence with a passion for aquatic growth.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            <div className="card-saas" style={{ padding: '3rem', textAlign: 'center', transition: 'transform 0.3s ease' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--info-soft)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem auto' }}>🏅</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1rem' }}>Elite Coaching</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Learn from certified Olympians and professionals with decades of competitive and pedagogical experience.</p>
            </div>
            <div className="card-saas" style={{ padding: '3rem', textAlign: 'center', transition: 'transform 0.3s ease' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--success-soft)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem auto' }}>🌊</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1rem' }}>Modern Facilities</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Train in our temperature-controlled, salt-water olympic pools maintained to the world's highest hygiene standards.</p>
            </div>
            <div className="card-saas" style={{ padding: '3rem', textAlign: 'center', transition: 'transform 0.3s ease' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--warning-soft)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem auto' }}>📅</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '1rem' }}>Digital Experience</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Manage your training, track metrics, and receive coach feedback through our high-performance student portal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="portal-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="card-saas" style={{ background: 'var(--navy)', color: 'white', padding: '5rem', textAlign: 'center', border: 'none', boxShadow: '0 30px 60px rgba(10,22,40,0.4)' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>Start Your Journey Today</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
              Whether you're taking your first splash or aiming for the podium, we have a specialized program designed for you.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
              <Link to="/register" className="btn-saas btn-saas-primary" style={{ padding: '16px 48px' }}>Create Account</Link>
              <Link to="/blog" className="btn-saas btn-saas-outline" style={{ padding: '16px 48px', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>Read Training Tips</Link>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, var(--primary-dark) 0%, transparent 70%)', opacity: 0.1 }}></div>
      </section>
    </div>
  );
}
