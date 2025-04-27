
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, User, Paperclip, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface FacultyMember {
  id: string;
  name: string;
  department: string;
  position: string;
  bio?: string;
  research_interests?: string[];
  email?: string;
  photo_url?: string;
  publications?: number;
}

const DepartmentColors: Record<string, string> = {
  'computer_science': 'border-l-purple-500 bg-gradient-to-br from-purple-900/10 to-purple-700/5',
  'mathematics': 'border-l-blue-500 bg-gradient-to-br from-blue-900/10 to-blue-700/5',
  'physics': 'border-l-green-500 bg-gradient-to-br from-green-900/10 to-green-700/5',
  'electrical_engineering': 'border-l-red-500 bg-gradient-to-br from-red-900/10 to-red-700/5',
  'mechanical_engineering': 'border-l-yellow-500 bg-gradient-to-br from-yellow-900/10 to-yellow-700/5'
};

const FacultyPage = () => {
  const [facultyByDepartment, setFacultyByDepartment] = useState<Record<string, FacultyMember[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching faculty:', error);
        setLoading(false);
        return;
      }

      const groupedFaculty = data.reduce((acc, faculty) => {
        if (!acc[faculty.department]) {
          acc[faculty.department] = [];
        }
        acc[faculty.department].push(faculty);
        return acc;
      }, {} as Record<string, FacultyMember[]>);

      setFacultyByDepartment(groupedFaculty);
      setLoading(false);
    };

    fetchFaculty();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-4xl font-bold text-white mb-8 animate-fade-in flex items-center">
          <Users className="h-8 w-8 mr-3 text-blue-400" />
          Faculty Members
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="bg-gray-800 animate-pulse h-64"></Card>
            ))}
          </div>
        ) : (
          Object.entries(facultyByDepartment).map(([department, members]) => (
            <div key={department} className="mb-12 animate-fade-in">
              <h2 className="text-2xl font-semibold text-white capitalize mb-6 border-l-4 border-blue-400 pl-3">
                {department.replace(/_/g, ' ')} Department 
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((faculty, index) => (
                  <div
                    key={faculty.id}
                    className="transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                    style={{ 
                      animationDelay: `${index * 100}ms`, 
                      animation: 'slideIn 0.5s ease forwards',
                      opacity: 0
                    }}
                  >
                    <Card className={`border-l-4 ${DepartmentColors[department]} overflow-hidden shadow-lg backdrop-blur-sm`}>
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <Avatar className="h-16 w-16 border-2 border-white/10">
                          <AvatarImage src={faculty.photo_url} alt={faculty.name} />
                          <AvatarFallback className="bg-blue-800/50 text-blue-100">
                            {faculty.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{faculty.name}</CardTitle>
                          <p className="text-sm text-blue-300/80">{faculty.position}</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2 line-clamp-2 text-gray-300">
                          {faculty.bio || "No biography available."}
                        </p>
                        
                        {faculty.research_interests && faculty.research_interests.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold text-xs mb-1 text-gray-400">Research Interests:</p>
                            <div className="flex flex-wrap gap-1">
                              {faculty.research_interests.map(interest => (
                                <Badge key={interest} variant="outline" className="text-xs bg-blue-900/20">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t border-gray-800 pt-3 flex justify-between">
                        {faculty.publications !== undefined && (
                          <div className="flex items-center text-xs text-gray-400">
                            <BookOpen className="h-3 w-3 mr-1" />
                            <span>{faculty.publications} publications</span>
                          </div>
                        )}
                        {faculty.email && (
                          <div className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors">
                            <Paperclip className="h-3 w-3 mr-1" />
                            <a href={`mailto:${faculty.email}`}>Contact</a>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      <style>
        {`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        `}
      </style>
    </DashboardLayout>
  );
};

export default FacultyPage;
