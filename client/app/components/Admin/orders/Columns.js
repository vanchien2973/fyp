'use client';
import { Checkbox } from '@/app/components/ui/checkbox';
import { CellAction } from './CellAction';

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
    header: 'ID',
  },
  {
    accessorKey: 'userName',
    header: 'NAME'
  },
  {
    accessorKey: 'userEmail',
    header: 'EMAIL'
  },
  {
    accessorKey: 'title',
    header: 'COURSE TITLE'
  },
  {
    accessorKey: 'price',
    header: 'PRICE'
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