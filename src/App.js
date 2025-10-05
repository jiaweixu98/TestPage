import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, Element } from 'react-scroll';
import { animateScroll as scroll } from 'react-scroll';
import SEOFallback from './components/SEOFallback';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CoffeeIcon from '@mui/icons-material/Coffee';
import GroupsIcon from '@mui/icons-material/Groups';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Google Analytics 4 tracking
const gtag = window.gtag || function() {};

// Track page views
const trackPageView = (page) => {
  gtag('config', 'G-D2BRX1PQJQ', {
    page_path: page
  });
};

// Track custom events
const trackEvent = (action, category, label) => {
  gtag('event', action, {
    event_category: category,
    event_label: label
  });
};

// Custom hooks for better state management
const useScrollPosition = () => {
  const [isNavActive, setIsNavActive] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavActive(currentScrollY >= 20);
      setShowScrollTop(currentScrollY >= 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isNavActive, showScrollTop };
};

const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, isIntersecting];
};

function App() {
  const { isNavActive, showScrollTop } = useScrollPosition();

  useEffect(() => {
    trackPageView('/');
    
    // Update document title for better SEO
    document.title = "GenAI4Health@NeurIPS2025";
    
    // Add meta description for better SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'The Second Workshop on GenAI for Health at NeurIPS 2025. Join leading researchers exploring AI potential, trust, and policy compliance in healthcare. Submit papers by Aug 22, 2025. San Diego, Dec 6-7, 2025.');
    }
  }, []);

  const scrollToTop = useCallback(() => {
    scroll.scrollToTop({ duration: 500, smooth: true });
  }, []);

  return (
    <div className="App">
      <NavigationBar isActive={isNavActive} />
      
      <main className="content" role="main">
        <Element name="Home">
          <HomeSection />
        </Element>
        <Element name="Speakers">
          <SpeakersSection />
        </Element>
        <Element name="Agenda">
          <AgendaSection />
        </Element>
        <Element name="Call for Papers">
          <CallForPapers />
        </Element>
        <Element name="Sponsors">
          <SponsorSection />
        </Element>
        <Element name="Organizers">
          <OrganizersSection />
        </Element>
        
        <button 
          onClick={scrollToTop}
          className={`scroll-to-top ${showScrollTop ? 'active' : ''}`}
          aria-label="Scroll to top"
        >
          <ArrowUpwardIcon />
        </button>
      </main>
      
      <Footer />
      
      {/* SEO Fallback Content - Hidden by default, shown when JS is disabled */}
      <SEOFallback />
    </div>
  );
}

// Navigation Component with improved accessibility
function NavigationBar({ isActive }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  
  const navItems = useMemo(() => [
    { id: "home", label: "Home", to: "Home" },
    { id: "speakers", label: "Speakers", to: "Speakers" },
    { id: "agenda", label: "Agenda", to: "Agenda" },
    { id: "call-for-papers", label: "Call for Papers", to: "Call for Papers" },
    { id: "sponsors", label: "Sponsors", to: "Sponsors" },
    { id: "organizers", label: "Organizers", to: "Organizers" },
    { id: "past-events-contact", label: "Past Events & Contact", to: "Contact" }
  ], []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Set Home as active by default when component mounts
  useEffect(() => {
    setActiveSection("Home");
  }, []);



  // Helper function to get the correct navigation label for a section
  const getNavLabelForSection = useCallback((sectionName) => {
    if (sectionName === "Contact") {
      return "Past Events & Contact";
    }
    return sectionName;
  }, []);





  return (
    <nav className={`nav-bar ${isActive ? 'active' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <a 
          href="https://neurips.cc/" 
          className="nav-logo"
          aria-label="NeurIPS Homepage"
        >
          <img 
            alt="NeurIPS Logo" 
            src={process.env.PUBLIC_URL + '/data/images/logo/neurips-navbar-logo.svg'} 
          />
        </a>
        
        <button
          className="nav-menu-toggle"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="nav-menu"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        
        <ul 
          id="nav-menu"
          className={`nav-items ${isMenuOpen ? 'open' : ''}`}
          role="menubar"
        >
          {navItems.map((item) => (
            <li key={item.id} role="none">
              <Link
                to={item.to}
                spy={true}
                smooth={true}
                offset={-200}
                duration={300}
                className={`nav-link ${activeSection === getNavLabelForSection(item.to) ? 'active' : ''}`}
                activeClass="active"
                onClick={() => {
                  setActiveSection(getNavLabelForSection(item.to));
                  closeMenu();
                  trackEvent('navigation_click', 'navigation', item.label);
                }}
                onSetActive={() => setActiveSection(getNavLabelForSection(item.to))}
                role="menuitem"
                aria-label={`Navigate to ${item.label} section`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// Home Section Component with improved structure
function HomeSection() {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const backgroundImageUrl = process.env.PUBLIC_URL + '/data/images/bg/bg.png';

  return (
    <section 
      className="home-section" 
      ref={ref}
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImageUrl})`,
        backgroundColor: '#1a1a1a',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll'
      }}
    >
      <div className={`home-content ${isVisible ? 'animate-in' : ''}`}>
        <h1 className="home-title">
          The Second Workshop on GenAI for Health<br />
          Potential, Trust, and Policy Compliance
        </h1>
        
        <div className="home-meta">
          <a 
            href="https://neurips.cc/virtual/2025/workshop/109566" 
            className="home-conference"
            target="_blank"
            rel="noopener noreferrer"
          >
            GenAI4Health @NeurIPS 2025
          </a>
          <p className="home-location">Upper Level Room 33ABC, San Diego Convention Center, California, USA</p>
          <p className="home-date">December 6, 2025</p>
        </div>
        
        <div className="home-social">
          <a 
            href="https://x.com/GenAI4Health"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('social_click', 'home', 'x_account')}
            aria-label="Follow us on X (Twitter)"
          >
            <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Follow @GenAI4Health for the latest updates</span>
          </a>
        </div>
        
        <div className="home-actions">
          <a 
            href="https://neurips.cc"
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('button_click', 'home', 'attend_conference')}
          >
            Attend Conference
          </a>
          <a 
            href="https://openreview.net/group?id=NeurIPS.cc/2025/Workshop/GenAI4Health" 
            className="btn btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('button_click', 'home', 'submit_paper')}
          >
            Submit Paper
          </a>
        </div>
      </div>
    </section>
  );
}

