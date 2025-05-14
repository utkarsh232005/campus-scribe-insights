
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar as CalendarIcon, ChevronRight, Home, ChevronLeft, ChevronDown, Clock, PlusCircle } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type EventType = {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'meeting' | 'deadline' | 'event';
};

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  
  // Sample events - in a real app, these would come from a database or API
  const [events] = useState<EventType[]>([
    {
      id: '1',
      title: 'Faculty Meeting',
      date: new Date(2025, 4, 15),
      time: '10:00 AM',
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Research Presentation',
      date: new Date(2025, 4, 17),
      time: '2:30 PM',
      type: 'event'
    },
    {
      id: '3',
      title: 'Grant Proposal Deadline',
      date: new Date(2025, 4, 20),
      time: '11:59 PM',
      type: 'deadline'
    }
  ]);

  // Get events for the selected date
  const selectedDateEvents = events.filter(event => 
    date && event.date.toDateString() === date.toDateString()
  );

  // Helper to format month and year
  const formatMonthYear = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      {/* Page Header with Gradient */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-indigo-700/90 p-8 mb-8 shadow-lg border border-indigo-500/30">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.7))]" />
        <div className="relative z-10">
          <div className="flex items-center text-sm text-indigo-200/90 mb-2">
            <Home className="h-3.5 w-3.5 mr-1" />
            <ChevronRight className="h-3 w-3 mx-1 text-indigo-300/50" />
            <span className="text-indigo-50 font-medium">Calendar</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Academic Calendar</h1>
          <p className="text-indigo-200/90 max-w-xl">Track faculty meetings, academic deadlines, and important events</p>
        </div>
        <div className="absolute right-8 bottom-8 opacity-20">
          <CalendarIcon className="h-24 w-24 text-white" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Calendar Section */}
        <div className="lg:w-2/3">
          <Card className="bg-slate-900/95 border-slate-800/50 overflow-hidden shadow-lg">
            <CardHeader className="bg-slate-800/50 border-b border-slate-700/50 pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-indigo-400" />
                  <CardTitle className="text-xl font-semibold text-white">
                    {formatMonthYear(date)}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-300 hover:text-white hover:bg-slate-800/90"
                    onClick={() => setView('month')}
                  >
                    Month
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-300 hover:text-white hover:bg-slate-800/90"
                    onClick={() => setView('week')}
                  >
                    Week
                  </Button>
                  <div className="flex rounded-md overflow-hidden border border-slate-700/70">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-none h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800/90"
                      onClick={() => setDate(date ? new Date(date.getFullYear(), date.getMonth() - 1, 1) : new Date())}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="rounded-none h-8 px-3 text-slate-300 hover:text-white hover:bg-slate-800/90 border-l border-r border-slate-700/70"
                      onClick={() => setDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-none h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800/90"
                      onClick={() => setDate(date ? new Date(date.getFullYear(), date.getMonth() + 1, 1) : new Date())}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="p-4">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className={cn(
                    "rounded-md border-slate-700 bg-transparent",
                    "[&_.rdp-caption]:text-slate-200",
                    "[&_.rdp-head_th]:text-slate-400 [&_.rdp-head_th]:font-medium",
                    "[&_.rdp-button]:text-slate-300 [&_.rdp-button:hover]:bg-indigo-600/20 [&_.rdp-button:hover]:text-indigo-200",
                    "[&_.rdp-day_today]:bg-indigo-800/20 [&_.rdp-day_today]:border-indigo-600/50 [&_.rdp-day_today]:text-indigo-200",
                    "[&_.rdp-button_selected]:bg-indigo-600 [&_.rdp-button_selected]:text-indigo-50 [&_.rdp-button_selected]:hover:bg-indigo-600/90",
                    "[&_.rdp-nav_button]:text-slate-300 [&_.rdp-nav_button:hover]:bg-indigo-600/20 [&_.rdp-nav_button:hover]:text-indigo-200"
                  )}
                  modifiersClassNames={{
                    selected: 'bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white',
                    today: 'bg-indigo-800/20 border border-indigo-600/50 text-indigo-200'
                  }}
                  classNames={{
                    table: 'w-full border-collapse',
                    head_row: 'flex',
                    head_cell: 'text-slate-400 rounded-md w-10 font-medium text-[0.8rem] h-10 flex items-center justify-center',
                    row: 'flex w-full',
                    cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-indigo-600/10',
                    day: cn(
                      'h-10 w-10 p-0 font-normal aria-selected:opacity-100',
                      'hover:bg-indigo-600/20 hover:text-indigo-200 focus:bg-indigo-600/20 focus:text-indigo-200',
                      'flex items-center justify-center rounded-md'
                    ),
                    day_today: 'bg-indigo-800/20 border border-indigo-600/50 text-indigo-200',
                    day_selected: 'bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-700 focus:text-white',
                    day_disabled: 'text-slate-600',
                    day_outside: 'text-slate-500 opacity-50',
                    day_range_middle: 'aria-selected:bg-indigo-600/20 aria-selected:text-indigo-200',
                    day_hidden: 'invisible',
                    nav: 'flex items-center justify-between py-2',
                    nav_button: 'h-7 w-7 p-0 flex items-center justify-center bg-transparent text-slate-400 hover:text-indigo-400 hover:bg-indigo-700/20 rounded-md transition-colors',
                    nav_button_previous: 'absolute left-0',
                    nav_button_next: 'absolute right-0',
                    caption: 'relative flex justify-center items-center py-2',
                    caption_dropdowns: 'flex justify-center gap-1',
                    caption_label: 'text-lg font-medium text-slate-200'
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Panel */}
        <div className="lg:w-1/3">
          <Card className="bg-slate-900/95 border-slate-800/50 overflow-hidden shadow-lg h-full">
            <CardHeader className="bg-slate-800/50 border-b border-slate-700/50 pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-400" />
                  <CardTitle className="text-base font-medium text-white">
                    {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Events'}
                  </CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/20"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={cn(
                        "p-3 rounded-lg border transition-colors",
                        event.type === 'meeting' ? "bg-blue-950/30 border-blue-700/30 hover:border-blue-600/50" : 
                        event.type === 'deadline' ? "bg-rose-950/30 border-rose-700/30 hover:border-rose-600/50" :
                        "bg-emerald-950/30 border-emerald-700/30 hover:border-emerald-600/50"
                      )}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium text-white">{event.title}</h3>
                        <span 
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            event.type === 'meeting' ? "bg-blue-800/50 text-blue-300" :
                            event.type === 'deadline' ? "bg-rose-800/50 text-rose-300" :
                            "bg-emerald-800/50 text-emerald-300"
                          )}
                        >
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        <span className="text-slate-400">{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="p-3 rounded-full bg-slate-800/70 mb-3">
                    <CalendarIcon className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-slate-300 font-medium">No Events</h3>
                  <p className="text-sm text-slate-500 mt-1">No events scheduled for this date</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/20"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" /> Schedule Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
