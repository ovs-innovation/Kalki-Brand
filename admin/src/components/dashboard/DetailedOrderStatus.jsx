import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiSmartphone, 
  FiBox, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiRefreshCcw, 
  FiAlertCircle 
} from 'react-icons/fi';

const DetailedOrderStatus = ({ dashboardOrderCount }) => {
  const pendingCount = dashboardOrderCount?.totalPendingOrder?.count || 0;
  const processingCount = dashboardOrderCount?.totalProcessingOrder || 0;
  const deliveredCount = dashboardOrderCount?.totalDeliveredOrder || 0;
  const canceledCount = dashboardOrderCount?.totalCancelOrder || 0;
  
  const acceptedCount = dashboardOrderCount?.totalAcceptedOrder || 0;
  const outForDeliveryCount = dashboardOrderCount?.totalOutForDeliveryOrder || 0;
  const refundedCount = dashboardOrderCount?.totalRefundedOrder || 0;
  const paymentFailedCount = dashboardOrderCount?.totalFailedOrder || 0;

  const cards = [
    {
      title: "Unassigned Orders",
      value: pendingCount,
      valueColor: "text-zinc-700 dark:text-zinc-200",
      iconBg: "bg-blue-500/10 border border-blue-500/20 text-blue-400",
      Icon: FiCalendar,
      link: "/orders/pending"
    },
    {
      title: "Accepted By Delivery",
      value: acceptedCount,
      valueColor: "text-emerald-500 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
      Icon: FiSmartphone,
      link: "/orders/accepted"
    },
    {
      title: "Packaging",
      value: processingCount,
      valueColor: "text-amber-500 dark:text-amber-400",
      iconBg: "bg-amber-500/10 border border-amber-500/20 text-amber-400",
      Icon: FiBox,
      link: "/orders/processing"
    },
    {
      title: "Out For Delivery",
      value: outForDeliveryCount,
      valueColor: "text-cyan-500 dark:text-cyan-400",
      iconBg: "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400",
      Icon: FiTruck,
      link: "/orders/on-the-way"
    },
    {
      title: "Delivered",
      value: deliveredCount,
      valueColor: "text-emerald-500 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
      Icon: FiCheckCircle,
      link: "/orders/delivered"
    },
    {
      title: "Canceled",
      value: canceledCount,
      valueColor: "text-rose-500 dark:text-rose-400",
      iconBg: "bg-rose-500/10 border border-rose-500/20 text-rose-400",
      Icon: FiXCircle,
      link: "/orders/canceled"
    },
    {
      title: "Refunded",
      value: refundedCount,
      valueColor: "text-purple-500 dark:text-purple-400",
      iconBg: "bg-purple-500/10 border border-purple-500/20 text-purple-400",
      Icon: FiRefreshCcw,
      link: "/orders/refunded"
    },
    {
      title: "Payment Failed",
      value: paymentFailedCount,
      valueColor: "text-rose-500 dark:text-rose-400",
      iconBg: "bg-rose-500/10 border border-rose-500/20 text-rose-400",
      Icon: FiAlertCircle,
      link: "/orders/payment-failed"
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-950/80 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 mt-6 backdrop-blur-xl">
      <div className="mb-5">
        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Fulfillment Status</h3>
        <p className="text-xs font-semibold text-gray-400 dark:text-zinc-400 mt-0.5">Live order fulfillment tracking</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Link 
            key={index} 
            to={card.link}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900/60 hover:dark:bg-zinc-900/95 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-white/20 hover:shadow-lg transition-all duration-300 group no-underline hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <card.Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 leading-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                {card.title}
              </span>
            </div>
            <span className={`text-xl font-black ${card.valueColor} tracking-tight group-hover:scale-110 transition-transform duration-300`}>
              {card.value}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DetailedOrderStatus;
