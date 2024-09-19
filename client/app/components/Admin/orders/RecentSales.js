import React, { useMemo } from 'react'
import { useGetAllInvoicesQuery } from '@/app/redux/features/orders/ordersApi'
import { useGetAllUsersQuery } from '@/app/redux/features/user/userApi'
import { UserAvatar } from '../../ui/avatar'
import Loader from '../../Loader/Loader'

const RecentSales = () => {
  const { isLoading: isLoadingInvoices, data: invoicesData } = useGetAllInvoicesQuery({});
  const { isLoading: isLoadingUsers, data: usersData } = useGetAllUsersQuery({});

  const recentSales = useMemo(() => {
    if (!invoicesData?.orders || !usersData?.users) return [];
    const sortedOrders = [...invoicesData.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    return sortedOrders.map(order => {
      const user = usersData.users.find(user => user._id === order.userId);
      return {
        id: order._id,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        amount: order.price
      };
    });
  }, [invoicesData, usersData]);

  if (isLoadingInvoices || isLoadingUsers) {
    return <Loader/>;
  }

  return (
    <div className="space-y-8">
      {recentSales.map(sale => (
        <div key={sale.id} className="flex items-center">
          <UserAvatar 
            user={sale.user} 
            className="h-9 w-9"
          />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {sale.user.email}
            </p>
          </div>
          <div className="ml-auto font-medium">+${sale.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}

export default RecentSales