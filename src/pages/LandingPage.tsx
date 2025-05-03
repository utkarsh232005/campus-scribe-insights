import React from 'react';
import { Link } from 'react-router-dom';
import { School, ChevronRight, FileText, Users, BarChart } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';

const LandingPage = () => {
  // Words for the typewriter effect
  const words = [
    {
      text: "The Faculty Report",
      className: "text-5xl md:text-7xl font-bold text-white"
    },
    {
      text: "Framework",
      className: "text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Background Beams */}
      <BackgroundBeams className="opacity-80" />
      
      {/* Hero Section - Moved content down */}
      <div className="container mx-auto px-4 pt-32 pb-24 relative z-10 h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mt-20">
          {/* College Logo Placeholder - Moved further down */}
          <div className="mb-12 flex flex-col items-center">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 mb-6">
              <School className="h-14 w-14 text-white" />
            </div>
            <span className="text-2xl font-medium text-gray-200">Your College Name</span>
          </div>
          
          {/* Beta Banner */}
          <div className="inline-flex mb-8 bg-green-900/50 backdrop-blur-sm border border-green-700/50 rounded-full px-5 py-2">
            <span className="text-green-200 text-sm font-medium">Faculty Insights is now in beta <ChevronRight className="inline h-4 w-4" /></span>
          </div>
          
          {/* TypeWriter Effect for Main Heading */}
          <div className="mb-8">
            <TypewriterEffectSmooth words={words} />
          </div>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl">
            Our digital platform works across all devices, so you only have to set it up once
            and get beautiful results forever.
          </p>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mb-20">
            <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium text-lg flex items-center justify-center">
              Get Started <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="#docs" className="border border-gray-500 text-gray-300 hover:bg-white/10 px-8 py-3 rounded-full font-medium text-lg flex items-center justify-center">
              Read the docs <FileText className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          {/* Feature Icons */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-green-300" />
              </div>
              <h3 className="text-white font-medium mb-1">Digital Reporting</h3>
              <p className="text-gray-400 text-sm">Streamlined documentation</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <BarChart className="h-8 w-8 text-emerald-300" />
              </div>
              <h3 className="text-white font-medium mb-1">Advanced Analytics</h3>
              <p className="text-gray-400 text-sm">Insightful visualizations</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-teal-500/20 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-teal-300" />
              </div>
              <h3 className="text-white font-medium mb-1">Faculty Profiles</h3>
              <p className="text-gray-400 text-sm">Showcase achievements</p>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s infinite ease-in-out;
        }
        .animate-pulse {
          animation: pulse 8s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s steps(1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
