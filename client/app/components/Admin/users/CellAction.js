'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu';
import {  Mail, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { useDeleteCourseMutation, useGetAllCoursesQuery } from '@/app/redux/features/courses/coursesApi';
import toast from 'react-hot-toast';
import { AlertModal } from '../modal/alert-modal';
import { useDeleteUserMutation, useGetAllUsersQuery } from '@/app/redux/features/user/userApi';

export const CellAction = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
    const [deleteUser, { error, isSuccess }] = useDeleteUserMutation({});

    useEffect(() => {
      if (isSuccess) {
          setOpen(false);
          refetch();
          toast.success('User deleted successfully');
      }
      if (error && 'data' in error) {
          toast.error(error.data.message);
      }
  }, [isSuccess, error, refetch]);

  const handleDelete = async () => {
    await deleteUser(data.id).unwrap();
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
            onClick={() => router.push(`mailto:${data.id}`)}
          >
            <Mail className="mr-2 h-4 w-4" /> Send Mail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4"/> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};