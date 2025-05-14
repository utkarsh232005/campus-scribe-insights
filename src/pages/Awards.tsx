import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Award, ArrowRight, Calendar, Plus, Save, X, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
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

const DepartmentStyles: Record<string, { color: string; gradient: string; icon: string }> = {
  'computer_science': {
    color: 'text-blue-400',
    gradient: 'bg-gray-800 border border-blue-500/30 hover:border-blue-400/60',
    icon: '💻'
  },
  'mathematics': {
    color: 'text-emerald-400',
    gradient: 'bg-gray-800 border border-emerald-500/30 hover:border-emerald-400/60',
    icon: '📐'
  },
  'physics': {
    color: 'text-purple-400',
    gradient: 'bg-gray-800 border border-purple-500/30 hover:border-purple-400/60',
    icon: '⚛️'
  },
  'electrical_engineering': {
    color: 'text-yellow-400',
    gradient: 'bg-gray-800 border border-yellow-500/30 hover:border-yellow-400/60',
    icon: '⚡'
  },
  'mechanical_engineering': {
    color: 'text-red-400',
    gradient: 'bg-gray-800 border border-red-500/30 hover:border-red-400/60',
    icon: '⚙️'
  }
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
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">
              Faculty Awards
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              Celebrating excellence in academia
            </p>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Award
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-yellow-500 animate-spin"></div>
            </div>
          </div>
        ) : (
          Object.entries(awardsByDepartment).map(([department, awards]) => (
            <div key={department} className="mb-12 animate-fade-in">
              <h2 className="text-2xl font-semibold text-white capitalize mb-6 border-l-4 border-blue-500 pl-3">
                {department.replace(/_/g, ' ')} Department 
              </h2>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-semibold text-white">Featured Awards</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Best Research Paper",
                      department: "Computer Science",
                      recipient: "Dr. John Doe",
                      year: 2024,
                      award_type: "Academic Excellence",
                      description: "Groundbreaking research in AI and Machine Learning"
                    },
                    {
                      title: "Outstanding Teaching",
                      department: "Mathematics",
                      recipient: "Prof. Jane Smith",
                      year: 2024,
                      award_type: "Teaching Excellence",
                      description: "Exceptional dedication to student success"
                    },
                    {
                      title: "Innovation Award",
                      department: "Engineering",
                      recipient: "Team Innovate",
                      year: 2024,
                      award_type: "Innovation",
                      description: "Revolutionary sustainable energy solution"
                    }
                  ].map((award, index) => (
                    <Card 
                      key={index}
                      className={`overflow-hidden border shadow-lg bg-gray-800/50 backdrop-blur-sm rounded-xl transition-all duration-300 hover:shadow-xl ${DepartmentStyles[department].gradient}`}
                    >
                      <CardHeader className="bg-black/20 border-b border-gray-800/50">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                          <span className="text-2xl" role="img" aria-label={department}>{DepartmentStyles[department].icon}</span>
                          <span className={`capitalize font-bold ${DepartmentStyles[department].color}`}>
                            {department.replace('_', ' ')}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="h-5 w-5 text-white" />
                            <h3 className="text-lg font-medium text-white">{award.title}</h3>
                          </div>
                          <p className="text-sm text-gray-300">{award.recipient}</p>
                          <p className="text-sm mb-3 line-clamp-2 text-gray-400">
                            {award.description}
                          </p>
                          <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 border-gray-600/50 text-xs">
                            {award.award_type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {awards.map((award, index) => (
                  <div
                    key={award.id}
                    className={`p-6 rounded-xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm space-y-4 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 opacity-0 animate-in fade-in-0 slide-in-from-bottom-3`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <ScrollArea className="h-[300px] rounded-xl border border-amber-500/20 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-800/95 shadow-[0_0_30px_rgba(217,119,6,0.1)] group-hover:shadow-[0_0_40px_rgba(217,119,6,0.15)] backdrop-blur-xl p-6 transition-all duration-500">
                      <Card className={`overflow-hidden border shadow-lg bg-gray-800/50 backdrop-blur-sm rounded-xl transition-all duration-300 hover:shadow-xl ${DepartmentStyles[department].gradient}`}>
                        <CardHeader className="bg-black/20 border-b border-gray-800/50">
                          <CardTitle className="flex items-center gap-3 text-2xl">
                            <span className="text-2xl" role="img" aria-label={department}>{DepartmentStyles[department].icon}</span>
                            <span className={`capitalize font-bold ${DepartmentStyles[department].color}`}>
                              {department.replace('_', ' ')}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                          <div className="space-y-2">
                            <h3 className="text-lg font-bold text-white">
                              {award.title}
                            </h3>
                            <p className="text-sm text-gray-300">{award.recipient}</p>
                          </div>
                          <Badge
                            className="bg-gray-800 text-gray-300 border border-gray-700"
                            variant="outline"
                          >
                            {award.year}
                          </Badge>
                          <p className="text-sm mb-2 line-clamp-3 text-gray-400 mt-2">
                            {award.description || "No description available."}
                          </p>
                          <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 border-gray-600/50 text-xs">
                            {award.award_type}
                          </Badge>
                        </CardContent>
                      </Card>
                    </ScrollArea>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Add Award Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={cn(
          "relative bg-gray-800 border border-gray-700/50 rounded-xl overflow-hidden",
          "shadow-xl",
          "animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out"
        )}>

          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl font-bold gap-4">
              <div className={cn(
                "p-2 rounded-lg bg-blue-500/10 border border-blue-500/20",
                "transition-all duration-300"
              )}>
                <Plus className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-white">
                Add New Award
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6 px-1">
            <div className="relative grid gap-4 py-4 z-10">
              <div className="grid gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="title" className="text-white/70 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>Title</span>
                  </Label>
                  <div className="relative group">

                    <Input 
                      id="title" 
                      placeholder="Enter award title..." 
                      className={cn(
                        "relative bg-gray-700/50 border border-gray-600/50 focus:border-blue-500/50",
                        "text-white placeholder:text-gray-400",
                        "transition-all duration-200 px-4 py-3",
                        "hover:bg-gray-700/70 focus:bg-gray-700/70",
                        "rounded-lg"
                      )}
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="recipient" className="text-white/70 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Recipient</span>
                  </Label>
                  <div className="relative group">

                    <Input 
                      id="recipient" 
                      placeholder="Enter recipient name..." 
                      className={cn(
                        "relative bg-gray-900/90 border-white/10",
                        "focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50",
                        "text-white/90 placeholder:text-white/30",
                        "transition-all duration-300 px-4 py-6",
                        "hover:bg-gray-900/70 focus:bg-gray-900/70"
                      )}
                      value={formData.recipient}
                      onChange={handleInputChange}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="year" className="text-white/70 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Year</span>
                  </Label>
                  <div className="relative group">

                    <Input 
                      id="year" 
                      type="number" 
                      placeholder="Enter award year..." 
                      className={cn(
                        "relative bg-gray-900/90 border-white/10",
                        "focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/50",
                        "text-white/90 placeholder:text-white/30",
                        "transition-all duration-300 px-4 py-6",
                        "hover:bg-gray-900/70 focus:bg-gray-900/70"
                      )}
                      value={formData.year}
                      onChange={handleInputChange}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="description" className="text-white/70 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Description</span>
                  </Label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500"></div>
                    <Textarea 
                      id="description" 
                      placeholder="Enter award description..." 
                      className={cn(
                        "relative bg-gray-900/90 border-white/10",
                        "focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:border-gray-500/50",
                        "text-white/90 placeholder:text-white/30",
                        "transition-all duration-300 min-h-[120px] resize-none px-4 py-3",
                        "hover:bg-gray-900/70 focus:bg-gray-900/70"
                      )}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="grid gap-2"
                >
                  <Label htmlFor="type" className="text-white/70 flex items-center gap-2">
                    <Award className="w-4 h-4 text-pink-400" />
                    <span>Award Type</span>
                  </Label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gray-700/30 rounded-xl blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500"></div>
                    <Select
                      value={formData.award_type}
                      onValueChange={(value) => handleSelectChange('award_type', value)}
                    >
                      <SelectTrigger className="relative bg-gray-900/90 border-white/10 focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500/50 text-white/90 transition-all duration-300 px-4 py-6 hover:bg-gray-900/70">
                        <SelectValue placeholder="Select Award Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 border-gray-700/50 backdrop-blur-xl">
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
                </motion.div>
              </div>
            </div>
          </div>
          <DialogFooter className="relative z-10">
            <Button 
              type="submit" 
              className={cn(
                "relative group overflow-hidden gap-3 px-6 py-6",
                "bg-gray-800",
                "border border-gray-700 hover:border-gray-600",
                "text-white hover:text-white",
                "shadow-lg",
                "transition-all duration-300 rounded-xl"
              )}
              onClick={handleAddAward}
              disabled={submitting}
            >
              <div className="absolute inset-0 bg-gray-700/30 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative flex items-center gap-2">
                <div className={cn(
                  "p-2 rounded-lg bg-gray-700 border border-gray-600",
                  "transition-all duration-300"
                )}>
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-medium">Save Award</span>
              </div>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AwardsPage;