// Speakers Section Component
function SpeakersSection() {
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const speakers = useMemo(() => [
    // Policy, Regulation, and Compliance
    {
      id: "suchi-saria",
      name: "Suchi Saria",
      institution: "Johns Hopkins University",
      link: "https://engineering.jhu.edu/faculty/suchi-saria/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/suchi-saria-2.jpg",
      category: "Policy, Regulation, and Compliance",
      keynote: { 
        title: "AI for Individualized Care", 
        abstract: "Dr. Saria will discuss leveraging AI for individualized care and the challenges in translating AI systems to clinical practice.", 
        profile: "John C. Malone Associate Professor at Johns Hopkins University, directing the Machine Learning and Healthcare Lab. Her work leverages AI for individualized care." 
      }
    },
    {
      id: "eric-topol",
      name: "Eric Topol",
      institution: "Scripps Research",
      link: "https://www.scripps.edu/faculty/topol/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/eric_topol.jpg",
      category: "Policy, Regulation, and Compliance",
      keynote: { 
        title: "Digital and Personalized Medicine", 
        abstract: "Dr. Topol will discuss the integration of AI, genomics, and digital health into clinical practice.", 
        profile: "Dr. Eric Topol is a leading physician-scientist in digital and personalized medicine. His work integrates AI, genomics, and digital health into clinical practice. A National Academy of Medicine member, he leads NIH-funded initiatives." 
      }
    },
    {
      id: "fei-wang",
      name: "Fei Wang",
      institution: "Weill Cornell Medicine",
      link: "https://wcm-wanglab.github.io/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/FeiWang_1.jpeg",
      category: "Policy, Regulation, and Compliance",
      keynote: { 
        title: "AI for Digital Health", 
        abstract: "Dr. Wang will discuss machine learning applications in biomedicine and digital health.", 
        profile: "Tenured Professor at Weill Cornell Medicine and Founding Director of the WCM Institute of AI for Digital Health. His research applies machine learning to biomedicine, with over 350 papers and 35,000 citations. He is a fellow of AMIA and ACM." 
      }
    },
    {
      id: "haider-warraich",
      name: "Haider Warraich",
      institution: "ARPA-H",
      link: "https://www.linkedin.com/in/haiderwarraich/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/Haider_WarraichMD.jpg",
      category: "Policy, Regulation, and Compliance",
      keynote: { 
        title: "AI and Health Tech Policy", 
        abstract: "Dr. Warraich will discuss AI and health tech policy for chronic disease management.", 
        profile: "Senior Advisor at ARPA-H, formerly at the FDA, he shapes AI and health tech policy for chronic disease management." 
      }
    },
    // GenAI Use Cases for Health
    {
      id: "james-zou",
      name: "James Zou",
      institution: "Stanford University",
      link: "https://www.james-zou.com/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/zou.jpg",
      category: "GenAI Use Cases for Health",
      keynote: { 
        title: "AI Reliability for Health Applications", 
        abstract: "Dr. Zou will discuss enhancing AI reliability for health applications.", 
        profile: "Associate Professor at Stanford University, leading the Data4Health hub. His research enhances AI reliability for health applications." 
      }
    },
    {
      id: "vivek-natarajan",
      name: "Vivek Natarajan",
      institution: "Google",
      link: "https://www.linkedin.com/in/vivek-natarajan-a3670118/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/vivek.jpg",
      category: "GenAI Use Cases for Health",
      keynote: { 
        title: "Med-PaLM and Project AMIE", 
        abstract: "Dr. Natarajan will discuss achieving expert-level medical AI performance and empathetic, multimodal medical AI.", 
        profile: "Leads Med-PaLM and Project AMIE, achieving expert-level medical AI performance. His work on empathetic, multimodal medical AI and tools like Mammo Reader is published in Nature and NeurIPS." 
      }
    },
    {
      id: "jiwoong-kim",
      name: "Ji Woong Kim",
      institution: "Stanford University",
      link: "https://sites.google.com/view/jkimrobot/home",
      image: process.env.PUBLIC_URL + "/data/images/speakers/Ji Woong Kim.jpg",
      category: "GenAI Use Cases for Health",
      keynote: { 
        title: "AI-Driven Autonomous Surgical Workflows", 
        abstract: "Dr. Kim will discuss AI-driven autonomous surgical workflows and dexterous manipulation for robotics in healthcare.", 
        profile: "A postdoc at Stanford University advised by Chelsea Finn. His research lies at the intersection of machine learning, computer vision and robotics. Previously, he focused on developing dextrous manipulation policies for the da Vinci robot with Axel Krieger and developing autonomous surgical workflows for eye surgery with Marin Kobilarov and Iulian Iordachita. He interned at Zoox (self-driving company owned by Amazon) in the planning & controls and prediction team." 
      }
    },
    {
      id: "serena-yeung",
      name: "Serena Yeung",
      institution: "Stanford University",
      link: "https://ai.stanford.edu/~syyeung/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/yeung.jpg",
      category: "GenAI Use Cases for Health",
      keynote: { 
        title: "Medical AI and Computer Vision", 
        abstract: "Dr. Yeung will discuss applying deep learning to healthcare and medical computer vision.", 
        profile: "Assistant Professor at Stanford, leading the Medical AI and Computer Vision Lab. Her work applies deep learning to healthcare, affiliated with Stanford's AIMI." 
      }
    },
    // GenAI Trustworthiness and Risks in Health
    {
      id: "marzyeh-ghassemi",
      name: "Marzyeh Ghassemi",
      institution: "MIT",
      link: "https://healthyml.org/marzyeh/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/MarzyehGhassemi.jpeg",
      category: "GenAI Trustworthiness and Risks in Health",
      keynote: { 
        title: "AI's Clinical Risks", 
        abstract: "Dr. Ghassemi will discuss examining AI's clinical risks and safety considerations in healthcare.", 
        profile: "Associate Professor in EECS and IMES, MIT. Her research examines AI's clinical risks, earning MIT Review and Sloan Research Fellow honors." 
      }
    },
    {
      id: "sharon-li",
      name: "Sharon Yixuan Li",
      institution: "UW-Madison",
      link: "https://pages.cs.wisc.edu/~sharonli/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/yixuanli-2019.jpg",
      category: "GenAI Trustworthiness and Risks in Health",
      keynote: { 
        title: "Safe AI Algorithms for Healthcare", 
        abstract: "Dr. Li will discuss safe AI algorithms, including handling out-of-distribution data and building responsible LLMs for healthcare.", 
        profile: "Assistant Professor at UW-Madison, focusing on safe AI algorithms, including handling out-of-distribution data and building responsible LLMs for healthcare." 
      }
    },
    {
      id: "diyi-yang",
      name: "Diyi Yang",
      institution: "Stanford University",
      link: "https://cs.stanford.edu/~diyiy/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/Diyi_Yang.jpg",
      category: "GenAI Trustworthiness and Risks in Health",
      keynote: { 
        title: "AI for Social Good and Health", 
        abstract: "Dr. Yang will discuss developing AI systems for social good and health applications.", 
        profile: "Assistant Professor at Stanford University, focusing on AI for social good and health applications. Her research spans natural language processing, computational social science, and AI for healthcare." 
      }
    },
    {
      id: "jimeng-sun",
      name: "Jimeng Sun",
      institution: "UIUC",
      link: "https://sunlab.org/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/jimengsun.jpg",
      category: "GenAI Trustworthiness and Risks in Health",
      keynote: { 
        title: "AI for Clinical Trials and Drug Discovery", 
        abstract: "Dr. Sun will discuss developing AI for clinical trials, drug discovery, and predictive modeling in healthcare.", 
        profile: "Health Innovation Professor at UIUC, developing AI for clinical trials, drug discovery, and predictive modeling in healthcare." 
      }
    },
    {
      id: "munjal-shah",
      name: "Munjal Shah",
      institution: "Hippocratic AI",
      link: "https://www.linkedin.com/in/munjalshah747/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/Munjal Shah_highrez.jpg",
      category: "GenAI Use Cases for Health",
      keynote: { 
        title: "AI for Healthcare Delivery", 
        abstract: "Dr. Shah will discuss AI applications for healthcare delivery and the future of AI in clinical practice.", 
        profile: "Co-founder and CEO of Hippocratic AI, focused on developing safe AI for healthcare delivery and clinical applications." 
      }
    },
    {
      id: "david-ouyang",
      name: "David Ouyang",
      institution: "Kaiser Permanente Division of Research",
      link: "https://douyang.github.io/",
      image: process.env.PUBLIC_URL + "/data/images/speakers/ouyang.jpg",
      category: "GenAI Use Cases for Health",
      keynote: { 
        title: "AI for Cardiovascular Diagnosis and Disease Detection", 
        abstract: "Dr. Ouyang will discuss improving cardiovascular diagnosis and disease detection using computer vision and artificial intelligence.", 
        profile: "Research Scientist and Cardiologist at Kaiser Permanente Division of Research and Assistant Professor at Cedars-Sinai Medical Center, focused on improving cardiovascular diagnosis and disease detection using computer vision and artificial intelligence." 
      }
    }
  ], []);

  const handleSpeakerClick = (speaker) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
    trackEvent('speaker_modal_open', 'speakers', speaker.name);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker(null);
    trackEvent('speaker_modal_close', 'speakers', selectedSpeaker?.name || 'unknown');
  };

  return (
    <section className="speakers-section">
      <div className="container">
        <h2 className="section-title">Speakers</h2>
        
        <div className="speakers-grid">
          {speakers.map((speaker) => (
            <SpeakerCard 
              key={speaker.id} 
              {...speaker} 
              onSpeakerClick={handleSpeakerClick}
            />
          ))}
        </div>
      </div>
      
      <KeynoteModal 
        speaker={selectedSpeaker}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}

// Speaker Card Component
function SpeakerCard({ id, name, institution, image, link, keynote, onSpeakerClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <article className="speaker-card" data-speaker-id={id}>
      <div className="speaker-image-container" onClick={() => onSpeakerClick({ name, keynote, link })}>
        <img
          src={image}
          alt={`${name} from ${institution}`}
          className={`speaker-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          loading="lazy"
        />
        <div className="speaker-overlay">
          <button
            className="speaker-detail-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSpeakerClick({ name, keynote, link });
            }}
            aria-label={`View details for ${name}`}
          >
            <ArrowForwardIcon />
          </button>
        </div>
      </div>
      
      <div className="speaker-info">
        <h4 className="speaker-name">{name}</h4>
        <p className="speaker-institution">{institution}</p>
      </div>
    </article>
  );
}

// Keynote Modal Component
function KeynoteModal({ speaker, isOpen, onClose }) {
  if (!isOpen || !speaker) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <CloseIcon />
        </button>
        
        <header className="modal-header">
          <h3>{speaker.name}</h3>
        </header>
        
        <div className="modal-body">
          {/* <h4 className="keynote-title">{speaker.keynote.title}</h4> */}
          
          {/* <section className="keynote-abstract">
            <p>{speaker.keynote.abstract}</p>
          </section> */}
          
          <section className="keynote-profile">
            <p>{speaker.keynote.profile}</p>
          </section>
        </div>
        
        <footer className="modal-footer">
          <a href={speaker.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            The Speaker's Homepage
          </a>
        </footer>
      </div>
    </div>
  );
}



// Agenda Section Component
function AgendaSection() {
  const agenda = useMemo(() => [
    { time: "Dec 6 Morning", event: "", type: "header" },
    { time: "8:00", event: "Opening Remarks", type: "session" },
    { time: "8:00-8:15", event: "Eric Topol (Scripps Research)", type: "session" },
    { time: "8:15-8:30", event: "James Zou (Stanford)", type: "session" },
    { time: "8:30-8:45", event: "Marzyeh Ghassemi (MIT)", type: "session" },
    { time: "8:45-9:00", event: "Ji Woong Kim (Stanford)", type: "session" },
    { time: "9:00-9:30", event: "Coffee Break/Poster Session", type: "break" },
    { time: "9:30-9:45", event: "Fei Wang (Weill Cornell)", type: "session" },
    { time: "9:45-10:00", event: "Serena Yeung (Stanford)", type: "session" },
    { time: "10:00-10:15", event: "Sharon Yixuan Li (UW-Madison)", type: "session" },
    { time: "10:15-10:30", event: "Jimeng Sun (UIUC)", type: "session" },
    { time: "10:30-10:45", event: "Diyi Yang (Stanford)", type: "session" },
    { time: "10:45-11:25", event: "Panel Discussion I (with morning speakers)", type: "session" },
    { time: "11:25-12:00", event: "Workshop Paper Presentations", type: "session" },
    { time: "12:00-1:00 PM", event: "Lunch Break/Poster Session/Industry Talks", type: "break" },
    { time: "12:00-12:30", event: "Sponsor Expo (https://phti.org/)", type: "session" },
    { time: "Afternoon", event: "", type: "header" },
    { time: "1:00-1:15", event: "Suchi Saria (Johns Hopkins/Bayesian Health)", type: "session" },
    { time: "1:15-1:30", event: "Vivek Natarajan (Google Health)", type: "session" },
    { time: "1:30-1:45", event: "Haider Warraich (ARPA-H)", type: "session" },
    { time: "1:45-2:00", event: "Munjal Shah (Hippocratic AI)", type: "session" },
    { time: "2:00-2:15", event: "David Ouyang (Kaiser Permanente)", type: "session" },
    { time: "2:15-2:30", event: "TBD", type: "session" },
    { time: "2:30-3:00", event: "Panel Discussion 2 (with afternoon speakers)", type: "session" },
    { time: "3:00-3:30", event: "Coffee Break/Poster Session/Networking", type: "break" },
    { time: "3:30-4:00", event: "Workshop paper presentations", type: "session" },
    { time: "4:00-4:50", event: "Poster Session/Networking", type: "session" },
    { time: "4:50-5:00", event: "Award Ceremony/Closing Remarks", type: "session" }
  ], []);

  return (
    <section className="agenda-section">
      <div className="container">
        <h2 className="section-title">Agenda (Tentative)</h2>
        <p className="agenda-date">December 6, 2025 @Upper Level Room 33ABC, San Diego Convention Center</p>
        
        <div className="agenda-timeline">
          {agenda.map((item, index) => (
            <div 
              key={index} 
              className={`agenda-item ${item.type}`}
            >
              <time className="agenda-time">{item.time}</time>
              <div className="agenda-event">{item.event}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Call for Papers Component
function CallForPapers() {
  const topics = [
    {
      title: "GenAI Applications and Use Cases in Health",
      description: "We welcome submissions showcasing practical, innovative, and emerging applications of GenAI across the healthcare spectrum. Example areas include clinical diagnosis support, personalized treatment planning, digital twin-based simulation, synthetic biomedical data generation, remote patient monitoring, AI-assisted surgical robotics, intelligent medical imaging interpretation, and more."
    },
    {
      title: "Trustworthiness and Risk Management",
      description: "Approaches to ensuring the safety, robustness, and fairness of GenAI in medical contexts. Topics include safety benchmarks, misuse detection and prevention, red teaming practices, explainability and transparency, ethical evaluations focused on disparities and bias mitigation, and related safety considerations."
    },
    {
      title: "Policy, Regulation, and Compliance",
      description: "Analysis of regulatory frameworks and real-world deployment challenges. We welcome work addressing alignment with agencies such as the FDA, international standards for AI in healthcare, and strategies for collaboration among GenAI developers, clinicians, and policy experts."
    }
  ];

  const submissionTracks = [
    {
      title: "Track 1: Research Papers",
      subtitle: "Form the core of the program and present methodological advances and empirical evaluations",
      description: "The main content of the paper should be no longer than 9 pages.",
      icon: CoffeeIcon
    },
    {
      title: "Track 2: Demonstration Papers", 
      subtitle: "Showcasing working systems or applications",
      description: "Present practical implementations and real-world applications. The main content of the paper should be no longer than 5 pages. <strong>The paper title should start with 'Demo:'</strong>.",
      icon: InsertDriveFileIcon
    },
    {
      title: "Track 3: Position Papers",
      subtitle: "Offering perspectives or proposals on policy, governance, or deployment strategies",
      description: "Provide insights on policy frameworks and deployment challenges. See <a href='https://neurips.cc/Conferences/2025/CallForPositionPapers' target='_blank' rel='noopener noreferrer'>NeurIPS 2025 Call for Position Papers</a> to understand what position papers are. <strong>Deadline: Sep 5, 2025 (NOT the main NeurIPS deadline).</strong> The main content of the paper should be no longer than 5 pages. <strong>The paper title should start with 'Position:'</strong>.",
      icon: EmojiEventsIcon
    }
  ];

  const dates = [
    {
      date: "Sep 5, 2025",
      event: "Paper Submission Deadline",
      icon: InsertDriveFileIcon
    },
    {
      date: "Sep 22, 2025", 
      event: "Acceptance Notification",
      icon: EmojiEventsIcon
    },
    {
      date: "Oct 31, 2025",
      event: "Camera-ready Submission",
      icon: InsertDriveFileIcon
    },
    {
      date: "Dec 6, 2025",
      event: "Workshop Day",
      icon: GroupsIcon
    }
  ];

  return (
    <section className="cfp-section">
      <div className="container">
        <h2 className="section-title">Call for Papers</h2>
        <div className="camera-ready-guidelines">
          <h4 className="cfp-subsection-title">Camera-Ready Submission Guidelines</h4>
          <ul className="cfp-list">
            <li>
              <strong>Review Feedback:</strong> Please carefully address all reviewer feedback and thoroughly proofread your paper for clarity and consistency
            </li>
            <li>
              <strong>LaTeX Format:</strong> Format your paper using the NeurIPS 2025 LaTeX package with the following workshop options:<br />
              <code>\usepackage[dblblindworkshop,final]{"{"}neurips_2025{"}"}</code>
            </li>
            <li>
              <strong>Workshop Title:</strong> Include the workshop title in your paper by adding:<br />
              <code>\workshoptitle{"{"}The Second Workshop on GenAI for Health: Potential, Trust, and Policy Compliance{"}"}</code>
            </li>
            <li>
              <strong>Public Availability:</strong> Your camera-ready paper will be made publicly available on OpenReview after October 31, 2025, unless you contact the organizers before the deadline to opt out
            </li>
          </ul>
        </div>

        <div className="cfp-content">
          <div className="cfp-about">
            <h3 className="cfp-subtitle">About</h3>
            <p className="cfp-text">
              Following the successful first GenAI4Health workshop at NeurIPS 2024 (<a href="https://genai4health.github.io/2024-NeurIPS/" target="_blank" rel="noopener noreferrer">https://genai4health.github.io/2024-NeurIPS/</a>), generative AI in healthcare has rapidly evolved from exploratory studies to real-world deployments. With increasing FDA involvement and expanding global regulatory frameworks, the second GenAI4Health workshop aims to bring together AI4Health practitioners, safety researchers, and policy experts to address critical challenges in developing robust and policy-compliant GenAI technologies for health. Submit papers by Sep 5, 2025.
            </p>
          </div>

          <div className="cfp-important-dates">
            <h3 className="cfp-subtitle">Important Dates</h3>
            <br></br>
            <div className="dates-grid">
              {dates.map((item, index) => (
                <div key={index} className="date-card">
                  {/* Vertically center content with flex */}
                  <style>{`.date-card { display: flex; flex-direction: column; justify-content: center; align-items: center; }`}</style>
                  <time className="date-value">{item.date}</time>
                  <p className="date-event">{item.event}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="cfp-deadline-note" role="note" aria-label="Deadline timezone notice">
                <WarningAmberIcon />
                <span>All deadlines are at 11:59 PM AoE (Anywhere on Earth)</span>
              </div>
            </div>
          </div>


          <div className="submission-link">
            <p className="cfp-text">
              <strong>Submit your paper via the <a 
                href="https://openreview.net/group?id=NeurIPS.cc/2025/Workshop/GenAI4Health" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cfp-link"
              >
                OpenReview Submission Portal
              </a></strong>
            </p>
          </div>

          <div className="workshop-scope">
            <h3 className="cfp-subtitle">Topics of Interest</h3>
            <p className="cfp-text">
              For the second GenAI4Health workshop at NeurIPS 2025, we invite submissions of original, unpublished work related to the use of Generative AI in healthcare. 
              Submissions may include, but are not limited to, the following three major topic areas:
            </p>
            
            <div className="topics-list">
              {topics.map((topic, index) => (
                <div key={index} className="topic-item">
                  <h4 className="topic-title">Topic {index + 1}: {topic.title}</h4>
                  <p className="topic-description">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="submission-info">
            <h3 className="cfp-subtitle">Submission Guidelines</h3>
            
            
            
            <div className="submission-tracks">
              <h4 className="cfp-subsection-title">Submission Tracks</h4>
              <p className="cfp-text">
                Submissions within each track can fall into any of the above three topic areas. We provide three tracks for submissions:
              </p>
              <br></br>
              
              <div className="tracks-container">
                {submissionTracks.map((track, index) => (
                  <div key={index} className="track-item">
                    <div className="track-header">
                      <h5 className="track-title">{track.title}</h5>
                    </div>
                    <p className="track-subtitle">{track.subtitle}</p>
                    <p className="track-description" dangerouslySetInnerHTML={{ __html: track.description }}></p>
                  </div>
                ))}
              </div>
            </div>

            <div className="submission-format">
              <h4 className="cfp-subsection-title">Submission Format Requirements</h4>
              <ul className="cfp-list">
                <li>You must format your submission using the <a href="https://media.neurips.cc/Conferences/NeurIPS2025/Styles.zip" target="_blank" rel="noopener noreferrer">NeurIPS 2025 LaTeX style file.</a> NeurIPS Paper Checklist is not required.</li>
                <li>Use <code>\usepackage{"{"}neurips_2025{"}"}</code> without options to ensure the submission is anonymous</li>
                <li><strong>All page limits exclude acknowledgments, references, and appendix</strong></li>
                <li>Papers may be rejected without consideration of their merits if they fail to meet the submission requirements</li>
                <li>We encourage multidisciplinary submissions involving stakeholders from healthcare, public policy, or adjacent fields to ensure practical relevance and responsible innovation</li>
                <li>Supplementary materials (code, data, videos) may be submitted as appendices</li>
                <li>Papers submitted to the workshop <strong>must not</strong> have been previously published at another venue at the time of submission.</li>
                <li><strong>The accepted papers will be non-archival (NOT included in proceedings or any form of publication)</strong></li>
                <li><strong>Non-archival status means papers can be submitted to other venues after the workshop</strong></li>
                <li>Accepted workshop papers (after the camera-ready stage) will be made publicly available by default. However, authors may choose to opt out, in which case their paper (PDF file) will not appear on OpenReview. A reminder will be sent to authors before the camera-ready stage.</li>
              </ul>
            </div>

            <div className="review-process">
              <h4 className="cfp-subsection-title">Review Process</h4>
              <ul className="cfp-list">
                <li>Each paper will receive at least two anonymous reviews</li>
                <li><strong>All submissions must be anonymized and may not contain any identifying information</strong></li>
                <li>This policy applies to any supplementary or linked material as well, including code</li>
                <li><strong>Please do not include acknowledgments at submission time. Any papers found to be violating this policy will be rejected</strong></li>
              </ul>
            </div>

            <div className="presentation-awards">
              <h4 className="cfp-subsection-title">Presentation & Awards</h4>
              <ul className="cfp-list">
                <li>All accepted papers will be presented with posters</li>
                <li>Oral/spotlight presentations will be selected from the accepted papers</li>
                <li><strong>Three Outstanding Paper Awards will be selected, one for each paper track</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Sponsor Section Component
function SponsorSection() {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  return (
    <section className="sponsor-section" ref={ref}>
      <div className="container">
        <h2 className="section-title">Sponsors</h2>
        
        <div className={`sponsor-content ${isVisible ? 'animate-in' : ''}`}>
          <div className="sponsor-logo-showcase">
            <a 
              href="https://www.ifml.institute/"
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-logo-link"
              onClick={() => trackEvent('sponsor_click', 'sponsors', 'IFML')}
              aria-label="Visit IFML Institute for Foundations of Machine Learning website"
            >
              <img
                src={process.env.PUBLIC_URL + "/data/images/sponsor/IFML_Institute_for_Foundations_of_Machine_Learning_logo.svg"}
                alt="IFML Institute for Foundations of Machine Learning"
                className="sponsor-logo"
              />
            </a>
            <a 
              href="https://phti.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-logo-link"
              onClick={() => trackEvent('sponsor_click', 'sponsors', 'PHTI')}
              aria-label="Visit Peterson Health Technology Institute website"
            >
              <img
                src={process.env.PUBLIC_URL + "/data/images/sponsor/phti.svg"}
                alt="Peterson Health Technology Institute"
                className="sponsor-logo"
              />
            </a>
            <a 
              href="https://www.kaiserpermanente.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-logo-link"
              onClick={() => trackEvent('sponsor_click', 'sponsors', 'Kaiser')}
              aria-label="Visit Kaiser Permanente website"
            >
              <img
                src={process.env.PUBLIC_URL + "/data/images/sponsor/Kaiser.svg"}
                alt="Kaiser Permanente"
                className="sponsor-logo"
              />
            </a>
            <a 
              href="https://www.hippocraticai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-logo-link"
              onClick={() => trackEvent('sponsor_click', 'sponsors', 'Hippocratic AI')}
              aria-label="Visit Hippocratic AI website"
            >
              <img
                src={process.env.PUBLIC_URL + "/data/images/sponsor/hipp.webp"}
                alt="Hippocratic AI"
                className="sponsor-logo"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Organizers Section Component
function OrganizersSection() {
  const organizers = useMemo(() => [
    {
      name: "Jiawei Xu",
      institution: "UT Austin",
      link: "https://jiaweixu98.github.io/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/jiaweixu.jpg"
    },
    {
      name: "Tiange Xiang",
      institution: "Stanford University",
      link: "https://ai.stanford.edu/~xtiange/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/tiange.jpg"
    },
    {
      name: "Pranav Rajpurkar",
      institution: "Harvard University",
      link: "https://dbmi.hms.harvard.edu/people/pranav-rajpurkar",
      image: process.env.PUBLIC_URL + "/data/images/organizers/PranavRajpurkar_1.jpeg"
    },
    {
      name: "Junyuan Hong",
      institution: "UT Austin",
      link: "https://jyhong.gitlab.io/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/junyuan.jpg"
    },
    {
      name: "Changan Chen",
      institution: "Stanford University",
      link: "https://changan.io/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/changan.jpg"
    },
    {
      name: "Ehsan Adeli",
      institution: "Stanford University",
      link: "https://profiles.stanford.edu/ehsan-adeli",
      image: process.env.PUBLIC_URL + "/data/images/organizers/ehsan.jpg"
    },
    {
      name: "Xiaoxiao Li",
      institution: "University of British Columbia",
      link: "https://xxlya.github.io/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/xiaoxiao.jpg"
    },
    {
      name: "Georgios Pavlakos",
      institution: "UT Austin",
      link: "https://geopavlakos.github.io/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/georgios_pavlakos_res.jpg"
    },
    {
      name: "Zakia Hammal",
      institution: "Robotics Institute RI/CMU",
      link: "https://www.ri.cmu.edu/ri-faculty/zakia-hammal/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/zakia.jpg"
    },
    {
      name: "Scott Delp",
      institution: "Stanford University",
      link: "https://profiles.stanford.edu/scott-delp",
      image: process.env.PUBLIC_URL + "/data/images/organizers/scott.png"
    },
    {
      name: "Fei-Fei Li",
      institution: "Stanford University",
      link: "https://profiles.stanford.edu/fei-fei-li",
      image: process.env.PUBLIC_URL + "/data/images/organizers/feifei.png"
    },
    {
      name: "Ying Ding",
      institution: "UT Austin",
      link: "https://ischool.utexas.edu/profiles/ying-ding",
      image: process.env.PUBLIC_URL + "/data/images/organizers/YingDing.jpg"
    }
  ], []);

  const awardCommittee = useMemo(() => [
    {
      name: "Tianlong Chen",
      institution: "The University of North Carolina at Chapel Hill",
      role: "Award Committee",
      link: "https://tianlong-chen.github.io/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/tianlong-chen.jpg"
    },
    {
      name: "Kaidi Xu",
      institution: "City University of Hong Kong",
      role: "Award Committee",
      link: "https://kaidixu.com/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/kaidi-xu.jpg"
    }
  ], []);

  const studentOrganizers = useMemo(() => [
    {
      name: "Lily Boddy",
      institution: "UT Austin",
      role: "Student Volunteer",
      link: "https://www.linkedin.com/in/lily-boddy/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/Lily Boddy.jpeg" 
    },
    {
      name: "Gregory Holste",
      institution: "UT Austin",
      role: "Student Volunteer",
      link: "https://www.gholste.me/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/Gregory.png" 
    },
    // {
    //   name: "Yan Han",
    //   institution: "Amazon",
    //   role: "Award Committee",
    //   link: "https://yannhan.github.io/",
    //   image: process.env.PUBLIC_URL + "/data/images/organizers/yanhan.jpeg"
    // }
  ], []);

  const localOrganizingCommittee = useMemo(() => [
    {
      name: "Sheng Liu",
      institution: "Stanford University",
      link: "https://shengliu66.github.io/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/shengliu.jpg"
    },
    {
      name: "Yan Han",
      institution: "Amazon",
      link: "https://yannhan.github.io/",
      image: process.env.PUBLIC_URL + "/data/images/organizers/yanhan.jpeg"
    }
  ], []);

    const pcMembers = useMemo(() => [
    { name: "Adibvafa Fallahpour", institution: "Cohere" },
    { name: "Adrita Anika", institution: "Amazon" },
    { name: "Akshay Swaminathan", institution: "Stanford University" },
    { name: "Alexandre Sallinen", institution: "EPFL - EPF Lausanne" },
    { name: "Alireza Rafiei", institution: "Emory University" },
    { name: "Aly A Khan", institution: "University of Chicago" },
    { name: "Amey Sunil Kulkarni", institution: "Independent Researcher" },
    { name: "Amin Adibi", institution: "University of British Columbia" },
    { name: "Antonio Parziale", institution: "University of Salerno" },
    { name: "Ariel Guerra-Adames", institution: "University of Bordeaux" },
    { name: "Arshia Ilaty", institution: "University of California, Irvine" },
    { name: "Awais Naeem", institution: "University of Texas at Austin" },
    { name: "Ayush Singla", institution: "Stanford University" },
    { name: "Bailey Trang", institution: "Stanford University" },
    { name: "Barbara Klaudel", institution: "Gdańsk University of Technology" },
    { name: "Bhanu Pratap Singh Rawat", institution: "University of Massachusetts, Amherst" },
    { name: "Bhawesh Kumar", institution: "Google" },
    { name: "Bogdan Kulynych", institution: "CHUV - University Hospital Lausanne" },
    { name: "Bowen Yi", institution: "University of Southern California" },
    { name: "Brian Hyeongseok Kim", institution: "University of Southern California" },
    { name: "Chengbo Zhan", institution: "University of Texas at Arlington" },
    { name: "Chufan Gao", institution: "University of Illinois Urbana-Champaign" },
    { name: "Chulin Xie", institution: "University of Illinois, Urbana Champaign" },
    { name: "Daniil Filienko", institution: "University of Washington" },
    { name: "David Calhas", institution: "Instituto de Engenharia de Sistemas e Computadores" },
    { name: "DeBrae Kennedy-Mayo", institution: "Law & Ethics at Georgia Institute of Technology" },
    { name: "Denis Jered McInerney", institution: "CodaMetrix" },
    { name: "Ethan Harvey", institution: "Tufts University" },
    { name: "Fabian Gröger", institution: "University of Basel" },
    { name: "Fangda Jiang", institution: "Peking University" },
    { name: "Fenglin Liu", institution: "Oxford University Hospitals" },
    { name: "Fengxiang Zhao", institution: "Facebook" },
    { name: "Francesco S. Carzaniga", institution: "International Business Machines" },
    { name: "Girish Narayanswamy", institution: "University of Washington" },
    { name: "Gregory Holste", institution: "University of Texas at Austin" },
    { name: "Guojun Xiong", institution: "Harvard University" },
    { name: "Haobo Zhang", institution: "University of Michigan - Ann Arbor" },
    { name: "Haoxu Huang", institution: "New York University" },
    { name: "Haoyang Wang", institution: "University of Texas at Austin" },
    { name: "Harshita Sharma", institution: "Microsoft" },
    { name: "Hasan Amin", institution: "Purdue University" },
    { name: "Hee Jung Choi", institution: "Stanford University" },
    { name: "Helen Zhou", institution: "Apple" },
    { name: "Hsin-Ling Hsu", institution: "Academia Sinica" },
    { name: "Huang-Ru Liao", institution: "NVIDIA" },
    { name: "Huimin Xu", institution: "University of Texas at Austin" },
    { name: "Iain Nash", institution: "Edge Hill University" },
    { name: "Jenny Xu", institution: "Stanford University" },
    { name: "Jiaee Cheong", institution: "Harvard University" },
    { name: "Jiawen Chen", institution: "University of North Carolina at Chapel Hill" },
    { name: "Jin Cui", institution: "Imperial College London" },
    { name: "Jindong Tian", institution: "East China Normal University" },
    { name: "Jinrui Fang", institution: "University of Texas at Austin" },
    { name: "Jitao Xu", institution: "Old Dominion University" },
    { name: "Joseph Paul Cohen", institution: "Amazon" },
    { name: "Josiah Aklilu", institution: "Stanford University" },
    { name: "Justin Xu", institution: "University of Oxford" },
    { name: "Kaidi Xu", institution: "City University of Hong Kong" },
    { name: "Kethmi Hirushini Hettige", institution: "Nanyang Technological University" },
    { name: "Kevin Ta", institution: "Yale University" },
    { name: "Kuk Jin Jang", institution: "University of Pennsylvania" },
    { name: "Kyle Cox", institution: "Melange" },
    { name: "Kyungmin Jeon", institution: "Seoul National University" },
    { name: "Lavanya Gupta", institution: "J.P. Morgan Chase" },
    { name: "Leopoldo Julian Lechuga Lopez", institution: "New York University" },
    { name: "Lingyun Wang", institution: "University of Pittsburgh" },
    { name: "Liu Chen", institution: "Harvard University" },
    { name: "Liwen Sun", institution: "Carnegie Mellon University" },
    { name: "Lovedeep Gondara", institution: "University of British Columbia" },
    { name: "Luyang Luo", institution: "Harvard Medical School" },
    { name: "Mahdi Arab Loodaricheh", institution: "City University of New York" },
    { name: "Mahmud Wasif Nafee", institution: "Rensselaer Polytechnic Institute" },
    { name: "Martin Norgaard", institution: "University of Copenhagen" },
    { name: "Maryam Khalid", institution: "Amazon" },
    { name: "Meng Xia", institution: "Duke University" },
    { name: "Mengdi Huai", institution: "Iowa State University" },
    { name: "Mengzhou Hu", institution: "University of California, San Diego" },
    { name: "Miguel Angel Fuentes Hernandez", institution: "Stanford University" },
    { name: "Miko Rimer", institution: "Stanford University" },
    { name: "Milos Vukadinovic", institution: "University of California, Los Angeles" },
    { name: "Mingfei Lu", institution: "University of Technology Sydney" },
    { name: "Monica Munnangi", institution: "Northeastern University" },
    { name: "Mozhgan Saeidi", institution: "Stanford University" },
    { name: "Muhammad Osama Khan", institution: "Amazon" },
    { name: "Nathalie Maria Kirch", institution: "King's College London" },
    { name: "Neeraj Kumar", institution: "Memorial Sloan Kettering Cancer Centre" },
    { name: "Nils Palumbo", institution: "University of Wisconsin - Madison" },
    { name: "Paloma Rabaey", institution: "Ghent University" },
    { name: "Pavan Reddy", institution: "George Washington University" },
    { name: "Pengcheng Jiang", institution: "University of Illinois at Urbana-Champaign" },
    { name: "Pierrette MAHORO MASTEL", institution: "Carnegie Mellon University" },
    { name: "Prajwal Kailas", institution: "Brigham and Women's Hospital" },
    { name: "Pranav Kulkarni", institution: "University of Maryland, College Park" },
    { name: "Qinru Li", institution: "University of California, San Diego" },
    { name: "Ricardo Santos", institution: "Fraunhofer Portugal AICOS" },
    { name: "Riqiang Gao", institution: "Siemens Healthineers" },
    { name: "Ruiyi Wang", institution: "University of California, San Diego" },
    { name: "Runyu Gao", institution: "Johns Hopkins University" },
    { name: "Sajib Acharjee Dip", institution: "Virginia Polytechnic Institute and State University" },
    { name: "Samuel Schmidgall", institution: "Johns Hopkins University" },
    { name: "Sayantan Kumar", institution: "National Institutes of Health" },
    { name: "SayedMorteza Malaekeh", institution: "University of Texas at Austin" },
    { name: "Seongsu Bae", institution: "Korea Advanced Institute of Science and Technology" },
    { name: "Seungjun Jang", institution: "Seoul National University" },
    { name: "Seungjun Yi", institution: "University of Texas at Austin" },
    { name: "Shantanu Ghosh", institution: "Boston University" },
    { name: "Shiru Wang", institution: "Dartmouth College" },
    { name: "Shiva Kaul", institution: "Harvard Medical School" },
    { name: "Shuai Niu", institution: "University of Hong Kong" },
    { name: "Siyu He", institution: "Stanford University" },
    { name: "Song Wang", institution: "University of Texas at Austin" },
    { name: "Suhana Bedi", institution: "Stanford University" },
    { name: "Thang T. Truong", institution: "Auburn University" },
    { name: "Thomas Ferté", institution: "University of Bordeaux" },
    { name: "Tianhao Li", institution: "University of Texas at Austin" },
    { name: "Wangjiaxuan Xin", institution: "University of North Carolina at Charlotte" },
    { name: "Wanniarachchi Kankanamge Malithi Mithsara", institution: "Southern Illinois University" },
    { name: "Wei Dai", institution: "Massachusetts Institute of Technology" },
    { name: "Weili Jiang", institution: "Southwest Jiaotong University" },
    { name: "Weiming Ren", institution: "University of Waterloo" },
    { name: "Weishen Pan", institution: "Weill Cornell Medicine, Cornell University" },
    { name: "Wenlong Deng", institution: "University of British Columbia" },
    { name: "Wenqi Shi", institution: "University of Texas Southwestern Medical Center" },
    { name: "William Boag", institution: "MassHealth" },
    { name: "Xiaolong Luo", institution: "Harvard University" },
    { name: "Xiaoman Zhang", institution: "Harvard Medical School" },
    { name: "Xiaotang Gai", institution: "Zhejiang University" },
    { name: "XIAOYAN SHEN", institution: "University of Texas at Arlington" },
    { name: "Xidong Wang", institution: "The Chinese University of Hong Kong" },
    { name: "Xu Cao", institution: "Stealth Mode Startup" },
    { name: "Xueqi Guo", institution: "Siemens Healthineers" },
    { name: "Yang Liu", institution: "University of Oulu" },
    { name: "Yanjun Gao", institution: "University of Colorado Anschutz Medical Campus" },
    { name: "Yen Nhi Truong Vu", institution: "Whiterabbit.ai" },
    { name: "Yeonsu Kwon", institution: "Korea Advanced Institute of Science & Technology" },
    { name: "Yi Bu", institution: "Peking University" },
    { name: "Yiğit Narter", institution: "Bilkent University" },
    { name: "Yihe Wang", institution: "University of North Carolina at Charlotte" },
    { name: "Yikun Han", institution: "University of Illinois at Urbana-Champaign" },
    { name: "Yilin Ye", institution: "Columbia University" },
    { name: "Ying Li", institution: "Curtin University of Technology" },
    { name: "Yiwei Li", institution: "Harvard University" },
    { name: "Yixin Wang", institution: "Stanford University" },
    { name: "Yixiong Chen", institution: "Johns Hopkins University" },
    { name: "YongGeon Lee", institution: "University of Texas at Austin" },
    { name: "Yu Fu", institution: "University of California, Riverside" },
    { name: "Yuan Yuan", institution: "Boston College" },
    { name: "Yujia Liu", institution: "University of California, San Diego" },
    { name: "Yuli Wang", institution: "Icahn School of Medicine at Mount Sinai" },
    { name: "Yunsoo Kim", institution: "University College London" },
    { name: "Yun-Wei Chu", institution: "Axon" },
    { name: "Yusu Fang", institution: "Peking University" },
    { name: "Yuwei Zhang", institution: "Computer Laboratory" },
    { name: "Zepeng Frazier Huo", institution: "Stanford University" },
    { name: "Zhenbang Wu", institution: "University of Illinois Urbana Champaign" },
    { name: "Zhihan Zheng", institution: "Peking University" },
    { name: "Zihan Wang", institution: "University of Washington" },
    { name: "Ziheng Chen", institution: "University of Texas at Austin" },
    { name: "Zijiao Chen", institution: "National University of Singaore" },
    { name: "Zijie Liu", institution: "University of North Carolina at Chapel Hill" },
    { name: "Zixin Ding", institution: "University of Chicago" }
  ], []);


  return (
    <div className="organizers-section">
      <h2 className="section-title">Organizers</h2>
      <div className="organizers-grid">
        {organizers.map((organizer, index) => (
          <OrganizerCard key={index} {...organizer} />
        ))}
      </div>

      {/* Award Committee Section */}
      <h3 className="organizers-subtitle">Award Committee</h3>
      <div className="organizers-grid organizers-grid--center">
        {awardCommittee.map((organizer, index) => (
          <OrganizerCard key={`award-${index}`} {...organizer} showRole={false} />
        ))}
      </div>

      {/* Student Organizers Section */}
      <h3 className="organizers-subtitle">Student Organizers</h3>
      <div className="organizers-grid organizers-grid--center">
        {studentOrganizers.map((organizer, index) => (
          <OrganizerCard key={`student-${index}`} {...organizer} showRole={false} />
        ))}
      </div>

      {/* Local Organizing Committee Section */}
      <h3 className="organizers-subtitle">Local Organizing Committee</h3>
      <div className="organizers-grid organizers-grid--center">
        {localOrganizingCommittee.map((organizer, index) => (
          <OrganizerCard key={`local-${index}`} {...organizer} showRole={false} />
        ))}
      </div>

      <h3 className="organizers-subtitle">Program Committee</h3>
      <p className="pc-note">Listed in alphabetical order</p>
      <div className="pc-members-list">
        {pcMembers.map((member, index) => (
          <div key={index} className="pc-member">
            <span className="pc-name">{member.name}</span>
            <br />
            <span className="pc-institution">{member.institution}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Organizer Card Component
function OrganizerCard({ name, institution, role, image, link, showRole = true }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  return (
    <article className="organizer-card">
      <div className="organizer-image-container">
        <img
          src={image}
          alt={`${name} from ${institution}`}
          className={`organizer-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={handleImageLoad}
          loading="lazy"
        />
        <div className="organizer-overlay">
          <a 
            href={link}
            className="organizer-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${name}'s profile`}
          >
            <ArrowForwardIcon />
          </a>
        </div>
      </div>
      
      <div className="organizer-info">
        <h4 className="organizer-name">{name}</h4>
        <p className="organizer-institution">{institution}</p>
        {showRole && role && <p className="organizer-role">{role}</p>}
      </div>
    </article>
  );
}



// Footer Component with improved structure
function Footer() {
  return (
    <footer className="footer" id="Contact">
      <div className="container">
        <div className="footer-content">
          <a 
            href="https://neurips.cc/"
            className="footer-logo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NeurIPS Homepage"
          >
            <img 
              alt="NeurIPS Logo" 
              src={process.env.PUBLIC_URL + '/data/images/logo/neurips-navbar-logo.svg'} 
            />
          </a>
                    <div className="footer-section">
            <h4 className="footer-title">Submission</h4>
            <a 
              href="https://openreview.net/group?id=NeurIPS.cc/2025/Workshop/GenAI4Health"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenReview Submission Portal
            </a>
          </div>
          
          <div className="footer-section" id="past-events-section">
            <h4 className="footer-title">Past Events</h4>
            <div className="footer-links-row" style={{ flexDirection: 'column', alignItems: 'center', gap: '0.5rem', display: 'flex' }}>
              <a 
                href="https://genai4health.github.io/2024-NeurIPS/"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GenAI4Health @ NeurIPS 2024
              </a>
              <a 
                href="https://sites.google.com/view/genai4health-aaai-2025"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GenAI4Health @ AAAI 2025
              </a>
            </div>
          </div>
 
          <div className="footer-section">
            <h4 className="footer-title">Important Dates</h4>
            <ul className="footer-dates">
              <li>Submissions: Sep 5, 2025</li>
              <li>Notifications: Sep 22, 2025</li>
              <li>Camera-ready: Oct 31, 2025</li>
              <li>Workshop: Dec 6, 2025</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Contact Us</h4>
            <p className="footer-contact">Jiawei Xu</p>
            <a 
              href="mailto:jiaweixu@utexas.edu"
              className="footer-link"
            >
              jiaweixu@utexas.edu
            </a>
            <p className="footer-contact">Tiange Xiang</p>
            <a 
              href="mailto:xtiange@stanford.edu"
              className="footer-link"
            >
              xtiange@stanford.edu
            </a>
            <p className="footer-contact">Follow Us</p>
            <a 
              href="https://x.com/GenAI4Health"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              @GenAI4Health on X
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            Copyright © NeurIPS 2025. All rights reserved | The Second Workshop on GenAI for Health: Potential, Trust, and Policy Compliance
          </p>
        </div>
      </div>
    </footer>
  );
}

export default App; 