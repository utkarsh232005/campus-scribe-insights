import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, User, Paperclip, BookOpen, Plus, Save, X, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GlowingEffect } from '@/components/ui/glowing-effect';

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
interface FacultyFormData {
  name: string;
  department: string;
  position: string;
  bio: string;
  email: string;
  research_interests: string;
  publications: number;
  photo_url: string;
}
const DepartmentColors: Record<string, string> = {
  'computer_science': 'border-l-purple-500 bg-gradient-to-br from-purple-900/10 to-purple-700/5',
  'mathematics': 'border-l-blue-500 bg-gradient-to-br from-blue-900/10 to-blue-700/5',
  'physics': 'border-l-green-500 bg-gradient-to-br from-green-900/10 to-green-700/5',
  'electrical_engineering': 'border-l-red-500 bg-gradient-to-br from-red-900/10 to-red-700/5',
  'mechanical_engineering': 'border-l-yellow-500 bg-gradient-to-br from-yellow-900/10 to-yellow-700/5'
};
const defaultAvatar = "/placeholder.svg";
const FacultyPage = () => {
  const [facultyByDepartment, setFacultyByDepartment] = useState<Record<string, FacultyMember[]>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FacultyFormData>({
    name: '',
    department: '',
    position: '',
    bio: '',
    email: '',
    research_interests: '',
    publications: 0,
    photo_url: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const {
    isAdmin
  } = useAuth();
  const {
    toast
  } = useToast();
  const departments = ['computer_science', 'mathematics', 'physics', 'electrical_engineering', 'mechanical_engineering'];
  const positions = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Adjunct Professor', 'Department Chair', 'Research Fellow', 'Dean', 'Emeritus Professor'];
  useEffect(() => {
    fetchFaculty();
  }, []);
  const fetchFaculty = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.from('faculty').select('*').order('name', {
      ascending: true
    });
    if (error) {
      console.error('Error fetching faculty:', error);
      toast({
        title: "Error",
        description: "Failed to load faculty data",
        variant: "destructive"
      });
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publications' ? parseInt(value, 10) || 0 : value
    }));
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const uploadPhoto = async (): Promise<string> => {
    if (!photoFile) return '';
    setUploadingPhoto(true);
    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `faculty-${Date.now()}.${fileExt}`;
      const filePath = `faculty-photos/${fileName}`;

      // Upload to Supabase Storage
      const {
        error: uploadError
      } = await supabase.storage.from('faculty-photos').upload(filePath, photoFile);
      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data
      } = supabase.storage.from('faculty-photos').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload Failed",
        description: "Could not upload the faculty photo",
        variant: "destructive"
      });
      return '';
    } finally {
      setUploadingPhoto(false);
    }
  };
  const handleAddFaculty = async () => {
    // Validate form data
    if (!formData.name || !formData.department || !formData.position) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setSubmitting(true);
    try {
      // Upload photo if selected
      let photoUrl = formData.photo_url;
      if (photoFile) {
        photoUrl = await uploadPhoto();
      }

      // Convert research interests from comma separated to array
      const researchInterests = formData.research_interests.split(',').map(item => item.trim()).filter(Boolean);
      const {
        data,
        error
      } = await supabase.from('faculty').insert([{
        name: formData.name,
        department: formData.department,
        position: formData.position,
        bio: formData.bio,
        email: formData.email || null,
        research_interests: researchInterests.length > 0 ? researchInterests : null,
        publications: formData.publications || 0,
        photo_url: photoUrl || null
      }]);
      if (error) throw error;

      // Reset form and close dialog
      setFormData({
        name: '',
        department: '',
        position: '',
        bio: '',
        email: '',
        research_interests: '',
        publications: 0,
        photo_url: ''
      });
      setPhotoFile(null);
      setPhotoPreview('');
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Faculty member added successfully!"
      });

      // Refresh faculty list
      fetchFaculty();
    } catch (error) {
      console.error('Error adding faculty member:', error);
      toast({
        title: "Error",
        description: "Failed to add the faculty member",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  return <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-400" />
            Faculty Members
          </h1>
          
          {isAdmin && <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Faculty
            </Button>}
        </div>

        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Card key={i} className="bg-gray-800 animate-pulse h-64"></Card>)}
          </div> : Object.entries(facultyByDepartment).map(([department, members]) => <div key={department} className="mb-12 animate-fade-in">
              <h2 className="text-2xl font-semibold text-white capitalize mb-6 border-l-4 border-blue-400 pl-3">
                {department.replace(/_/g, ' ')} Department 
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-900">
                {members.map((faculty, index) => <div key={faculty.id} className="transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl" style={{
            animationDelay: `${index * 100}ms`,
            animation: 'slideIn 0.5s ease forwards',
            opacity: 0
          }}>
                    <div className="relative">
                      <Card className={`border-l-4 ${DepartmentColors[department]} overflow-hidden shadow-lg backdrop-blur-sm`}>
                        <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-gray-900">
                          <Avatar className="h-16 w-16 border-2 border-white/10">
                            <AvatarImage src={faculty.photo_url || defaultAvatar} alt={faculty.name} />
                            <AvatarFallback className="bg-blue-800/50 text-blue-100">
                              {faculty.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl text-gray-50">{faculty.name}</CardTitle>
                            <p className="text-sm text-blue-300/80">{faculty.position}</p>
                          </div>
                        </CardHeader>
                        <CardContent className="bg-gray-900">
                          <p className="mb-2 line-clamp-2 text-sm text-gray-50">
                            {faculty.bio || "No biography available."}
                          </p>
                          
                          {faculty.research_interests && faculty.research_interests.length > 0 && <div className="mt-2">
                              <p className="font-semibold text-xs mb-1 text-gray-400">Research Interests:</p>
                              <div className="flex flex-wrap gap-1 bg-gray-900">
                                {faculty.research_interests.map(interest => <Badge key={interest} variant="outline" className="text-xs bg-gray-50">
                                    {interest}
                                  </Badge>)}
                              </div>
                            </div>}
                        </CardContent>
                        <CardFooter className="border-t border-gray-800 pt-3 flex justify-between bg-gray-900">
                          {faculty.publications !== undefined && <div className="flex items-center text-xs text-gray-400">
                              <BookOpen className="h-3 w-3 mr-1" />
                              <span className="text-cyan-300">{faculty.publications} publications</span>
                            </div>}
                          {faculty.email && <div className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors">
                              <Paperclip className="h-3 w-3 mr-1" />
                              <a href={`mailto:${faculty.email}`}>Contact</a>
                            </div>}
                        </CardFooter>
                      </Card>
                      <GlowingEffect 
                        disabled={false}
                        spread={30} 
                        glow={true} 
                        blur={8}
                        variant={department === "computer_science" ? "default" : "white"}
                        className="absolute inset-0 rounded-lg"
                      />
                    </div>
                  </div>)}
              </div>
            </div>)}
      </div>
      
      {/* Add Faculty Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-400" />
              Add New Faculty Member
            </DialogTitle>
            <DialogDescription>
              Enter the details for the new faculty member.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-white/10">
                  <AvatarImage src={photoPreview || defaultAvatar} alt="Faculty photo" />
                  <AvatarFallback className="bg-blue-800/50 text-blue-100 text-xl">
                    {formData.name ? formData.name.charAt(0) : "F"}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-1 cursor-pointer">
                  <Upload className="h-4 w-4 text-white" />
                  <input id="photo-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
                </label>
              </div>
              <span className="text-xs text-gray-400 mt-1">Upload photo (optional)</span>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm text-gray-400">Name <span className="text-red-500">*</span></label>
                <Input id="name" name="name" placeholder="Faculty Member Name" value={formData.name} onChange={handleInputChange} className="bg-gray-800 border-gray-700" />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="department" className="text-sm text-gray-400">Department <span className="text-red-500">*</span></label>
                <Select value={formData.department} onValueChange={value => handleSelectChange('department', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectGroup>
                      <SelectLabel>Departments</SelectLabel>
                      {departments.map(dept => <SelectItem key={dept} value={dept} className="cursor-pointer">
                          {dept.replace(/_/g, ' ')}
                        </SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="position" className="text-sm text-gray-400">Position <span className="text-red-500">*</span></label>
                <Select value={formData.position} onValueChange={value => handleSelectChange('position', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectGroup>
                      <SelectLabel>Academic Positions</SelectLabel>
                      {positions.map(pos => <SelectItem key={pos} value={pos} className="cursor-pointer">
                          {pos}
                        </SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm text-gray-400">Email</label>
                <Input id="email" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="bg-gray-800 border-gray-700" />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="publications" className="text-sm text-gray-400">Publications Count</label>
                <Input id="publications" name="publications" type="number" placeholder="Number of Publications" value={formData.publications || ''} onChange={handleInputChange} className="bg-gray-800 border-gray-700" min={0} />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="research_interests" className="text-sm text-gray-400">Research Interests</label>
                <Input id="research_interests" name="research_interests" placeholder="Comma separated interests, e.g. AI, Machine Learning" value={formData.research_interests} onChange={handleInputChange} className="bg-gray-800 border-gray-700" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm text-gray-400">Biography</label>
              <Textarea id="bio" name="bio" placeholder="Faculty Member Biography" value={formData.bio} onChange={handleInputChange} className="bg-gray-800 border-gray-700" rows={3} />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAddFaculty} className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
              {submitting ? <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </> : <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Faculty
                </>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
    </DashboardLayout>;
};
export default FacultyPage;
