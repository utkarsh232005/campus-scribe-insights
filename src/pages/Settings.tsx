import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserCog, 
  Bell, 
  Eye, 
  Lock, 
  PieChart, 
  Palette, 
  Moon, 
  Sun, 
  Monitor, 
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  Trash2,
  User,
  Mail,
  Shield,
  Languages,
  Smartphone,
  GlobeIcon,
  Settings as SettingsIcon,
  Code,
  Lightbulb,
  Github,
  LifeBuoy,
  Info as InfoIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

// Define theme color schemes
const colorSchemes = [
  { id: 'blue', name: 'Blue', color: '#3b82f6', hoverColor: '#2563eb' },
  { id: 'purple', name: 'Purple', color: '#8b5cf6', hoverColor: '#7c3aed' },
  { id: 'emerald', name: 'Emerald', color: '#10b981', hoverColor: '#059669' },
  { id: 'amber', name: 'Amber', color: '#f59e0b', hoverColor: '#d97706' },
  { id: 'red', name: 'Red', color: '#ef4444', hoverColor: '#dc2626' },
  { id: 'pink', name: 'Pink', color: '#ec4899', hoverColor: '#db2777' },
  { id: 'indigo', name: 'Indigo', color: '#6366f1', hoverColor: '#4f46e5' },
  { id: 'teal', name: 'Teal', color: '#14b8a6', hoverColor: '#0d9488' },
  { id: 'cyan', name: 'Cyan', color: '#06b6d4', hoverColor: '#0891b2' },
];

// Define interface styles
const interfaceStyles = [
  { id: 'default', name: 'Default' },
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'minimal', name: 'Minimal' },
];

