
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Book, Calendar, ChevronDown, Users, BarChart, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/40 z-0"></div>
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="animate-fadeInDown">
            <School className="mx-auto h-20 w-20 text-blue-400 mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold mb-4">Faculty Portal</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Empowering academic excellence through collaborative research and innovative teaching
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fadeInUp">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/login">Faculty Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-blue-500 text-blue-400 hover:bg-blue-950">
              <Link to="/reports">View Reports</Link>
            </Button>
          </div>
          
          <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
            <ChevronDown className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center animate-fadeIn">Platform Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Faculty Profiles", 
                description: "Complete profiles of all faculty members with their research interests and publications.", 
                icon: Users,
                link: "/faculty" 
              },
              { 
                title: "Department Reports", 
                description: "Access and submit reports for various departmental activities and research initiatives.", 
                icon: BarChart,
                link: "/reports" 
              },
              { 
                title: "Academic Calendar", 
                description: "Stay updated with important dates, events and academic schedules.", 
                icon: Calendar,
                link: "/calendar" 
              },
              { 
                title: "Research Publications", 
                description: "Browse through faculty research publications and ongoing projects.", 
                icon: Book,
                link: "/reports" 
              },
              { 
                title: "Award Recognition", 
                description: "Showcase of faculty and departmental awards and achievements.", 
                icon: Award,
                link: "/awards" 
              },
              { 
                title: "Departments", 
                description: "Explore the various academic departments and their specializations.", 
                icon: School,
                link: "/departments" 
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:bg-gray-800/80 hover:-translate-y-1 group animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <Link to={feature.link} className="inline-flex items-center text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 animate-fadeIn">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-8 animate-fadeIn">
            Login to access all the features and tools available for faculty members
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 animate-fadeIn">
            <Link to="/login">Login to Dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <School className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-xl font-bold">Faculty Portal</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Faculty Portal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 1s ease-in-out forwards;
        }
        
        .animate-fadeInDown {
          opacity: 0;
          animation: fadeInDown 1s ease-in-out forwards;
        }
        
        .animate-fadeInUp {
          opacity: 0;
          animation: fadeInUp 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
