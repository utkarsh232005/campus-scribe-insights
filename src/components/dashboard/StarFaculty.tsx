
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FacultyMember {
  id: string;
  name: string;
  avatar?: string;
  publications: number;
  percentile: string;
  year: number;
}

interface StarFacultyProps {
  title: string;
  faculty: FacultyMember[];
}

const StarFaculty = ({
  title,
  faculty
}: StarFacultyProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center bg-gradient-to-r from-purple-600/20 to-purple-400/20">
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-purple-600/10">
            <TableRow className="hover:bg-purple-600/20 transition-colors">
              <TableHead className="text-slate-300 font-medium">ID</TableHead>
              <TableHead className="text-slate-300 font-medium">Name</TableHead>
              <TableHead className="text-right text-slate-300 font-medium">Publications</TableHead>
              <TableHead className="text-right text-slate-300 font-medium">Percentile</TableHead>
              <TableHead className="text-right text-slate-300 font-medium">Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculty.map(member => (
              <TableRow 
                key={`${member.id}-${member.year}`} 
                className="hover:bg-purple-600/10 transition-colors"
              >
                <TableCell className="text-slate-300 font-medium">{member.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3 border-2 border-purple-600/30">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-purple-600/20 text-slate-50">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-slate-200">{member.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-300">{member.publications}</TableCell>
                <TableCell className="text-right text-slate-300">{member.percentile}</TableCell>
                <TableCell className="text-right text-slate-300">{member.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StarFaculty;
