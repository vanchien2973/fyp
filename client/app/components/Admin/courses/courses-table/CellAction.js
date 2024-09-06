'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertModal } from '../../modal/alert-modal';
import { Button } from '@/app/components/ui/button';
import { useDeleteCourseMutation, useGetAllCoursesQuery } from '@/app/redux/features/courses/coursesApi';
import toast from 'react-hot-toast';

export const CellAction = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [deleteCourse, { error, isSuccess }] = useDeleteCourseMutation({});
  const { refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (isSuccess) {
        setOpen(false);
        refetch();
        toast.success('Course deleted successfully');
    }
    if (error && 'data' in error) {
      toast.error(error.data?.message || 'An error occurred while deleting the course');
    }
}, [isSuccess, error, refetch]);

  const handleDelete = async () => {
    await deleteCourse(data.id).unwrap();
    console.log("id: ", data.id)
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/edit-course/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4"/> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};