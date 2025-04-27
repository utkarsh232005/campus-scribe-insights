
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  'computer_science': 'bg-purple-100',
  'mathematics': 'bg-blue-100',
  'physics': 'bg-green-100',
  'electrical_engineering': 'bg-red-100',
  'mechanical_engineering': 'bg-yellow-100'
};

const Awards = () => {
  const [awardsByDepartment, setAwardsByDepartment] = useState<Record<string, AwardItem[]>>({});

  useEffect(() => {
    const fetchAwards = async () => {
      const { data, error } = await supabase
        .from('awards')
        .select('*')
        .order('year', { ascending: false });

      if (error) {
        console.error('Error fetching awards:', error);
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
    };

    fetchAwards();
  }, []);

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Department Awards</h1>
      {Object.entries(awardsByDepartment).map(([department, awards]) => (
        <div key={department} className="mb-8">
          <h2 className="text-2xl font-semibold text-white capitalize mb-4">
            {department.replace('_', ' ')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award) => (
              <div
                key={award.id}
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <Card className={`${DepartmentColors[department]} overflow-hidden`}>
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <Award className="h-12 w-12 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{award.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{award.year}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-semibold mb-1">Recipient: {award.recipient}</p>
                    <p className="text-sm mb-2">{award.description}</p>
                    <span className="bg-white/50 px-2 py-1 rounded-full text-xs">
                      {award.award_type}
                    </span>
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

export default Awards;
