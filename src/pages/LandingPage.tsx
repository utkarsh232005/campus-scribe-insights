import React from 'react';
import { Link } from 'react-router-dom';
import { School, ChevronRight, FileText, Users, BarChart, Sparkles } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { motion } from 'framer-motion';

const LandingPage = () => {
  // Words for the typewriter effect
  const words = [
    {
      text: "WELCOME",
      className: "text-4xl md:text-6xl font-bold text-[#F5F5F5] tracking-wider"
    },
    {
      text: "TO",
      className: "text-4xl md:text-6xl font-bold text-[#F5F5F5] tracking-wider"
    },
    {
      text: "CAMPUS",
      className: "text-4xl md:text-6xl font-bold text-[#F5F5F5] tracking-wider"
    },
    {
      text: "SCRIBE",
      className: "text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C9A7] to-[#8E44AD] tracking-wider"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#111111] to-[#191919] opacity-80" />
      
      {/* Background Beams with custom colors */}
      <BackgroundBeams className="opacity-40" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#00C9A7]"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 2,
              opacity: Math.random() * 0.5
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.5]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 pt-32 pb-24 relative z-10 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Logo and branding */}
          <motion.div 
            className="mb-12 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C9A7] to-[#8E44AD] blur-xl rounded-full opacity-50" />
              <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-[#00C9A7] to-[#8E44AD] flex items-center justify-center shadow-lg shadow-[#00C9A7]/20">
                <School className="h-14 w-14 text-white" />
              </div>
            </div>
            <span className="mt-6 text-2xl font-medium text-[#F5F5F5] tracking-wide">Campus Scribe</span>
          </motion.div>
          
          {/* Beta badge */}
          <motion.div 
            className="inline-flex mb-8 bg-[#00C9A7]/10 backdrop-blur-sm border border-[#00C9A7]/20 rounded-full px-5 py-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Sparkles className="h-4 w-4 text-[#00C9A7] mr-2" />
            <span className="text-[#00C9A7] text-sm font-medium">Now in Beta</span>
          </motion.div>
          
          {/* Typewriter heading */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <TypewriterEffectSmooth words={words} />
          </motion.div>
          
          {/* Description */}
          <motion.p 
            className="text-xl text-[#F5F5F5]/80 mb-10 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Experience the future of academic reporting with our intuitive platform.
            Streamline your workflow and unlock powerful insights.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Link 
              to="/login" 
              className="group bg-gradient-to-r from-[#00C9A7] to-[#8E44AD] text-white px-8 py-3 rounded-xl font-medium text-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-[#00C9A7]/20"
            >
              Get Started 
              <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="#docs" 
              className="border border-[#F5F5F5]/20 text-[#F5F5F5] hover:bg-[#F5F5F5]/5 px-8 py-3 rounded-xl font-medium text-lg flex items-center justify-center transition-all duration-300"
            >
              Read the docs 
              <FileText className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
          
          {/* Feature cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            {[
              {
                icon: FileText,
                title: "Digital Reporting",
                description: "Streamlined documentation",
                gradient: "from-[#00C9A7] to-[#00C9A7]/50"
              },
              {
                icon: BarChart,
                title: "Advanced Analytics",
                description: "Insightful visualizations",
                gradient: "from-[#8E44AD] to-[#8E44AD]/50"
              },
              {
                icon: Users,
                title: "Faculty Profiles",
                description: "Showcase achievements",
                gradient: "from-[#00C9A7] to-[#8E44AD]"
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" />
                <div className="relative p-6 rounded-2xl bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#F5F5F5]/10 hover:border-[#00C9A7]/20 transition-all duration-300">
                  <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-[#F5F5F5] font-medium mb-1">{feature.title}</h3>
                  <p className="text-[#F5F5F5]/60 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;