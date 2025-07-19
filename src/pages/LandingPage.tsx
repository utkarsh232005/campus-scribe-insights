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
      className: "text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 tracking-wider"
    },
    {
      text: "TO",
      className: "text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 tracking-wider"
    },
    {
      text: "CAMPUS",
      className: "text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 tracking-wider"
    },
    {
      text: "SCRIBE",
      className: "text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-slate-800 tracking-wider"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
      {/* Professional gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 opacity-80" />
      
      {/* Background Beams with professional colors */}
      <BackgroundBeams className="opacity-30" />
      
      {/* Professional animated elements */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 1.5,
              opacity: Math.random() * 0.3
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.3]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-slate-700 blur-xl rounded-full opacity-20" />
              <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-blue-600 to-slate-700 flex items-center justify-center shadow-professional">
                <School className="h-14 w-14 text-white" />
              </div>
            </div>
            <span className="mt-6 text-2xl font-medium text-slate-800 dark:text-slate-100 tracking-wide">Campus Scribe</span>
          </motion.div>
          
          {/* Beta badge */}
          <motion.div 
            className="inline-flex mb-8 bg-blue-50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700/30 rounded-full px-5 py-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">Now in Beta</span>
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
            className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl leading-relaxed"
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
              className="group bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-medium text-lg flex items-center justify-center transition-all duration-300 shadow-professional hover:shadow-lg"
            >
              Get Started 
              <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="#docs" 
              className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 px-8 py-3 rounded-xl font-medium text-lg flex items-center justify-center transition-all duration-300"
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
                gradient: "from-blue-600 to-blue-500"
              },
              {
                icon: BarChart,
                title: "Advanced Analytics",
                description: "Insightful visualizations", 
                gradient: "from-slate-600 to-slate-500"
              },
              {
                icon: Users,
                title: "Faculty Profiles",
                description: "Showcase achievements",
                gradient: "from-blue-600 to-slate-600"
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
                <div className="relative p-6 rounded-2xl bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-professional">
                  <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-slate-800 dark:text-slate-100 font-medium mb-1">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
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