// Define languages
const languages = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'es', name: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', name: 'French', flag: '🇫🇷' },
  { id: 'de', name: 'German', flag: '🇩🇪' },
  { id: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { id: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { id: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { id: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { id: 'ja', name: 'Japanese', flag: '🇯🇵' },
];

// Define the profile structure based on your Supabase table
interface Profile {
  id: string;
  created_at: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  department?: string;
  title?: string;
  avatar_url?: string;
  phone?: string;
  role?: string;
}

interface SettingsState {
  personal: {
    email: string;
    firstName: string;
    lastName: string;
    language: string;
    avatar: string;
    title: string;
    department: string;
    phone: string;
  };
  notifications: {
    emailNotifications: boolean;
    reportUpdates: boolean;
    systemUpdates: boolean;
    activitySummary: boolean;
    newPublications: boolean;
    mentionAlerts: boolean;
    commentReplies: boolean;
    desktopNotifications: boolean;
    upcomingEvents: boolean;
  };
  appearance: {
    theme: 'dark' | 'light' | 'system';
    colorScheme: string;
    fontSize: number;
    compactMode: boolean;
    animationsEnabled: boolean;
    interfaceStyle: string;
    reduceMotion: boolean;
    borderRadius: number;
    accentColor: string;
  };
  privacy: {
    shareAnalytics: boolean;
    dataBackupFrequency: string;
    autoDeleteOldReports: boolean;
    twoFactorAuth: boolean;
    publicProfile: boolean;
    showOnlineStatus: boolean;
    showReadReceipts: boolean;
    allowDataCollection: boolean;
  };
  account: {
    accountType: string;
    timeZone: string;
    dateFormat: string;
    timeFormat: string;
    profileVisibility: string;
  };
}

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings state with more comprehensive options
  const [settings, setSettings] = useState<SettingsState>({
    personal: {
      email: user?.email || '',
      firstName: '',
      lastName: '',
      language: 'en',
      avatar: '',
      title: 'Faculty Member',
      department: 'Computer Science',
      phone: '',
    },
    notifications: {
      emailNotifications: true,
      reportUpdates: true,
      systemUpdates: true,
      activitySummary: false,
      newPublications: true,
      mentionAlerts: true,
      commentReplies: true,
      desktopNotifications: false,
      upcomingEvents: true,
    },
    appearance: {
      theme: 'dark',
      colorScheme: 'blue',
      fontSize: 16,
      compactMode: false,
      animationsEnabled: true,
      interfaceStyle: 'default',
      reduceMotion: false,
      borderRadius: 8,
      accentColor: '#3b82f6',
    },
    privacy: {
      shareAnalytics: true,
      dataBackupFrequency: 'weekly',
      autoDeleteOldReports: false,
      twoFactorAuth: false,
      publicProfile: true,
      showOnlineStatus: true,
      showReadReceipts: true,
      allowDataCollection: true,
    },
    account: {
      accountType: 'faculty',
      timeZone: 'UTC+05:30',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      profileVisibility: 'public',
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  
  // Effect to fetch user settings from backend
  useEffect(() => {
    // Simulate fetching user settings
    const timeout = setTimeout(() => {
      // In a real app, you'd fetch from your backend
      console.log('Fetched user settings');
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [user]);
  
  // Generic update function for any settings category
  const updateSettings = <T extends keyof SettingsState>(category: T, key: keyof SettingsState[T], value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };
  
  // Fetch user profile data from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch user profile using user.id rather than appending it to query parameter
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        // Cast data to our Profile interface
        const profileData = data as Profile;
        
        if (error) {
          console.error('Error fetching user profile:', error);
          toast({
            title: "Error loading profile",
            description: "Could not load your profile data.",
            variant: "destructive",
          });
        } else if (profileData) {
          // Update settings state with data from profile
          setSettings(prev => ({
            ...prev,
            personal: {
              ...prev.personal,
              email: user.email || '',
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              department: profileData.department || 'Computer Science',
              title: profileData.title || 'Faculty Member',
              avatar: profileData.avatar_url || '',
              phone: profileData.phone || '',
            }
          }));
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Save actual data to Supabase profiles table
      if (user?.id) {
        // Create profile update object with proper types
        const profileUpdate: Partial<Profile> = {
          first_name: settings.personal.firstName,
          last_name: settings.personal.lastName,
          department: settings.personal.department,
          title: settings.personal.title,
          phone: settings.personal.phone,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', user.id);
          
        if (error) {
          throw error;
        }
      }
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "An error occurred while saving your preferences.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-50 flex items-center">
              <SettingsIcon className="h-6 w-6 mr-2 text-blue-500" />
              Settings
            </h1>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span className="text-gray-300">Settings</span>
            </div>
          </div>
          <Button 
            onClick={saveSettings} 
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-900/20"
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
        
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-xl">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col md:flex-row w-full">
                <div className="w-full md:w-56 border-r border-gray-800 p-4 bg-gray-900/70">
                  <TabsList className="flex flex-row md:flex-col w-full h-auto bg-transparent space-y-0 md:space-y-1 p-0">
                    <TabsTrigger 
                      value="account" 
                      className="w-full justify-start px-3 py-2 data-[state=active]:bg-gray-800 data-[state=active]:text-zinc-50 hover:bg-gray-800/50 transition-colors rounded-md"
                    >
                      <User className="h-4 w-4 mr-2" /> 
                      <span>Account</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="appearance" 
                      className="w-full justify-start px-3 py-2 data-[state=active]:bg-gray-800 data-[state=active]:text-zinc-50 hover:bg-gray-800/50 transition-colors rounded-md"
                    >
                      <Palette className="h-4 w-4 mr-2" /> 
                      <span>Appearance</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="w-full justify-start px-3 py-2 data-[state=active]:bg-gray-800 data-[state=active]:text-zinc-50 hover:bg-gray-800/50 transition-colors rounded-md"
                    >
                      <Bell className="h-4 w-4 mr-2" /> 
                      <span>Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="privacy" 
                      className="w-full justify-start px-3 py-2 data-[state=active]:bg-gray-800 data-[state=active]:text-zinc-50 hover:bg-gray-800/50 transition-colors rounded-md"
                    >
                      <Shield className="h-4 w-4 mr-2" /> 
                      <span>Privacy & Security</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 p-6">
                  {/* Account Section */}
                  <TabsContent value="account" className="mt-0 space-y-6">
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center mb-6">
                          <UserCog className="h-5 w-5 mr-2 text-blue-500" />
                          <h3 className="text-xl font-medium text-zinc-50">Account Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="md:col-span-2 space-y-6">
                            <div className="grid gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="email" className="text-base font-medium text-gray-300">Email Address</Label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Your email address"
                                    value={settings.personal.email}
                                    onChange={(e) => updateSettings('personal', 'email', e.target.value)}
                                    className="pl-10 bg-gray-800 border-gray-700 text-gray-300 disabled:opacity-100 disabled:cursor-not-allowed"
                                    disabled
                                  />
                                </div>
                                <p className="text-xs text-gray-400">Your email is used for login and notifications</p>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="firstName" className="text-base font-medium text-gray-300">First Name</Label>
                                  <Input
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Your first name"
                                    value={settings.personal.firstName}
                                    onChange={(e) => updateSettings('personal', 'firstName', e.target.value)}
                                    className="bg-gray-800 border-gray-700"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="lastName" className="text-base font-medium text-gray-300">Last Name</Label>
                                  <Input
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Your last name"
                                    value={settings.personal.lastName}
                                    onChange={(e) => updateSettings('personal', 'lastName', e.target.value)}
                                    className="bg-gray-800 border-gray-700"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <Label className="text-base font-medium text-gray-300">Profile Picture</Label>
                            <div className="flex flex-col items-center justify-center p-6 border border-gray-800 bg-gray-900/50 rounded-lg">
                              <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={settings.personal.avatar || '/placeholder.svg'} alt="Profile" />
                                <AvatarFallback>
                                  {settings.personal.firstName && settings.personal.lastName
                                    ? `${settings.personal.firstName[0]}${settings.personal.lastName[0]}`
                                    : 'US'}
                                </AvatarFallback>
                              </Avatar>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                              >
                                <Upload className="h-4 w-4 mr-2" /> Upload Photo
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Appearance Section */}
                  <TabsContent value="appearance" className="mt-0 space-y-6">
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center mb-6">
                          <Palette className="h-5 w-5 mr-2 text-purple-500" />
                          <h3 className="text-xl font-medium text-zinc-50">Appearance Settings</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-base font-medium text-gray-300">Theme Mode</Label>
                            <div className="grid grid-cols-3 gap-4">
                              <div
                                className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all ${settings.appearance.theme === 'dark' ? 'bg-gray-800 border-blue-500' : 'bg-gray-900 border-gray-800 hover:bg-gray-800'}`}
                                onClick={() => updateSettings('appearance', 'theme', 'dark')}
                              >
                                <Moon className="h-6 w-6 mb-2 text-blue-500" />
                                <span className="text-sm font-medium text-gray-300">Dark</span>
                              </div>
                              <div
                                className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all ${settings.appearance.theme === 'light' ? 'bg-gray-800 border-blue-500' : 'bg-gray-900 border-gray-800 hover:bg-gray-800'}`}
                                onClick={() => updateSettings('appearance', 'theme', 'light')}
                              >
                                <Sun className="h-6 w-6 mb-2 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-300">Light</span>
                              </div>
                              <div
                                className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all ${settings.appearance.theme === 'system' ? 'bg-gray-800 border-blue-500' : 'bg-gray-900 border-gray-800 hover:bg-gray-800'}`}
                                onClick={() => updateSettings('appearance', 'theme', 'system')}
                              >
                                <Monitor className="h-6 w-6 mb-2 text-gray-400" />
                                <span className="text-sm font-medium text-gray-300">System</span>
                              </div>
                            </div>
                          </div>
                          
                          <Separator className="my-6 bg-gray-800" />
                          
                          <div className="space-y-4">
                            <Label className="text-base font-medium text-gray-300">Color Scheme</Label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                              {colorSchemes.map(scheme => (
                                <div
                                  key={scheme.id}
                                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col items-center ${settings.appearance.colorScheme === scheme.id ? 'border-blue-500 bg-gray-800' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'}`}
                                  onClick={() => updateSettings('appearance', 'colorScheme', scheme.id)}
                                >
                                  <div 
                                    className="w-8 h-8 rounded-full mb-2" 
                                    style={{ backgroundColor: scheme.color }}
                                  ></div>
                                  <span className="text-sm text-gray-300">{scheme.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Notifications Section */}
                  <TabsContent value="notifications" className="mt-0 space-y-6">
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center mb-6">
                          <Bell className="h-5 w-5 mr-2 text-amber-500" />
                          <h3 className="text-xl font-medium text-zinc-50">Notification Preferences</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="grid gap-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-base font-medium text-gray-300">Email Notifications</Label>
                                <p className="text-sm text-gray-500">Receive emails for important updates</p>
                              </div>
                              <Switch
                                checked={settings.notifications.emailNotifications}
                                onCheckedChange={(checked) => updateSettings('notifications', 'emailNotifications', checked)}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                            
                            <Separator className="bg-gray-800" />
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-base font-medium text-gray-300">Report Updates</Label>
                                <p className="text-sm text-gray-500">Get notified when reports are updated</p>
                              </div>
                              <Switch
                                checked={settings.notifications.reportUpdates}
                                onCheckedChange={(checked) => updateSettings('notifications', 'reportUpdates', checked)}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                            
                            <Separator className="bg-gray-800" />
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-base font-medium text-gray-300">New Publications</Label>
                                <p className="text-sm text-gray-500">Get notified about new faculty publications</p>
                              </div>
                              <Switch
                                checked={settings.notifications.newPublications}
                                onCheckedChange={(checked) => updateSettings('notifications', 'newPublications', checked)}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Privacy Section */}
                  <TabsContent value="privacy" className="mt-0 space-y-6">
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center mb-6">
                          <Shield className="h-5 w-5 mr-2 text-green-500" />
                          <h3 className="text-xl font-medium text-zinc-50">Privacy & Security</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="grid gap-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-base font-medium text-gray-300">Two-Factor Authentication</Label>
                                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                              </div>
                              <Switch
                                checked={settings.privacy.twoFactorAuth}
                                onCheckedChange={(checked) => updateSettings('privacy', 'twoFactorAuth', checked)}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                            
                            <Separator className="bg-gray-800" />
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-base font-medium text-gray-300">Public Profile</Label>
                                <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                              </div>
                              <Switch
                                checked={settings.privacy.publicProfile}
                                onCheckedChange={(checked) => updateSettings('privacy', 'publicProfile', checked)}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                            
                            <Separator className="bg-gray-800" />
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-base font-medium text-gray-300">Share Analytics</Label>
                                <p className="text-sm text-gray-500">Help improve the platform with anonymous usage data</p>
                              </div>
                              <Switch
                                checked={settings.privacy.shareAnalytics}
                                onCheckedChange={(checked) => updateSettings('privacy', 'shareAnalytics', checked)}
                                className="data-[state=checked]:bg-blue-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Settings;