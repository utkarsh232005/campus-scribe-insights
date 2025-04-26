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
  return <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b flex justify-between items-center bg-transparent">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Publications</TableHead>
              <TableHead className="text-right">Percentile</TableHead>
              <TableHead className="text-right">Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculty.map(member => <TableRow key={member.id}>
                <TableCell className="font-medium">{member.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {member.name}
                  </div>
                </TableCell>
                <TableCell className="text-right">{member.publications}</TableCell>
                <TableCell className="text-right">{member.percentile}</TableCell>
                <TableCell className="text-right">{member.year}</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>;
};
export default StarFaculty;