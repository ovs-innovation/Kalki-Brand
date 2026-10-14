import React from "react";
import {
  FiShoppingCart,
  FiUsers,
  FiFileText,
  FiTruck,
  FiHome,
  FiXCircle,
  FiRefreshCw,
  FiCreditCard,
  FiActivity,
  FiPackage,
} from "react-icons/fi";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import CardItem from "@/components/dashboard/CardItem";

dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const ModernStats = ({ dashboardOrderCount, timeFilter, setTimeFilter, dashboardOrderAmount }) => {
  const filteredOrders = dashboardOrderAmount?.ordersData?.filter(order => {
    const orderDate = dayjs(order.updatedAt);
    if (timeFilter === "week") return orderDate.isAfter(dayjs().subtract(7, 'day'));
    if (timeFilter === "month") return orderDate.isAfter(dayjs().subtract(1, 'month'));
    return true;
  }) || [];

  const getStatusCount = (status) => filteredOrders.filter(o => o.status === status).length;

  // Top summary cards
  const topCards = [
    {
      title: "Total Sales",
      Icon: FiCreditCard,
      quantity: dashboardOrderAmount?.totalAmount || 0,
      className: "text-emerald-500 bg-emerald-500",
      isAmount: true,
      link: "/orders"
    },
    {
      title: "Total Orders",
      Icon: FiShoppingCart,
      quantity: timeFilter === 'year' ? (dashboardOrderCount?.totalOrder || 0) : filteredOrders.length,
      className: "text-orange-500 bg-orange-500",
      link: "/orders"
    },
    {
      title: "Total Customers",
      Icon: FiUsers,
      quantity: dashboardOrderCount?.totalCustomer || 0,
      className: "text-purple-500 bg-purple-500",
      link: "/customers"
    },
    {
      title: "Total Products",
      Icon: FiPackage,
      quantity: dashboardOrderCount?.totalProduct || 0,
      className: "text-blue-500 bg-blue-500",
      link: "/products"
    },
    {
      title: "Pending Orders",
      Icon: FiRefreshCw,
      quantity: timeFilter === 'year' ? (dashboardOrderCount?.totalPendingOrder?.count || 0) : getStatusCount("Pending"),
      amount: timeFilter === 'year' ? (dashboardOrderCount?.totalPendingOrder?.total || 0) : null,
      className: "text-yellow-500 bg-yellow-500",
      link: "/orders/pending"
    },
    {
      title: "Processing",
      Icon: FiTruck,
      quantity: timeFilter === 'year' ? (dashboardOrderCount?.totalProcessingOrder || 0) : getStatusCount("Processing"),
      className: "text-teal-500 bg-teal-500",
      link: "/orders/processing"
    },
    {
      title: "Delivered",
      Icon: FiHome,
      quantity: timeFilter === 'year' ? (dashboardOrderCount?.totalDeliveredOrder || 0) : getStatusCount("Delivered"),
      className: "text-green-500 bg-green-500",
      link: "/orders/delivered"
    },
    {
      title: "Cancelled",
      Icon: FiXCircle,
      quantity: timeFilter === 'year' ? (dashboardOrderCount?.totalCancelOrder || 0) : getStatusCount("Cancel"),
      className: "text-red-500 bg-red-500",
      link: "/orders/canceled"
    },
  ];

  return (
    <div className="w-full space-y-6 bg-white dark:bg-zinc-950/80 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 backdrop-blur-xl">

      {/* Period Filter Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Overview</h2>
          <p className="text-xs font-semibold text-gray-400 dark:text-zinc-400 mt-0.5">Real-time performance metrics</p>
        </div>
        <div className="inline-flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl border border-gray-200 dark:border-white/10">
          {["week", "month", "year"].map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-all duration-200 cursor-pointer ${
                timeFilter === period
                  ? 'bg-white text-black dark:bg-white dark:text-black shadow-sm'
                  : 'text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {topCards.map((card, i) => (
          <CardItem
            key={i}
            title={card.title}
            Icon={card.Icon}
            quantity={card.quantity}
            amount={card.amount}
            className={card.className}
            isAmount={card.isAmount}
            link={card.link}
            loading={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ModernStats;
