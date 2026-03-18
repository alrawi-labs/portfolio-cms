import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Phone, Mail, MapPin, ArrowUp, Facebook, Linkedin, Dribbble, Github } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Conducting qualitative and quantitative research to understand user needs, behaviors, and pain points. Utilizing methods..."
    },
    {
      id: 2,
      title: "UI/UX Design",
      description: "Conducting qualitative and quantitative research to understand user needs, behaviors, and pain points. Utilizing methods..."
    },
    {
      id: 3,
      title: "Content Writing",
      description: "Conducting qualitative and quantitative research to understand user needs, behaviors, and pain points. Utilizing methods..."
    },
    {
      id: 4,
      title: "Digital Marketing",
      description: "Conducting qualitative and quantitative research to understand user needs, behaviors, and pain points. Utilizing methods..."
    }
  ];

  const portfolios = [
    {
      id: 1,
      title: "Mochnix",
      category: "branding",
      image: "https://gerold.themejunction.net/wp-content/uploads/2024/05/portfolio-1.jpg",
      description: "Project was about precision and information...."
    },
    {
      id: 2,
      title: "Sebastian",
      category: "apps",
      image: "https://gerold.themejunction.net/wp-content/uploads/2024/05/portfolio-2.jpg",
      description: "Project was about precision and information...."
    },
    {
      id: 3,
      title: "New Age",
      category: "ux-ui",
      image: "https://gerold.themejunction.net/wp-content/uploads/2024/05/portfolio-4.jpg",
      description: "Project was about precision and information...."
    },
    {
      id: 4,
      title: "Deloitte",
      category: "branding",
      image: "https://gerold.themejunction.net/wp-content/uploads/2024/05/portfolio-3.jpg",
      description: "Project was about precision and information...."
    }
  ];

  const skills = [
    { name: "Figma", percentage: 92, icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/figma.png" },
    { name: "Sketch", percentage: 80, icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/sketch.png" },
    { name: "XD", percentage: 85, icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/xd.png" },
    { name: "WordPress", percentage: 99, icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/wp.png" },
    { name: "React", percentage: 89, icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/react.png" },
    { name: "JavaScript", percentage: 93, icon: "https://gerold.themejunction.net/wp-content/uploads/2024/05/js.png" }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Brandon Fraser",
      role: "Senior Software Dev, Cosmic Sport",
      quote: "Taylor is a professional Designer he really helps my business by providing value to my business.",
      image: "https://gerold.themejunction.net/wp-content/uploads/2024/05/testi-1.jpg"
    },
    {
      id: 2,
      name: "Tim Bailey",
      role: "SEO Specialist, Theme Junction",
      quote: "Taylor is a professional Designer he really helps my business by providing value to my business.",
      image: "https://gerold.themejunction.net/wp-content/uploads/2024/05/testi-2.jpg"
    }
  ];

  const experiences = [
    { period: "2022 - Present", title: "Lead Developer", company: "Blockdots, London" },
    { period: "2021 - 2022", title: "Full Stack Web Developer", company: "Parsons, The New School" },
    { period: "2020 - 2021", title: "UI Designer", company: "House of Life, Leeds" },
    { period: "2018 - 2020", title: "Junior Graphics Designer", company: "Theme Junction, Bursa" }
  ];

  const educations = [
    { period: "2020 - 2023", title: "Programming course", institute: "Harverd University" },
    { period: "2016 - 2020", title: "Graphic design course", institute: "University of Denmark" },
    { period: "2012 - 2015", title: "Web design course", institute: "University of California" },
    { period: "2010 - 2011", title: "Design & Technology", institute: "Parsons, The New School" }
  ];

  const filteredPortfolios = activeFilter === 'all'
    ? portfolios
    : portfolios.filter(item => item.category === activeFilter);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent!');
  };

  return (
    <div className="min-h-screen bg-[#140c1c] text-white font-['Sora']">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#140c1c]/90 backdrop-blur-sm py-2' : 'py-4'} border-b border-gray-800`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="https://gerold.themejunction.net/wp-content/themes/gerold/assets/images/logos/logo-primary.png" 
                alt="logo" 
                className="h-12 w-auto"
              />
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#services" className="hover:text-purple-400 transition-colors relative group">
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#works" className="hover:text-purple-400 transition-colors relative group">
                Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#resume" className="hover:text-purple-400 transition-colors relative group">
                Resume
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#skills" className="hover:text-purple-400 transition-colors relative group">
                Skills
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className="hover:text-purple-400 transition-colors relative group">
                Testimonials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="hover:text-purple-400 transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
                Hire me!
              </button>
            </div>

            <button 
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#140c1c]/95 backdrop-blur-sm border-t border-gray-800">
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                <a href="#services" className="hover:text-purple-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Services</a>
                <a href="#works" className="hover:text-purple-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Works</a>
                <a href="#resume" className="hover:text-purple-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Resume</a>
                <a href="#skills" className="hover:text-purple-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Skills</a>
                <a href="#testimonials" className="hover:text-purple-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
                <a href="#contact" className="hover:text-purple-400 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Contact</a>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-2 rounded-full transition-all duration-300 text-center">
                  Hire me!
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section pt-32 pb-20 relative">
        <div className="intro_text">
          <svg width="100%" height="100%" viewBox="0 0 1200 800">
            <text 
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="200" 
              fill="none" 
              stroke="rgba(139, 92, 246, 0.1)" 
              strokeWidth="2"
            >
              HI
            </text>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h1 className="text-6xl lg:text-7xl font-bold mb-6 hero-title">
                  I am Gerold
                </h1>
                <h2 className="text-3xl lg:text-4xl mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Web Developer + UX Designer
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  I break down complex user experience problems to create integrity focussed solutions that connect billions of people
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                    <Download size={20} />
                    Download CV
                  </button>
                  <div className="flex gap-3">
                    <a href="#" className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                      <Facebook size={20} />
                    </a>
                    <a href="#" className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                      <Linkedin size={20} />
                    </a>
                    <a href="#" className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                      <Dribbble size={20} />
                    </a>
                    <a href="#" className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="animate-fade-in-up-delay">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
                  <img 
                    src="https://gerold.themejunction.net/wp-content/uploads/2024/05/hero-img-2.png" 
                    alt="Gerold" 
                    className="relative z-10 w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                14
              </div>
              <div className="text-gray-400">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-gray-400">Project Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                1.5K
              </div>
              <div className="text-gray-400">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                14
              </div>
              <div className="text-gray-400">Years of Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20" id="services">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in-up">My Quality Services</h2>
            <p className="text-gray-400 max-w-2xl mx-auto animate-fade-in-up-delay">
              We put your ideas and thus your wishes in the form of a unique web project that inspires you and you customers.
            </p>
          </div>

          <div className="space-y-6">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`p-8 rounded-lg transition-all duration-300 cursor-pointer border-2 ${
                  activeService === index 
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500' 
                    : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                }`}
                onMouseEnter={() => setActiveService(index)}
              >
                <div className="grid lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-10">
                    <div className="flex items-start gap-6">
                      <div className="text-5xl font-bold text-purple-400/30">
                        0{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                        <p className="text-gray-400">{service.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 flex justify-end">
                    <ArrowUp className="transform rotate-45 text-purple-400" size={24} />
                  </div>
                </div>
                <div className={`h-1 bg-gradient-to-r from-purple-600 to-blue-600 mt-6 rounded-full transition-all duration-300 ${
                  activeService === index ? 'opacity-100' : 'opacity-0'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works Section */}
      <section className="py-20 bg-gray-900/50 backdrop-blur-sm" id="works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in-up">My Recent Works</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              className={`px-6 py-2 rounded-full transition-all ${activeFilter === 'all' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all ${activeFilter === 'apps' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveFilter('apps')}
            >
              Apps
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all ${activeFilter === 'branding' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveFilter('branding')}
            >
              Branding
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all ${activeFilter === 'ux-ui' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveFilter('ux-ui')}
            >
              UX/UI
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolios.map((portfolio, index) => (
              <div
                key={portfolio.id}
                className="group relative overflow-hidden rounded-lg bg-gray-800 hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={portfolio.image} 
                    alt={portfolio.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{portfolio.title}</h3>
                  <p className="text-gray-400 mb-4">{portfolio.description}</p>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                    View Project
                    <ArrowUp className="transform rotate-45" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section className="py-20" id="resume">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">My Experience</h2>
              </div>
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-purple-500 pl-6 relative group"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="text-purple-400 text-sm font-medium">{exp.period}</div>
                    <h3 className="text-xl font-semibold mt-1 group-hover:text-white transition-colors">{exp.title}</h3>
                    <div className="text-gray-400">{exp.company}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">My Education</h2>
              </div>
              <div className="space-y-8">
                {educations.map((edu, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-purple-500 pl-6 relative group"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="text-purple-400 text-sm font-medium">{edu.period}</div>
                    <h3 className="text-xl font-semibold mt-1 group-hover:text-white transition-colors">{edu.title}</h3>
                    <div className="text-gray-400">{edu.institute}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gray-900/50 backdrop-blur-sm" id="skills">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in-up">My Skills</h2>
            <p className="text-gray-400 max-w-2xl mx-auto animate-fade-in-up-delay">
              We put your ideas and thus your wishes in the form of a unique web project that inspires you and you customers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="text-center group hover:scale-110 transition-transform duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300">
                  <img src={skill.icon} alt={skill.name} className="w-10 h-10" />
                </div>
                <div className="text-2xl font-bold text-purple-400 mb-1 group-hover:text-purple-300 transition-colors">{skill.percentage}%</div>
                <div className="text-gray-300 group-hover:text-white transition-colors">{skill.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="text-left mb-16">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in-up">My Client's Stories</h2>
            <p className="text-gray-400 max-w-2xl animate-fade-in-up-delay">
              Empowering people in new a digital journey with my super services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                    <div className="text-purple-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900/50 backdrop-blur-sm" id="contact">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-left mb-16">
              <h2 className="text-4xl font-bold mb-4 animate-fade-in-up">Let's work together!</h2>
              <p className="text-gray-400 max-w-2xl animate-fade-in-up-delay">
                I design and code beautifully simple things and i love what i do. Just simple like that!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="First name"
                      className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-400"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-400"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-400"
                    />
                  </div>
                  <select className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-400">
                    <option value="">--Please choose an option--</option>
                    <option value="Branding Design">Branding Design</option>
                    <option value="Web Design">Web Design</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="App Design">App Design</option>
                  </select>
                  <textarea
                    placeholder="Message"
                    rows={5}
                    className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-gray-400"
                  ></textarea>
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    Send Message
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-gray-400">Phone</div>
                    <div className="text-lg group-hover:text-white transition-colors">+01 123 654 8096</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-gray-400">Email</div>
                    <div className="text-lg group-hover:text-white transition-colors">gerolddesign@mail.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-gray-400">Address</div>
                    <div className="text-lg group-hover:text-white transition-colors">Warne Park Street Pine, FL 33157, New York</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#140c1c] border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <img 
                src="https://gerold.themejunction.net/wp-content/themes/gerold/assets/images/logos/logo-primary.png" 
                alt="logo" 
                className="h-12 w-auto"
              />
            </div>
            <nav className="flex flex-wrap justify-center gap-8 mb-8">
              <a href="#services" className="hover:text-purple-400 transition-colors relative group">
                Services.
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#works" className="hover:text-purple-400 transition-colors relative group">
                Work.
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#skills" className="hover:text-purple-400 transition-colors relative group">
                Skills.
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#resume" className="hover:text-purple-400 transition-colors relative group">
                Experience.
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors relative group">
                Blog.
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>
            <div className="text-gray-400">
              © 2025 All Rights Reserved by <a href="https://themejunction.net/" className="text-purple-400 hover:underline">ThemeJunction</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      {scrollY > 500 && (
        <button
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all duration-300 z-50 hover:scale-110"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={20} />
        </button>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        body {
          font-family: 'Sora', sans-serif;
          background-color: #140c1c;
          color: white;
          margin: 0;
          padding: 0;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-fade-in-up-delay {
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .hero-section {
          position: relative;
          overflow: hidden;
        }

        .intro_text {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-center;
          z-index: 0;
        }

        .intro_text svg text {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;


# Next.js Portfolio Projesi

Bu proje, modern bir portfolio web sitesini Next.js App Router kullanarak geliştirir.

## 📁 Dosya Yapısı

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Ana sayfa
│   └── globals.css         # Global stiller
├── components/
│   ├── Hero/
│   │   └── Hero.tsx
│   ├── Services/
│   │   └── Services.tsx
│   ├── Projects/
│   │   └── Works.tsx
│   ├── Resume/
│   │   └── Resume.tsx
│   ├── Skills/
│   │   └── Skills.tsx
│   ├── Testimonials/
│   │   └── Testimonials.tsx
│   ├── Contact/
│   │   └── Contact.tsx
│   └── Shared/
│       ├── Header.tsx
│       ├── Stats.tsx
│       ├── Footer.tsx
│       └── ScrollToTop.tsx
├── data/
│   ├── types.ts           # TypeScript tipleri
│   └── portfolioData.ts   # Tüm veriler
└── public/
    └── assets/
```

## 🚀 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

3. Tarayıcınızda açın: [http://localhost:3000](http://localhost:3000)

## 📦 Kullanılan Teknolojiler

- **Next.js 14+** - App Router
- **React 18+**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** - İkonlar için

## 🎨 Özellikler

- ✅ Responsive tasarım
- ✅ Modern animasyonlar
- ✅ TypeScript tip güvenliği
- ✅ Modüler component yapısı
- ✅ SEO dostu
- ✅ Performanslı

## 📝 Özelleştirme

### Veri Güncelleme

Tüm içerik verileri `data/portfolioData.ts` dosyasında bulunur:
- Services (Hizmetler)
- Portfolio (Projeler)
- Skills (Yetenekler)
- Testimonials (Yorumlar)
- Experience (Deneyim)
- Education (Eğitim)

### Renk Teması

Tailwind renkleri `globals.css` ve component'lerde özelleştirilebilir.

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Build

Production build için:
```bash
npm run build
npm start
```

## 📄 Lisans

Bu proje [ThemeJunction](https://themejunction.net/) tarafından tasarlanmıştır.#   p o r t f o i l o  
 #   p o r t f o i l o  
 #   p o r t f o l i o - c m s  
 