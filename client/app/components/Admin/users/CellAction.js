'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu';
import {  Mail, MoreHorizontal, Trash, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import toast from 'react-hot-toast';
import { AlertModal } from '../modal/alert-modal';
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateRoleMutation } from '@/app/redux/features/user/userApi';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useSelector } from 'react-redux';

export const CellAction = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newRole, setNewRole] = useState(data.role);
  const router = useRouter();
  const { refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
  const [deleteUser, { error: deleteError, isSuccess: isDeleteSuccess }] = useDeleteUserMutation();
  const [updateRole, { error: updateError, isSuccess: isUpdateSuccess }] = useUpdateRoleMutation();
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isDeleteSuccess) {
      setOpen(false);
      refetch();
      toast.success('User deleted successfully');
    }
    if (deleteError && 'data' in deleteError) {
      toast.error(deleteError.data.message);
    }
    if (isUpdateSuccess) {
      setIsUpdateModalOpen(false);
      refetch();
      toast.success('User role updated successfully');
    }
    if (updateError && 'data' in updateError) {
      toast.error(updateError.data.message);
    }
  }, [isDeleteSuccess, deleteError, isUpdateSuccess, updateError, refetch]);

  const handleDelete = async () => {
    if (data.role === 'admin' && data.email === 'admin@gmail.com') {
      toast.error('Cannot delete the main admin account');
      setOpen(false);
      return;
    }
    
    if (data.email === currentUser.email) {
      toast.error('Cannot delete your own account');
      setOpen(false);
      return;
    }

    await deleteUser(data.id);
  };

  const handleUpdateRole = async () => {
    await updateRole({ id: data.id, role: newRole });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
          </DialogHeader>
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select new role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            onClick={() => router.push(`mailto:${data.email}`)}
          >
            <Mail className="mr-2 h-4 w-4" /> Send Mail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)}>
            <UserCog className="mr-2 h-4 w-4"/> Update Role
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4"/> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};