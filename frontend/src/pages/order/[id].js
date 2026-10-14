import { PDFDownloadLink } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRef, useEffect, useState, useContext } from "react";
import { IoCloudDownloadOutline, IoPrintOutline, IoCopyOutline } from "react-icons/io5";
import { FiTruck, FiExternalLink } from "react-icons/fi";
import { notifySuccess, notifyError } from "@utils/toast";
import ReactToPrint from "react-to-print";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

//internal import

import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import Invoice from "@components/invoice/Invoice";
import Loading from "@components/preloader/Loading";
import OrderServices from "@services/OrderServices";
import RefundServices from "@services/RefundServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import InvoiceForDownload from "@components/invoice/InvoiceForDownload";
import OrderTracking from "@components/order/OrderTracking";
import { setToken } from "@services/httpServices";
import { UserContext } from "@context/UserContext";

const Order = ({ params }) => {
  const router = useRouter();
  const printRef = useRef();
  const orderId = params?.id || router?.query?.id;
  const { state } = useContext(UserContext) || {};
  const isWholesaler = state?.userInfo?.role && state.userInfo.role.toString().toLowerCase() === "wholesaler";

  // Set auth token before fetching order
  useEffect(() => {
    const userInfo = Cookies.get("userInfo");
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        if (parsedUser?.token) {
          setToken(parsedUser.token);
        }
      } catch (e) {
        // ignore cookie parse error
      }
    }
  }, []);

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReasons, setRefundReasons] = useState([]);
  const [refundMode, setRefundMode] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [refundNote, setRefundNote] = useState("");

  useEffect(() => {
    RefundServices.getRefundData()
      .then((res) => {
        if (res && res.reasons) {
          setRefundReasons(res.reasons.filter((r) => r.status?.toLowerCase() === "show"));
        }
        if (res && res.refundMode !== undefined) {
          setRefundMode(res.refundMode);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch refund reasons:", err?.message);
      });
  }, []);

  const handleRefundSubmit = async () => {
    if (!selectedReason) return notifyError("Please select a reason");
    try {
      const res = await OrderServices.requestRefund(orderId, {
        reason: selectedReason,
        note: refundNote,
      });
      notifySuccess(res?.message || "Refund requested successfully");
      setIsRefundModalOpen(false);
      window.location.reload();
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const userInfo = Cookies.get("userInfo");
      if (userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          if (parsedUser?.token) {
            setToken(parsedUser.token);
          }
        } catch (e) {
          // ignore error
        }
      }
      return await OrderServices.getOrderById(orderId);
    },
    enabled: !!orderId,
    retry: 1,
  });

  const { showingTranslateValue, getNumberTwo, currency } = useUtilsFunction();
  const { storeCustomizationSetting, globalSetting } = useGetSetting();

  const handleCopyTracking = (num) => {
    navigator.clipboard.writeText(num);
    notifySuccess("Tracking number copied!");
  };

  return (
    <Layout title="Invoice" description="order confirmation page">
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : error || !data ? (
        <div className="max-w-xl mx-auto my-20 text-center px-4">
          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800">
            <h2 className="text-lg font-medium text-red-400 mb-2">
              {error?.response?.data?.message || error?.message || "Order details could not be loaded."}
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              Please check your orders list or try again in a few moments.
            </p>
            <button
              onClick={() => router.push("/user/my-orders")}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Go to My Orders
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
          <div className="bg-zinc-950 border border-zinc-850 rounded-xl mb-5 px-4 py-3 text-white">
            <label className="text-sm">
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.invoice_message_first
              )}{" "}
              <span className="font-semibold text-white">
                {data?.user_info?.name || "Customer"},
              </span>{" "}
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.invoice_message_last
              )}
            </label>
          </div>
          <div className="bg-black border border-zinc-850 rounded-2xl shadow-xl p-4 sm:p-8 text-white">
            <div className="flex flex-wrap gap-3 mb-8">
               <PDFDownloadLink
                 document={
                   <InvoiceForDownload
                     data={data}
                     currency={currency}
                     globalSetting={globalSetting}
                     getNumberTwo={getNumberTwo}
                     logo={storeCustomizationSetting?.navbar?.logo}
                     isWholesaler={isWholesaler}
                   />
                 }
                 fileName={`Invoice-${data?.invoice || orderId}`}
               >
                 {({ blob, url, loading, error }) =>
                   loading ? (
                     "Loading..."
                   ) : (
                     <button className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-xl shadow-sm">
                       {showingTranslateValue(
                         storeCustomizationSetting?.dashboard?.download_button
                       )}{" "}
                       <span className="ml-2 text-base">
                         <IoCloudDownloadOutline />
                       </span>
                     </button>
                   )
                 }
               </PDFDownloadLink>

               {data?.trackingNumber && (
                 <>
                   <button 
                     onClick={() => router.push(`/user/track-order?id=${data?._id}`)}
                     className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-xl shadow-sm"
                   >
                     Track Shipment <FiTruck className="ml-2" />
                   </button>
                   
                   <button 
                     onClick={() => handleCopyTracking(data?.trackingNumber)}
                     className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-xl shadow-sm"
                   >
                     Copy AWB <IoCopyOutline className="ml-2" />
                   </button>

                   {data?.trackingUrl && (
                     <a 
                       href={data.trackingUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-xl shadow-sm"
                     >
                       Courier Tracking <FiExternalLink className="ml-2" />
                     </a>
                   )}
                 </>
               )}

               {data?.status === "Delivered" && refundMode && (
                 <button
                   onClick={() => setIsRefundModalOpen(true)}
                   className="flex items-center justify-center bg-red-600/90 text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-md hover:bg-red-600 shadow-sm"
                 >
                   Request Refund
                 </button>
               )}
            </div>

            {/* Live Tracking Section */}
            {(data?.trackingNumber || data?.status === "Shipped" || data?.status === "OutForDelivery") && (
               <div className="mb-10">
                  <OrderTracking order={data} />
               </div>
            )}

            <Invoice
              data={data}
              printRef={printRef}
              currency={currency}
              globalSetting={globalSetting}
            />
          </div>

          {/* Refund Modal */}
          {isRefundModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="bg-[#0e1017] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 text-white shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-white">Request Refund</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Reason</label>
                  <select
                    className="w-full bg-[#141620] border border-white/10 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-white"
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  >
                    <option value="" disabled className="bg-[#141620] text-gray-400">Select a reason...</option>
                    {refundReasons.map((r) => (
                      <option key={r._id} value={r.title} className="bg-[#141620] text-white">{r.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Additional Note (Optional)</label>
                  <textarea
                    className="w-full bg-[#141620] border border-white/10 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 text-white"
                    rows="3"
                    value={refundNote}
                    onChange={(e) => setRefundNote(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsRefundModalOpen(false)}
                    className="px-4 py-2 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRefundSubmit}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-md shadow-blue-900/30 transition-all"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps = ({ params }) => {
  return {
    props: { params },
  };
};

export default dynamic(() => Promise.resolve(Order), { ssr: false });
