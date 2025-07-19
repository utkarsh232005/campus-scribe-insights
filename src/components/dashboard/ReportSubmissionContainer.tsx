import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Plus } from 'lucide-react';
import ReportForm from './ReportForm';
import DraftManager from './DraftManager';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const reportSchema = z.object({
  title: z.string().min(5, { message: "Report title must be at least 5 characters" }),
  academicYear: z.string().min(1, { message: "Please select an academic year" }),
  publicationCount: z.string().min(1, { message: "Please enter number of publications" }),
  conferenceCount: z.string().min(1, { message: "Please enter number of conferences" }),
  projectCount: z.string().min(1, { message: "Please enter number of projects" }),
  fundingAmount: z.string().min(1, { message: "Please enter funding amount" }),
  achievements: z.string().min(10, { message: "Please provide a summary of achievements" }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

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

const ReportSubmissionContainer = () => {
  const [view, setView] = useState<'form' | 'drafts'>('form');
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);

  const handleViewDrafts = () => {
    setView('drafts');
    setEditingDraft(null);
  };

  const handleBackToForm = () => {
    setView('form');
    setEditingDraft(null);
  };

  const handleEditDraft = (draft: Draft) => {
    setEditingDraft(draft);
    setView('form');
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant={view === 'form' ? 'default' : 'outline'}
            onClick={handleBackToForm}
            className={view === 'form' 
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
              : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700"
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
          
          <Button
            variant={view === 'drafts' ? 'default' : 'outline'}
            onClick={handleViewDrafts}
            className={view === 'drafts' 
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
              : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700"
            }
          >
            <FileText className="h-4 w-4 mr-2" />
            Drafts
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === 'form' ? (
        <ReportForm editingDraft={editingDraft} onDraftSaved={handleViewDrafts} />
      ) : (
        <DraftManager onBack={handleBackToForm} onEditDraft={handleEditDraft} />
      )}
    </div>
  );
};

export default ReportSubmissionContainer;