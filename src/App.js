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
  
  const navItems = [
    { id: "home", label: "Home", to: "Home" },
    { id: "speakers", label: "Speakers", to: "Speakers" },
    { id: "agenda", label: "Agenda", to: "Agenda" },
    { id: "call-for-papers", label: "Call for Papers", to: "Call for Papers" },
    { id: "organizers", label: "Organizers", to: "Organizers" },
    { id: "contact", label: "Contact", to: "Contact" }
  ];

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
                offset={-80}
                duration={300}
                className={`nav-link ${activeSection === item.to ? 'active' : ''}`}
                activeClass="active"
                onClick={() => {
                  setActiveSection(item.to);
                  closeMenu();
                  trackEvent('navigation_click', 'navigation', item.label);
                }}
                onSetActive={() => setActiveSection(item.to)}
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
            href="https://neurips.cc/" 
            className="home-conference"
            target="_blank"
            rel="noopener noreferrer"
          >
            GenAI4Health @NeurIPS 2025
          </a>
          <p className="home-location">San Diego Convention Center, California, USA</p>
          <p className="home-date">December 6 or 7, 2025</p>
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
      id: "brian-kim",
      name: "Brian Kim",
      institution: "Stanford University",
      link: "https://profiles.stanford.edu/juyong-kim",
      image: process.env.PUBLIC_URL + "/data/images/speakers/brian.jpg",
      category: "GenAI Use Cases for Health",
      keynote: { 
        title: "AI-Driven Autonomous Surgical Workflows", 
        abstract: "Dr. Kim will discuss AI-driven autonomous surgical workflows and dexterous manipulation for robotics in healthcare.", 
        profile: "Postdoc at Stanford, advised by Chelsea Finn. His research focuses on AI-driven autonomous surgical workflows and dexterous manipulation for robotics in healthcare." 
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
      id: "munjal-shah",
      name: "Munjal Shah",
      institution: "Hippocratic AI",
      link: "https://www.hippocraticai.com/munjal-shah",
      image: process.env.PUBLIC_URL + "/data/images/speakers/Munjal Shah_highrez.jpg",
      category: "GenAI Trustworthiness and Risks in Health",
      keynote: { 
        title: "Safety-Focused LLMs for Healthcare", 
        abstract: "Dr. Shah will discuss developing safety-focused LLMs for healthcare staffing and AI-driven health records.", 
        profile: "CEO of Hippocratic AI, developing safety-focused LLMs for healthcare staffing. A serial entrepreneur, he has expertise in AI-driven health records." 
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
    { time: "Morning Session", event: "", type: "header" },
    { time: "08:00 - 08:10", event: "Opening Remarks", type: "session" },
    { time: "08:10 - 10:10", event: "Keynote Session I (6 keynote talks, 20 min each)", type: "session" },
    { time: "10:10 - 10:30", event: "Morning Coffee Break", type: "break" },
    { time: "10:30 - 11:00", event: "Panel Discussion I (with morning speakers)", type: "session" },
    { time: "11:00 - 11:45", event: "Contributed Talks I (3 research talks, 15 min each)", type: "session" },
    { time: "11:45 - 12:00", event: "Session Buffer", type: "buffer" },
    { time: "12:00 - 13:00", event: "Lunch Break", type: "break" },
    { time: "Afternoon Session", event: "", type: "header" },
    { time: "13:00 - 15:00", event: "Keynote Session II (6 keynote talks, 20 min each)", type: "session" },
    { time: "15:00 - 15:20", event: "Afternoon Coffee Break", type: "break" },
    { time: "15:20 - 15:50", event: "Panel Discussion II (with afternoon speakers)", type: "session" },
    { time: "15:50 - 16:40", event: "Poster Session (1 interactive session, 50 min)", type: "session" },
    { time: "16:40 - 16:50", event: "Award Ceremony", type: "session" },
    { time: "16:50 - 17:00", event: "Closing Remarks", type: "session" }
  ], []);

  return (
    <section className="agenda-section">
      <div className="container">
        <h2 className="section-title">Agenda</h2>
        <p className="agenda-date">December 6 or 7, 2025 @ San Diego Convention Center</p>
        
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
      description: "Provide insights on policy frameworks and deployment challenges. See <a href='https://neurips.cc/Conferences/2025/CallForPositionPapers' target='_blank' rel='noopener noreferrer'>NeurIPS 2025 Call for Position Papers</a> for more details. The main content of the paper should be no longer than 5 pages. <strong>The paper title should start with 'Position:'</strong>.",
      icon: EmojiEventsIcon
    }
  ];

  const dates = [
    {
      date: "Aug 22, 2025",
      event: "Paper Submission Deadline",
      icon: InsertDriveFileIcon
    },
    {
      date: "Sep 22, 2025", 
      event: "Acceptance Notification",
      icon: EmojiEventsIcon
    },
    {
      date: "Oct 15, 2025",
      event: "Camera-ready Submission",
      icon: InsertDriveFileIcon
    },
    {
      date: "Dec 6 or 7, 2025",
      event: "Workshop Day",
      icon: GroupsIcon
    }
  ];

  return (
    <section className="cfp-section">
      <div className="container">
        <h2 className="section-title">Call for Papers</h2>
        
        <div className="cfp-content">
          <div className="cfp-about">
            <h3 className="cfp-subtitle">About</h3>
            <p className="cfp-text">
              Following the successful first GenAI4Health workshop at NeurIPS 2024 (<a href="https://genai4health.github.io/" target="_blank" rel="noopener noreferrer">https://genai4health.github.io/</a>), generative AI in healthcare has rapidly evolved from exploratory studies to real-world deployments. With increasing FDA involvement and expanding global regulatory frameworks, the second GenAI4Health workshop aims to bring together AI4Health practitioners, safety researchers, and policy experts to address critical challenges in developing robust and policy-compliant GenAI technologies for health.
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
            <p className="cfp-text" style={{marginTop: '20px', textAlign: 'center', fontWeight: 'bold', color: '#d32f2f'}}>
              <strong>⚠️ All deadlines are at 11:59 PM AoE (Anywhere on Earth)</strong>
            </p>
          </div>
          <br></br>

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
                <li>Use <code>\usepackage{'{neurips_2025}'}</code> without options to ensure the submission is anonymous</li>
                <li><strong>All page limits exclude acknowledgments, references, and appendix</strong></li>
                <li>Papers may be rejected without consideration of their merits if they fail to meet the submission requirements</li>
                <li>We encourage multidisciplinary submissions involving stakeholders from healthcare, public policy, or adjacent fields to ensure practical relevance and responsible innovation</li>
                <li>Supplementary materials (code, data, videos) may be submitted as appendices</li>
                <li>Submissions must not be under review at other venues at the time of submission and should be unpublished (pre-print is allowed)</li>
                <li><strong>The accepted papers will be non-archival (NOT included in proceedings or any form of publication)</strong></li>
                <li><strong>Non-archival status means papers can be submitted to other venues after the workshop</strong></li>
              </ul>
            </div>

            <div className="review-process">
              <h4 className="cfp-subsection-title">Review Process</h4>
              <ul className="cfp-list">
                <li>Each paper will receive three anonymous reviews</li>
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
      institution: "CMU",
      link: "https://www.cmu.edu/bme/People/Faculty/profile/zhammal.html",
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

    const pcMembers = useMemo(() => [
    { name: "Ajay Jaiswal", institution: "Apple" },
    { name: "Akshay Swaminathan", institution: "Stanford" },
    { name: "Bojian Hou", institution: "UPenn" },
    { name: "Carl Yang", institution: "Emory" },
    { name: "Chulin Xie", institution: "UIUC" },
    { name: "Greg Holste", institution: "UT Austin" },
    { name: "Haobo Zhang", institution: "MSU" },
    { name: "Han Xie", institution: "Emory" },
    { name: "Hejie Cui", institution: "Stanford" },
    { name: "Jiaying Lu", institution: "Emory" },
    { name: "Jiayu Zhou", institution: "MSU" },
    { name: "Jie Liu", institution: "CityU HK" },
    { name: "Jiliang Tang", institution: "MSU" },
    { name: "Jinzhen Hu", institution: "JHU" },
    { name: "Joseph Cohen", institution: "Amazon" },
    { name: "Juan Zhou", institution: "NUS" },
    { name: "Junbiao Li", institution: "DUT" },
    { name: "Junfei Xiao", institution: "JHU" },
    { name: "Justin Engelmann", institution: "Edinburgh" },
    { name: "Kaiwen Zha", institution: "MIT" },
    { name: "Kaidi Xu", institution: "Drexel" },
    { name: "Kaixiong Zhou", institution: "MIT" },
    { name: "Karam Maher", institution: "Cairo" },
    { name: "Kowshik Thopalli", institution: "ASU" },
    { name: "Liangyu Chen", institution: "NTU" },
    { name: "Ling Luo", institution: "DUT" },
    { name: "Lukas Klein", institution: "ETH Zurich" },
    { name: "Mahed Abroshan", institution: "Optum AI" },
    { name: "Martin Norgaard", institution: "Copenhagen" },
    { name: "Md Mahfuzur Rahman", institution: "GSU" },
    { name: "Mehmet Gulum", institution: "UofL" },
    { name: "Meirui Jiang", institution: "CUHK" },
    { name: "Michael Wornow", institution: "Stanford" },
    { name: "Miguel Fuentes", institution: "Stanford" },
    { name: "Mohammad Ali Khan", institution: "UCSD" },
    { name: "Mohammad Reza Hosseinzadeh Taher", institution: "ASU" },
    { name: "Monica Munnangi", institution: "Stanford" },
    { name: "Nidhi Rastogi", institution: "RIT" },
    { name: "Nikita Moriakov", institution: "Radboud UMC" },
    { name: "Noah Lewis", institution: "GT" },
    { name: "Ophelia Yin", institution: "UCSF" },
    { name: "Prithwish Chakraborty", institution: "Amazon" },
    { name: "Puneet Kumar", institution: "IIT Delhi" },
    { name: "Qinbin Li", institution: "UC Berkeley" },
    { name: "Qinru Li", institution: "UCSD" },
    { name: "Qi Chen", institution: "USTC" },
    { name: "Qixin Hu", institution: "HUST" },
    { name: "Riqiang Gao", institution: "Siemens Healthineers" },
    { name: "Rishards Marcinkevics", institution: "ETH Zurich" },
    { name: "Ruibin Feng", institution: "Stanford" },
    { name: "Ruishan Liu", institution: "Stanford" },
    { name: "Runyu Gao", institution: "JHU" },
    { name: "Satyapriya Krishna", institution: "Harvard" },
    { name: "Sarah Woldemariam", institution: "UCSF" },
    { name: "Sayantan Kumar", institution: "WashU" },
    { name: "Shantanu Ghosh", institution: "BU" },
    { name: "Sheng Li", institution: "Stanford" },
    { name: "Shiru Wang", institution: "Dartmouth" },
    { name: "Shuang Li", institution: "CUHK-SZ" },
    { name: "Shuhao Fu", institution: "UCLA" },
    { name: "Song Wang", institution: "UT Austin" },
    { name: "Sonish Sivarajkumar", institution: "Pitt" },
    { name: "Suhana Bedi", institution: "Stanford" },
    { name: "Syed Hasan Amin Mahmood", institution: "Purdue" },
    { name: "Tiancheng Lin", institution: "SJTU" },
    { name: "Tianhao Li", institution: "UT Austin" },
    { name: "Tianlong Chen", institution: "UNC Chapel Hill" },
    { name: "Tianrui Liu", institution: "Imperial" },
    { name: "Tongtong Su", institution: "SEU" },
    { name: "Tuomas Oikarinen", institution: "UCSD" },
    { name: "Wei Jin", institution: "Emory" },
    { name: "Weicheng Zhu", institution: "NYU" },
    { name: "Wenlong Deng", institution: "UBC" },
    { name: "Wenxuan Li", institution: "JHU" },
    { name: "Wenying Deng", institution: "Harvard" },
    { name: "Xiaoxiao Li", institution: "UBC" },
    { name: "Xiangru Tang", institution: "Yale" },
    { name: "Xuelin Yang", institution: "Stanford" },
    { name: "Xuxi Chen", institution: "UT Austin" },
    { name: "Ya Tang", institution: "UMass" },
    { name: "Yahan Yang", institution: "UPenn SEAS" },
    { name: "Yasuobu Nohara", institution: "Kumamoto" },
    { name: "Yifan Wu", institution: "UPenn" },
    { name: "Yingwei Li", institution: "Waymo LLC" },
    { name: "Yixiong Chen", institution: "JHU" },
    { name: "Yongyi Lu", institution: "GDUT" },
    { name: "Yu-Cheng Chou", institution: "JHU" },
    { name: "Yuankai Huo", institution: "Vanderbilt" },
    { name: "Yuxiang Lai", institution: "SEU" },
    { name: "Zepeng Huo", institution: "Stanford" },
    { name: "Zhenglun Kong", institution: "MIT" },
    { name: "Ziwei Yang", institution: "UT Austin" }
  ], []);

  const [visiblePcMembers, setVisiblePcMembers] = useState(20);
  const [showLoadMore, setShowLoadMore] = useState(true);

  const handleLoadMore = useCallback(() => {
    const newCount = visiblePcMembers + 20;
    setVisiblePcMembers(newCount);
    if (newCount >= pcMembers.length) {
      setShowLoadMore(false);
    }
  }, [visiblePcMembers, pcMembers.length]);

  return (
    <div className="organizers-section">
      <h2 className="section-title">Organizers</h2>
      <div className="organizers-grid">
        {organizers.map((organizer, index) => (
          <OrganizerCard key={index} {...organizer} />
        ))}
      </div>

      {/* Student Organizers Section */}
      <h3 className="organizers-subtitle">Student Organizers</h3>
      <div className="organizers-grid">
        {studentOrganizers.map((organizer, index) => (
          <OrganizerCard key={`student-${index}`} {...organizer} showRole={false} />
        ))}
      </div>

      <h3 className="organizers-subtitle">Program Committee</h3>
      <p className="pc-note">Listed in alphabetical order</p>
      <div className="pc-members-list">
        {pcMembers.slice(0, visiblePcMembers).map((member, index) => (
          <div key={index} className="pc-member">
            <span className="pc-name">{member.name}</span>
            <br />
            <span className="pc-institution">{member.institution}</span>
          </div>
        ))}
      </div>
      
      {showLoadMore && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={handleLoadMore}>
            More PC Members ({pcMembers.length - visiblePcMembers} remaining)
          </button>
        </div>
      )}
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
          <div className="footer-section">
            <h4 className="footer-title">Past Events</h4>
            <div className="footer-links-row" style={{ flexDirection: 'column', alignItems: 'center', gap: '0.5rem', display: 'flex' }}>
              <a 
                href="https://genai4health.github.io/"
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
              <li>Submissions: Aug 22, 2025</li>
              <li>Notifications: Sep 22, 2025</li>
              <li>Camera-ready: Oct 15, 2025</li>
              <li>Workshop: Dec 6 or 7, 2025</li>
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