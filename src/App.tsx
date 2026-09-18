/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ClientLogoCarousel } from './components/ClientLogoCarousel';
import { ComplianceTelemetry } from './components/ComplianceTelemetry';
import { Gallery } from './components/Gallery';
import { About } from './components/About';
import { Services } from './components/Services';
import { Approach } from './components/Approach';
import { SuccessStories } from './components/SuccessStories';
import { Blog } from './components/Blog';
import { BookShowcase } from './components/BookShowcase';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { AdminBackend } from './components/AdminBackend';
import { PhoneCall } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);
  const [consultationPreselected, setConsultationPreselected] = useState<string | undefined>(undefined);

  const handleOpenConsultation = (standardOrTopic?: string) => {
    setConsultationPreselected(standardOrTopic);
    setIsConsultationModalOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationModalOpen(false);
    setConsultationPreselected(undefined);
  };

  const handleNavigate = (href: string) => {
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Section Observer for active navigation highlighting
  useEffect(() => {
    const sectionIds = [
      'home',
      'telemetry',
      'gallery',
      'about',
      'services',
      'approach',
      'success-stories',
      'blog',
      'founder-book',
    ];
    
    const handleScrollObserver = () => {
      const scrollPosition = window.scrollY + 200;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollObserver);
    return () => window.removeEventListener('scroll', handleScrollObserver);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50 text-slate-900'} selection:bg-[#00A9CF] selection:text-slate-950 relative`}>
      {/* Top Fixed Header with Complete Desktop Menu */}
      <Navbar
        onOpenConsultation={() => handleOpenConsultation()}
        activeSection={activeSection}
      />

      {/* Main Page Layout */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onOpenConsultation={(std) => handleOpenConsultation(std)}
          onExploreSolutions={() => handleNavigate('#services')}
        />

        {/* 1.5. Client Logo Carousel */}
        <ClientLogoCarousel />

        {/* 2. Live Compliance Telemetry Cockpit */}
        <ComplianceTelemetry
          onOpenConsultation={(topic) => handleOpenConsultation(topic)}
        />

        {/* 3. Interactive Image and Video Gallery */}
        <Gallery
          onOpenConsultation={(topic) => handleOpenConsultation(topic)}
        />

        {/* 5. About Us Section (Who We Are, Mission, SoftExpert & PECB Partners) */}
        <About onOpenConsultation={(topic) => handleOpenConsultation(topic)} />

        {/* 6. Services & Solutions (Interactive Tabs: ISO, Sustainability ESG, GRC) */}
        <Services onOpenConsultation={(stdOrService) => handleOpenConsultation(stdOrService)} />

        {/* 7. Our Approach (Discover -> Digitally Transform -> Integrate -> Continuous Excellence) */}
        <Approach onOpenConsultation={(phase) => handleOpenConsultation(phase)} />

        {/* 8. Success Stories & Case Studies */}
        <SuccessStories onOpenConsultation={(clientType) => handleOpenConsultation(clientType)} />

        {/* 8.5. Thought Leadership & Industry Insights Blog Section */}
        <Blog onOpenConsultation={(topic) => handleOpenConsultation(topic)} />

        {/* 9. Founder Spotlight & Book Showcase ("QMS Book: Unlocking World Markets" by Julius N.) */}
        <BookShowcase onOpenConsultation={(topic) => handleOpenConsultation(topic)} />
      </main>

      {/* Footer */}
      <Footer
        onOpenConsultation={() => handleOpenConsultation()}
        onNavigate={handleNavigate}
      />

      {/* Interactive Consultation & ISO Audit Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={handleCloseConsultation}
        preselectedStandard={consultationPreselected}
      />

      {/* Admin Backend CMS Modal Portal */}
      <AdminBackend />

      {/* Floating Quick Action Button for Mobile / Small Screens */}
      <div className="fixed bottom-5 right-5 z-40 lg:hidden">
        <button
          id="floating-consultation-btn"
          onClick={() => handleOpenConsultation()}
          className="flex items-center gap-2 px-4 py-3 rounded-full text-xs font-extrabold text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] shadow-xl shadow-[#00A9CF]/30 active:scale-95 transition-all"
        >
          <PhoneCall className="w-4 h-4 text-slate-950" />
          <span>Talk to our expert</span>
        </button>
      </div>
    </div>
  );
}



