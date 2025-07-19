import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Calendar, Edit, Trash2, Send, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Draft {
  id: string;
  title: string;
  department: string;
  academic_year: string;
  publication_count: number;
  conference_count: number;
  project_count: number;
  funding_amount: number;
  achievements?: string;
  created_at: string;
  updated_at: string;
}

interface DraftManagerProps {
  onBack: () => void;
  onEditDraft: (draft: Draft) => void;
}

const DraftManager = ({ onBack, onEditDraft }: DraftManagerProps) => {
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('report_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      toast({
        title: "Error",
        description: "Failed to load drafts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('report_drafts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDrafts(drafts.filter(draft => draft.id !== id));
      toast({
        title: "Success",
        description: "Draft deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: "Error",
        description: "Failed to delete draft",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const submitDraft = async (draft: Draft) => {
    try {
      setSubmittingId(draft.id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Submit the draft as a report
      const { error: reportError } = await supabase
        .from('reports')
        .insert({
          title: draft.title,
          department: draft.department,
          academic_year: draft.academic_year,
          publication_count: draft.publication_count,
          conference_count: draft.conference_count,
          project_count: draft.project_count,
          funding_amount: draft.funding_amount,
          achievements: draft.achievements,
          user_id: user.id,
          status: 'pending'
        });

      if (reportError) throw reportError;

      // Delete the draft after successful submission
      const { error: deleteError } = await supabase
        .from('report_drafts')
        .delete()
        .eq('id', draft.id);

      if (deleteError) throw deleteError;

      setDrafts(drafts.filter(d => d.id !== draft.id));
      
      toast({
        title: "Success",
        description: "Draft submitted successfully as a report",
      });
    } catch (error) {
      console.error('Error submitting draft:', error);
      toast({
        title: "Error",
        description: "Failed to submit draft",
        variant: "destructive",
      });
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-slate-900/50 border-slate-800">
            <CardHeader>
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
              Report Drafts
            </h2>
            <p className="text-sm text-slate-400">
              Manage your saved report drafts
            </p>
          </div>
        </div>
        <div className="bg-slate-800/50 px-3 py-1 rounded-full">
          <span className="text-sm text-slate-300">{drafts.length} drafts</span>
        </div>
      </div>

      {/* Drafts List */}
      {drafts.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800/50 text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No drafts found</h3>
            <p className="text-slate-500">
              You haven't saved any report drafts yet. Create a new report and save it as a draft.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {drafts.map((draft, index) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "overflow-hidden border-slate-800/50",
                "bg-gradient-to-br from-slate-900/95 to-slate-800/95", 
                "hover:shadow-md hover:shadow-slate-800/30 transition-all duration-300",
                "group hover:border-slate-700/70"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {draft.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1">
                        {draft.department.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')} • {draft.academic_year}
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(draft.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-800/40 p-3 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Publications</div>
                      <div className="text-lg font-medium text-emerald-400">{draft.publication_count}</div>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Conferences</div>
                      <div className="text-lg font-medium text-blue-400">{draft.conference_count}</div>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Projects</div>
                      <div className="text-lg font-medium text-purple-400">{draft.project_count}</div>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Funding</div>
                      <div className="text-lg font-medium text-amber-400">${draft.funding_amount.toLocaleString()}</div>
                    </div>
                  </div>

                  {draft.achievements && (
                    <div className="mb-4">
                      <div className="text-xs text-slate-500 mb-2">Achievements</div>
                      <p className="text-sm text-slate-300 bg-slate-800/40 p-3 rounded-lg line-clamp-2">
                        {draft.achievements}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-700/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditDraft(draft)}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => submitDraft(draft)}
                      disabled={submittingId === draft.id}
                      className="bg-indigo-900/30 border-indigo-700/50 hover:bg-indigo-800/50 text-indigo-300 hover:text-indigo-200"
                    >
                      {submittingId === draft.id ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteDraft(draft.id)}
                      disabled={deletingId === draft.id}
                      className="bg-rose-900/30 border-rose-700/50 hover:bg-rose-800/50 text-rose-300 hover:text-rose-200"
                    >
                      {deletingId === draft.id ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftManager;