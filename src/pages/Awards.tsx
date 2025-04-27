
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Award, ArrowRight, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface AwardItem {
  id: string;
  title: string;
  department: string;
  recipient: string;
  year: number;
  description?: string;
  award_type: string;
}

const DepartmentColors: Record<string, string> = {
  'computer_science': 'border-l-purple-500 bg-gradient-to-br from-purple-900/10 to-purple-700/5',
  'mathematics': 'border-l-blue-500 bg-gradient-to-br from-blue-900/10 to-blue-700/5',
  'physics': 'border-l-green-500 bg-gradient-to-br from-green-900/10 to-green-700/5',
  'electrical_engineering': 'border-l-red-500 bg-gradient-to-br from-red-900/10 to-red-700/5',
  'mechanical_engineering': 'border-l-yellow-500 bg-gradient-to-br from-yellow-900/10 to-yellow-700/5'
};

const AwardsPage = () => {
  const [awardsByDepartment, setAwardsByDepartment] = useState<Record<string, AwardItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .order('year', { ascending: false });

      if (error) {
        console.error('Error fetching awards:', error);
        setLoading(false);
        return;
      }

      const groupedAwards = data.reduce((acc, award) => {
        if (!acc[award.department]) {
          acc[award.department] = [];
        }
        acc[award.department].push(award);
        return acc;
      }, {} as Record<string, AwardItem[]>);

      setAwardsByDepartment(groupedAwards);
      setLoading(false);
    };

    fetchAwards();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-4xl font-bold text-white mb-8 animate-fade-in flex items-center">
          <Award className="h-8 w-8 mr-3 text-yellow-400" />
          Departmental Awards & Recognitions
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="bg-gray-800 animate-pulse h-52"></Card>
            ))}
          </div>
        ) : (
          Object.entries(awardsByDepartment).map(([department, awards]) => (
            <div key={department} className="mb-12 animate-fade-in">
              <h2 className="text-2xl font-semibold text-white capitalize mb-6 border-l-4 border-yellow-400 pl-3">
                {department.replace(/_/g, ' ')} Department 
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {awards.map((award, index) => (
                  <div
                    key={award.id}
                    className="transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                    style={{ 
                      animationDelay: `${index * 100}ms`, 
                      animation: 'slideIn 0.5s ease forwards',
                      opacity: 0
                    }}
                  >
                    <Card className={`border-l-4 ${DepartmentColors[department]} overflow-hidden shadow-lg backdrop-blur-sm bg-opacity-20`}>
                      <CardHeader className="pb-2 space-y-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl mb-1">{award.title}</CardTitle>
                          <Badge variant="outline" className="bg-yellow-300/10 text-yellow-300 border-yellow-600/30">
                            <Calendar className="h-3 w-3 mr-1" /> {award.year}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-blue-300/80">
                          Recipient: {award.recipient}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2 line-clamp-2 text-gray-300">
                          {award.description || "No description available."}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between items-center">
                        <Badge variant="secondary" className="bg-transparent border text-xs">
                          {award.award_type}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400 opacity-60" />
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

export default AwardsPage;
