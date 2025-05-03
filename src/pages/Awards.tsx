import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Award, ArrowRight, Calendar, Plus, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/context/NotificationContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
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

interface AwardFormData {
  title: string;
  department: string;
  recipient: string;
  year: number;
  description: string;
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AwardFormData>({
    title: '',
    department: '',
    recipient: '',
    year: new Date().getFullYear(),
    description: '',
    award_type: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  const departments = [
    'computer_science',
    'mathematics',
    'physics',
    'electrical_engineering',
    'mechanical_engineering'
  ];
  
  const awardTypes = [
    'Teaching Excellence',
    'Research Achievement',
    'Service Award',
    'Innovation',
    'Leadership',
    'Mentorship',
    'Lifetime Achievement'
  ];

  useEffect(() => {
    fetchAwards();
  }, []);
  
  const fetchAwards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('awards')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching awards:', error);
      toast({
        title: "Error",
        description: "Failed to load awards data",
        variant: "destructive"
      });
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value, 10) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddAward = async () => {
    // Validate form data
    if (!formData.title || !formData.department || !formData.recipient || !formData.award_type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('awards')
        .insert([{
          title: formData.title,
          department: formData.department,
          recipient: formData.recipient,
          year: formData.year,
          description: formData.description,
          award_type: formData.award_type
        }]);
        
      if (error) throw error;
      
      // Create notification
      await addNotification({
        message: `Admin added new award: "${formData.title}" for ${formData.recipient} in ${formData.department.replace('_', ' ')} department`,
        type: "success"
      });
      
      // Reset form and close dialog
      setFormData({
        title: '',
        department: '',
        recipient: '',
        year: new Date().getFullYear(),
        description: '',
        award_type: ''
      });
      
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Award added successfully!",
      });
      
      // Refresh awards list
      fetchAwards();
    } catch (error) {
      console.error('Error adding award:', error);
      toast({
        title: "Error",
        description: "Failed to add the award",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white flex items-center">
            <Award className="h-8 w-8 mr-3 text-yellow-400" />
            Departmental Awards & Recognitions
          </h1>
          
          {isAdmin && (
            <Button 
              className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2" 
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Award
            </Button>
          )}
        </div>

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
      
      {/* Add Award Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-400" />
              Add New Award
            </DialogTitle>
            <DialogDescription>
              Enter the details for the new award or recognition.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm text-gray-400">Title <span className="text-red-500">*</span></label>
              <Input
                id="title"
                name="title"
                placeholder="Award Title"
                value={formData.title}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="department" className="text-sm text-gray-400">Department <span className="text-red-500">*</span></label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange('department', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectGroup>
                    <SelectLabel>Departments</SelectLabel>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept} className="cursor-pointer">
                        {dept.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="recipient" className="text-sm text-gray-400">Recipient <span className="text-red-500">*</span></label>
              <Input
                id="recipient"
                name="recipient"
                placeholder="Award Recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="year" className="text-sm text-gray-400">Year <span className="text-red-500">*</span></label>
              <Input
                id="year"
                name="year"
                type="number"
                placeholder="Award Year"
                value={formData.year}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
                min={1900}
                max={2100}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="award_type" className="text-sm text-gray-400">Award Type <span className="text-red-500">*</span></label>
              <Select
                value={formData.award_type}
                onValueChange={(value) => handleSelectChange('award_type', value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select Award Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectGroup>
                    <SelectLabel>Type</SelectLabel>
                    {awardTypes.map((type) => (
                      <SelectItem key={type} value={type} className="cursor-pointer">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm text-gray-400">Description</label>
              <Textarea
                id="description"
                name="description"
                placeholder="Award Description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAddAward} className="bg-yellow-600 hover:bg-yellow-700" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Award
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <style>
        {`
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
        `}
      </style>
    </DashboardLayout>
  );
};

export default AwardsPage;
