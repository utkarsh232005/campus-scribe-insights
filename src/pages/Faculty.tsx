
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  'computer_science': 'bg-purple-100',
  'mathematics': 'bg-blue-100',
  'physics': 'bg-green-100',
  'electrical_engineering': 'bg-red-100',
  'mechanical_engineering': 'bg-yellow-100'
};

const Faculty = () => {
  const [facultyByDepartment, setFacultyByDepartment] = useState<Record<string, Faculty[]>>({});

  useEffect(() => {
    const fetchFaculty = async () => {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching faculty:', error);
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
    };

    fetchFaculty();
  }, []);

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Faculty Members</h1>
      {Object.entries(facultyByDepartment).map(([department, members]) => (
        <div key={department} className="mb-8">
          <h2 className="text-2xl font-semibold text-white capitalize mb-4">
            {department.replace('_', ' ')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((faculty) => (
              <div
                key={faculty.id}
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <Card className={`${DepartmentColors[department]} overflow-hidden`}>
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <Avatar className="h-16 w-16 border-2 border-white">
                      <AvatarImage src={faculty.photo_url} alt={faculty.name} />
                      <AvatarFallback>{faculty.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{faculty.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{faculty.position}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{faculty.bio}</p>
                    {faculty.research_interests && (
                      <div className="mt-2">
                        <p className="font-semibold text-sm mb-1">Research Interests:</p>
                        <div className="flex flex-wrap gap-2">
                          {faculty.research_interests.map((interest) => (
                            <span 
                              key={interest} 
                              className="bg-white/50 px-2 py-1 rounded-full text-xs"
                            >
                              {interest}
                            </span>
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
      ))}
    </div>
  );
};

export default Faculty;
