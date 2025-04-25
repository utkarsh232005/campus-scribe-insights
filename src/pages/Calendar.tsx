
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Calendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendar</h1>
          <div className="flex items-center text-sm text-gray-400">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Calendar</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          className="text-white"
        />
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
