import { useGetAllCoursesQuery } from '@/app/redux/features/courses/coursesApi';
import { useGetAllInvoicesQuery } from '@/app/redux/features/orders/ordersApi'
import { useGetAllUsersQuery } from '@/app/redux/features/user/userApi';
import React, { useEffect, useState } from 'react'
import Loader from '../../Loader/Loader';
import { HeadingAdmin } from '../../ui/heading';
import { format } from 'timeago.js';
import { DataTable } from '../../ui/data-table';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { columns } from './Columns';

const ListInvoices = () => {
  const { isLoading: isLoadingInvoices, data: invoicesData } = useGetAllInvoicesQuery({});
  const { isLoading: isLoadingUsers, data: usersData } = useGetAllUsersQuery({});
  const { isLoading: isLoadingCourses, data: coursesData } = useGetAllCoursesQuery({});
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    if (invoicesData?.orders && usersData?.users && coursesData?.courses) {
      const temp = invoicesData.orders.map((order) => {
        const user = usersData.users.find((user) => user._id === order.userId);
        const course = coursesData.courses.find((course) => course._id === order.courseId);
        return {
          ...order,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.name || 'Unknown',
          price: course?.price ? `$${course.price}` : 'N/A',
        }
      });
      setOrderData(temp);
    }
  }, [invoicesData, usersData, coursesData]);

  const rows = React.useMemo(() => {
    const sortedOrders = [...orderData].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return sortedOrders.map((item) => ({
      id: item._id,
      userName: item.userName,
      userEmail: item.userEmail,
      title: item.title,
      price: item.price,
      created_at: format(item.createdAt),
    }));
  }, [orderData]);

  const isLoading = isLoadingInvoices || isLoadingUsers || isLoadingCourses;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-start justify-between">
            <HeadingAdmin
              title={`Invoices (${rows.length})`}
              description="Manage invoices."
            />
          </div>
          <Separator />
          <DataTable searchKey="userName" columns={columns} data={rows} />
        </>
      )}
    </>
  )
}

export default ListInvoices