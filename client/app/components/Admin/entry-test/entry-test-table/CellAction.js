import React, { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../../../ui/dropdown-menu';
import { Edit, FileSearch, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertModal } from '../../modal/alert-modal';
import { Button } from '../../../ui/button';
import toast from 'react-hot-toast';
import { useDeleteEntranceTestMutation, useGetAllEntranceTestsQuery } from '@/app/redux/features/entry-test/entryTestApi';

export const CellAction = ({ data }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [deleteEntryTest, { isLoading, error, isSuccess }] = useDeleteEntranceTestMutation();
  const { refetch } = useGetAllEntranceTestsQuery({}, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success('Entry Test deleted successfully');
    }
    if (error) {
      const errorMessage = 'data' in error 
        ? error.data?.message 
        : 'An unknown error occurred';
      toast.error(errorMessage);
    }
  }, [isSuccess, error, refetch]);

  const handleDelete = async () => {
    if (data._id) {
      try {
        await deleteEntryTest(data._id).unwrap();
      } catch (err) {
        console.log(err)
        toast.error('Failed to delete Entry Test');
      }
    } else {
      toast.error('Invalid Entry Test ID');
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
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
            onClick={() => router.push(`/admin/entry-test/${data._id}`)}
          >
            <FileSearch className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/edit-entry-test/${data._id}`)}
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