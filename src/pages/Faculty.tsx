
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';

interface Faculty {
  id: string;
  name: string;
  department: string;
  position: string;
  bio?: string;
  photo_url?: string;
  research_interests?: string[];
}

const DepartmentColors: Record<string, string> = {
  'computer_science': 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300',
  'mathematics': 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300',
  'physics': 'bg-gradient-to-br from-green-100 to-green-200 border-green-300',
  'electrical_engineering': 'bg-gradient-to-br from-red-100 to-red-200 border-red-300',
  'mechanical_engineering': 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300'
};

const FacultyPage = () => {
  const [facultyByDepartment, setFacultyByDepartment] = useState<Record<string, Faculty[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .order('name');

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
      }, {} as Record<string, Faculty[]>);

      setFacultyByDepartment(groupedFaculty);
      setLoading(false);
    };

    fetchFaculty();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-4xl font-bold text-white mb-8 animate-fade-in">Faculty Members</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="bg-gray-800 animate-pulse h-64"></Card>
            ))}
          </div>
        ) : (
          Object.entries(facultyByDepartment).map(([department, members]) => (
            <div key={department} className="mb-12 animate-fade-in">
              <h2 className="text-2xl font-semibold text-white capitalize mb-6 border-l-4 border-blue-500 pl-3">
                {department.replace(/_/g, ' ')} Department
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((faculty, index) => (
                  <div
                    key={faculty.id}
                    className="transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
                    style={{ 
                      animationDelay: `${index * 100}ms`, 
                      animation: 'fadeInUp 0.6s ease forwards',
                      opacity: 0
                    }}
                  >
                    <Card className={`${DepartmentColors[department]} border overflow-hidden shadow-lg`}>
                      <CardHeader className="flex flex-row items-center space-x-4 pb-2 bg-gradient-to-r from-black/5 to-transparent">
                        <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                          <AvatarImage src={faculty.photo_url} alt={faculty.name} />
                          <AvatarFallback className="bg-primary/20 text-primary-foreground text-xl">
                            {faculty.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{faculty.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{faculty.position}</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3 line-clamp-2">{faculty.bio || "No biography available."}</p>
                        {faculty.research_interests && (
                          <div className="mt-3">
                            <p className="font-semibold text-sm mb-2">Research Interests:</p>
                            <div className="flex flex-wrap gap-2">
                              {faculty.research_interests.map((interest) => (
                                <Badge 
                                  key={interest} 
                                  variant="outline" 
                                  className="bg-white/30 text-xs"
                                >
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      <style jsx global>{`
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
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default FacultyPage;
