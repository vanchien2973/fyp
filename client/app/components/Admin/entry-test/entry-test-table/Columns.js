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
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "testType",
    header: "Type",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];