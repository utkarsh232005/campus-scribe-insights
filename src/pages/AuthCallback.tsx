
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  useEffect(() => {
    const handleCallback = async () => {
      const department = searchParams.get('department');
      
      try {
        // Get the session after OAuth redirect
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session && department) {
          // Update user metadata with department information
          const { error: updateError } = await supabase.auth.updateUser({
            data: { 
              department: department 
            }
          });
          
          if (updateError) {
            console.error('Error updating user metadata:', updateError);
          }
          
          toast({
            title: "Google signup successful",
            description: "You've been signed in successfully!"
          });
          
          navigate('/dashboard');
        } else {
          toast({
            title: "Authentication error",
            description: "Unable to complete signup. Please try again.",
            variant: "destructive"
          });
          navigate('/signup');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication failed",
          description: error.message || "Please try again",
          variant: "destructive"
        });
        navigate('/signup');
      }
    };
    
    handleCallback();
  }, [navigate, searchParams, toast]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center items-center">
      <div className="text-white text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4">Completing your sign up...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
