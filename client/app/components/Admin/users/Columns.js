'use client';
import { CellAction } from './CellAction';
import { Checkbox } from '@/app/components/ui/checkbox';

export const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL'
  },
  {
    accessorKey: 'phoneNumber',
    header: 'PHONE NUMBER'
  },
  {
    accessorKey: 'role',
    header: 'ROLE'
  },
  {
    accessorKey: 'courses',
    header: 'PURCHASED COURSES'
  },
  {
    accessorKey: 'created_at',
    header: 'CREATE AT'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];