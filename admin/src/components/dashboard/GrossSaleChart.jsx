import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const GrossSaleChart = ({ data, loading }) => {
  // Logic to calculate monthly sales from dashboardOrderAmount.ordersData
  const { labels, grossSales, adminCommissions, deliveryCommissions, totalGross } = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sales = new Array(12).fill(0);
    const admin = new Array(12).fill(0);
    const delivery = new Array(12).fill(0);
    let total = 0;

    const orders = data?.ordersData || [];
    
    // Group orders by month
    orders.forEach(order => {
      const date = dayjs(order.updatedAt || order.createdAt);
      if (date.year() === dayjs().year()) { // Only current year
        const monthIndex = date.month();
        const amount = order.total || 0;
        sales[monthIndex] += amount;
        total += amount;
        
        // Mock commissions since they aren't explicitly in the schema
        // Using common logic: Admin (10%), Delivery (5%)
        admin[monthIndex] += amount * 0.1;
        delivery[monthIndex] += amount * 0.05;
      }
    });

    return { 
      labels: months, 
      grossSales: sales, 
      adminCommissions: admin, 
      deliveryCommissions: delivery,
      totalGross: total
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#09090b",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += '₹' + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#71717a", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { 
          color: "#71717a", 
          font: { size: 11 },
          callback: (value) => '₹' + value.toLocaleString(),
        },
        border: { display: false },
      },
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0, hoverRadius: 6 },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Gross Sales",
        data: grossSales,
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20, 184, 166, 0.08)",
        borderWidth: 2.5,
      },
      {
        fill: true,
        label: "Admin Commission",
        data: adminCommissions,
        borderColor: "#fb7185",
        backgroundColor: "rgba(251, 113, 133, 0.05)",
        borderWidth: 2,
      },
      {
        fill: true,
        label: "Delivery Commission",
        data: deliveryCommissions,
        borderColor: "#0d9488",
        backgroundColor: "rgba(13, 148, 136, 0.05)",
        borderWidth: 2,
      },
    ],
  };

  if (loading) return (
    <div className="bg-white dark:bg-zinc-950/80 p-8 rounded-3xl h-[400px] flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-xl animate-pulse">
       <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Analytics...</div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-zinc-950/80 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 h-[500px] flex flex-col transition-all duration-300 backdrop-blur-xl">
      <div className="flex flex-col xl:flex-row justify-between items-start mb-8 gap-6">
        <div>
          <div className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">
            ₹{totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs font-bold text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Gross Sale Insight</div>
        </div>

        <div className="flex flex-col items-end gap-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]" />
              <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Gross Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#fb7185]" />
              <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" />
              <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Delivery</span>
            </div>
          </div>

          <div className="relative">
             <select className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 px-4 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-zinc-200 uppercase tracking-wider focus:outline-none cursor-pointer appearance-none pr-8">
               <option>This Year</option>
               <option>This Month</option>
               <option>This Week</option>
             </select>
             <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default GrossSaleChart;
