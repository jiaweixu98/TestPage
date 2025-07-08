import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactGA from 'react-ga';
import { Link, Element } from 'react-scroll';
import { animateScroll as scroll } from 'react-scroll';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CoffeeIcon from '@mui/icons-material/Coffee';
import GroupsIcon from '@mui/icons-material/Groups';

// Initialize Google Analytics
ReactGA.initialize('G-0000000000');

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
    ReactGA.pageview('/');
  }, []);

  const scrollToTop = useCallback(() => {
    scroll.scrollToTop({ duration: 500, smooth: true });
  }, []);

  return (
    <div className="App">
      <NavigationBar isActive={isNavActive} />
      
      <main className="content">
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
    </div>
  );
}

// Navigation Component with improved accessibility
function NavigationBar({ isActive }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
            src="/data/images/logo/neurips-navbar-logo.svg" 
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
                className="nav-link"
                activeClass="active"
                onClick={closeMenu}
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

  return (
    <section className="home-section" ref={ref}>
      <div className={`home-content ${isVisible ? 'animate-in' : ''}`}>
        <h1 className="home-title">
          The Second Workshop on GenAI for Health:<br />
          Potential, Trust, and Policy Compliance
        </h1>
        
        <div className="home-meta">
          <a 
            href="https://neurips.cc/" 
            className="home-conference"
            target="_blank"
            rel="noopener noreferrer"
          >
            @NeurIPS 2025
          </a>
          <p className="home-location">San Diego, California, USA</p>
          <p className="home-date">December 7, 2025</p>
        </div>
        
        <div className="home-actions">
          <a 
            href="https://neurips.cc"
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Attend Conference
          </a>
          <a 
            href="https://openreview.net/group?id=neurips.cc/2025/Workshop/GenAI4Health" 
            className="btn btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
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
      link: "https://www.cs.jhu.edu/~saria/",
      image: "/data/images/speakers/suchi-saria-2.jpg",
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
      image: "/data/images/speakers/eric_topol.jpg",
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
      link: "https://vivo.weill.cornell.edu/display/cwid-few2001",
      image: "/data/images/speakers/FeiWang_1.jpeg",
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
      link: "https://www.linkedin.com/in/haider-warraich-md-8b4b5b1/",
      image: "/data/images/speakers/Haider_WarraichMD.jpg",
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
      link: "https://web.stanford.edu/~jameszou/",
      image: "/data/images/speakers/zou.jpg",
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
      link: "https://www.linkedin.com/in/vivek-natarajan-1a2b3c4d/",
      image: "/data/images/speakers/vivek.jpg",
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
      link: "https://www.linkedin.com/in/brian-kim-robotics/",
      image: "/data/images/speakers/brian.jpg",
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
      image: "/data/images/speakers/yeung.jpg",
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
      image: "/data/images/speakers/MarzyehGhassemi.jpeg",
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
      image: "/data/images/speakers/yixuanli-2019.jpg",
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
      link: "https://www.linkedin.com/in/munjalshah/",
      image: "/data/images/speakers/Munjal Shah_highrez.jpg",
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
      image: "/data/images/speakers/jimengsun.jpg",
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
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker(null);
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
          <h3>Keynote - {speaker.name}</h3>
        </header>
        
        <div className="modal-body">
          <h4 className="keynote-title">{speaker.keynote.title}</h4>
          
          <section className="keynote-abstract">
            <h5>Abstract</h5>
            <p>{speaker.keynote.abstract}</p>
          </section>
          
          <section className="keynote-profile">
            <h5>Speaker Profile</h5>
            <p>{speaker.keynote.profile}</p>
          </section>
        </div>
        
        <footer className="modal-footer">
          <a href={speaker.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </footer>
      </div>
    </div>
  );
}



// Agenda Section Component with improved structure
function AgendaSection() {
  const agenda = useMemo(() => [
    { time: "Morning Session", event: "", type: "header" },
    { time: "08:00 - 08:10", event: "Opening Remarks", type: "session" },
    { time: "08:10 - 10:10", event: "Keynote Session I (4 keynote talks, 30 min each incl. Q&A)", type: "session" },
    { time: "10:10 - 10:30", event: "Morning Coffee Break", type: "break" },
    { time: "10:30 - 11:00", event: "Panel Discussion I (with morning speakers)", type: "session" },
    { time: "11:00 - 11:45", event: "Contributed Talks I (3 research talks, 15 min each)", type: "session" },
    { time: "11:45 - 12:00", event: "Session Buffer", type: "buffer" },
    { time: "12:00 - 13:00", event: "Lunch Break", type: "break" },
    { time: "Afternoon Session", event: "", type: "header" },
    { time: "13:00 - 15:00", event: "Keynote Session II (4 keynote talks, 30 min each incl. Q&A)", type: "session" },
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
        <p className="agenda-date">December 7, 2025</p>
        
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
      title: "(1) GenAI Applications in Health",
      description: "Clinical diagnosis support, personalized treatment planning, synthetic biomedical data generation, AI-assisted surgical robotics, medical imaging interpretation."
    },
    {
      title: "(2) Trustworthiness and Risk Management",
      description: "Safety benchmarks, misuse detection, red teaming practices, explainability, ethical evaluations, bias mitigation."
    },
    {
      title: "(3) Policy, Regulation, and Compliance",
      description: "FDA alignment, international standards, regulatory frameworks, deployment strategies, collaboration between developers and clinicians."
    }
  ];

  const dates = [
    {
      date: "Aug 30, 2025",
      event: "PaperSubmission",
      icon: InsertDriveFileIcon
    },
    {
      date: "Sep 22, 2025",
      event: "Acceptance",
      icon: EmojiEventsIcon
    },
    {
      date: "Oct 15, 2025",
      event: "Camera-ready",
      icon: CoffeeIcon
    },
    {
      date: "Dec 7, 2025",
      event: "Workshop",
      icon: GroupsIcon
    }
  ];

  return (
    <div className="cfp-section">
      <h2 className="section-title">Call for Papers</h2>
      <p className="cfp-intro">
        We invite submissions of original work related to Generative AI in healthcare across three main areas:
      </p>
      
      <div className="topics-grid">
        {topics.map((topic, index) => (
          <div key={index} className="topic-card">
            <h4 className="topic-title">{topic.title}</h4>
            <p className="topic-description">{topic.description}</p>
          </div>
        ))}
      </div>
      
      <div className="submission-info">
        <div className="paper-types">
          <h4>Submission Types</h4>
          <div className="paper-types-list">
            <div className="paper-type">
              <h5>Research Papers</h5>
              <p>Original methodological advances and empirical evaluations in GenAI for healthcare               <span className="page-limit">≤9 pages</span>
               </p>
            </div>
            <div className="paper-type">
              <h5>Demonstration Papers</h5>
              <p>Working systems, applications, and tools with practical healthcare impact               <span className="page-limit">≤5 pages</span>
              </p>
            </div>
            <div className="paper-type">
              <h5>Position Papers</h5>
              <p>Policy perspectives, governance frameworks, and deployment strategies               <span className="page-limit">≤5 pages</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="important-dates">
          <h4>Important Dates</h4>
          <div className="dates-grid">
            {dates.map((item, index) => (
              <div key={index} className="date-card">
                <div className="date-icon">
                  <item.icon />
                </div>
                <time className="date-value">{item.date}</time>
                <p className="date-event">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="submission-highlight">
          <h4>Submit Your Paper</h4>
          <p>All submissions must be made through our OpenReview portal:</p>
          <a 
            href="https://openreview.net/group?id=neurips.cc/2025/Workshop/GenAI4Health"
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenReview Submission Portal
          </a>
        </div>
      </div>
    </div>
  );
}

// Organizers Section Component
function OrganizersSection() {
  const organizers = useMemo(() => [
    {
      name: "Jiawei Xu",
      institution: "UT Austin",
      link: "https://www.linkedin.com/in/jiawei-xu-ut/",
      image: "/data/images/organizers/jiaweixu.jpg"
    },
    {
      name: "Tiange Xiang",
      institution: "Stanford University",
      link: "https://www.linkedin.com/in/tiange-xiang/",
      image: "/data/images/organizers/tiange.jpg"
    },
    {
      name: "Pranav Rajpurkar",
      institution: "Harvard University",
      link: "https://rajpurkar.github.io/",
      image: "/data/images/organizers/PranavRajpurkar_1.jpeg"
    },
    {
      name: "Junyuan Hong",
      institution: "UT Austin",
      link: "https://www.linkedin.com/in/junyuan-hong/",
      image: "/data/images/organizers/junyuan.jpg"
    },
    {
      name: "Changan Chen",
      institution: "Stanford University",
      link: "https://www.linkedin.com/in/changan-chen/",
      image: "/data/images/organizers/changan.jpg"
    },
    {
      name: "Ehsan Adeli",
      institution: "Stanford University",
      link: "https://profiles.stanford.edu/ehsan-adeli",
      image: "/data/images/organizers/ehsan.jpg"
    },
    {
      name: "Xiaoxiao Li",
      institution: "University of British Columbia",
      link: "https://www.ece.ubc.ca/~xiaoxiaoli/",
      image: "/data/images/organizers/xiaoxiao.jpg"
    },
    {
      name: "Georgios Pavlakos",
      institution: "UT Austin",
      link: "https://geopavlakos.github.io/",
      image: "/data/images/organizers/georgios_pavlakos_res.jpg"
    },
    {
      name: "Scott Delp",
      institution: "Stanford University",
      link: "https://profiles.stanford.edu/scott-delp",
      image: "/data/images/organizers/scott.png"
    },
    {
      name: "Fei-Fei Li",
      institution: "Stanford University",
      link: "https://profiles.stanford.edu/fei-fei-li",
      image: "/data/images/organizers/feifei.png"
    },
    {
      name: "Ying Ding",
      institution: "UT Austin",
      link: "https://yingding.ischool.utexas.edu/",
      image: "/data/images/organizers/YingDing.jpg"
    }
  ], []);

  return (
    <div className="organizers-section">
      <h2 className="section-title">Organizers</h2>
      <div className="organizers-grid">
        {organizers.map((organizer, index) => (
          <OrganizerCard key={index} {...organizer} />
        ))}
      </div>
    </div>
  );
}

// Organizer Card Component
function OrganizerCard({ name, institution, image, link }) {
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
          <div className="footer-section">
            <a 
              href="https://neurips.cc/"
              className="footer-logo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="NeurIPS Homepage"
            >
              <img 
                alt="NeurIPS Logo" 
                src="/data/images/logo/neurips-navbar-logo.svg" 
              />
            </a>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Submission</h4>
            <a 
              href="https://openreview.net/group?id=neurips.cc/2025/Workshop/GenAI4Health"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenReview Submission Portal
            </a>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-title">Important Dates</h4>
            <ul className="footer-dates">
              <li>Submissions: Aug 30, 2025</li>
              <li>Notifications: Sep 22, 2025</li>
              <li>Camera-ready: Oct 15, 2025</li>
              <li>Workshop: Dec 7, 2025</li>
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