import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoBagHandle, IoRefreshOutline, IoTimeOutline } from "react-icons/io5";
import { FiEye, FiStar, FiPackage, FiTruck, FiCheck, FiX, FiClock, FiShoppingCart } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import dayjs from "dayjs";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import { notifySuccess, notifyError } from "@utils/toast";

import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ReviewModal from "@components/reviews/ReviewModal";
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";
import useCartDB from "@hooks/useCartDB";

/* ─── Status badge ─── */
const StatusBadge = ({ status }) => {
  const map = {
    Delivered: { bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" },
    Pending: { bg: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400" },
    Processing: { bg: "bg-blue-500/15 text-blue-400 border-blue-500/30", dot: "bg-blue-400" },
    Cancel: { bg: "bg-red-500/15 text-red-400 border-red-500/30", dot: "bg-red-400" },
  };
  const s = map[status] || map.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status || "Pending"}
    </span>
  );
};

/* ─── Product thumbnail strip ─── */
const ProductStrip = ({ cart = [] }) => {
  const visible = cart.slice(0, 3);
  const extra = cart.length - visible.length;
  return (
    <div className="flex items-center gap-1">
      {visible.map((item, i) => {
        const img = item.image ||
          (Array.isArray(item.productId?.image) ? item.productId.image[0] : item.productId?.image) || "";
        return (
          <div key={i} className="w-8 h-8 rounded-md border border-white/10 overflow-hidden bg-[#161828] shrink-0">
            {img
              ? <img src={img} alt={item.title || "product"} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-500"><FiPackage size={12} /></div>
            }
          </div>
        );
      })}
      {extra > 0 && (
        <span className="w-8 h-8 rounded-md border border-dashed border-white/20 bg-white/5 flex items-center justify-center text-xs text-gray-400 font-semibold shrink-0">
          +{extra}
        </span>
      )}
    </div>
  );
};

/* ─── Main Component ─── */
const RecentOrder = ({ data, loading, error }) => {
  const router = useRouter();
  const { handleChangePage, currentPage, setCartDrawerOpen } = useContext(SidebarContext);
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue, currency } = useUtilsFunction();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [reorderingId, setReorderingId] = useState(null);

  const { addItemWithDB, clearCartWithDB } = useCartDB();
  const pageCount = Math.ceil(data?.totalDoc / 10);

  /* ─── Re-order handler ─── */
  const handleReorder = async (order) => {
    if (!order?.cart || !Array.isArray(order.cart) || order.cart.length === 0) {
      notifyError("No items found in this order.");
      return;
    }
    setReorderingId(order._id);
    try {
      await clearCartWithDB();
      let addedCount = 0;
      for (const item of order.cart) {
        const product = item.productId || item;
        const productId = product?._id || item._id || item.id;
        if (!productId) continue;
        const img = Array.isArray(product.image) ? product.image[0] : product.image || item.image || "";
        await addItemWithDB({
          id: String(productId),
          title: product.title?.en || product.title || item.title || "Product",
          price: item.price || product.prices?.price || product.prices?.originalPrice || 0,
          image: img,
          slug: product.slug || item.slug || "",
          quantity: item.quantity || 1,
          stock: product.stock,
          minQuantity: product.minQuantity,
        }, item.quantity || 1);
        addedCount++;
      }
      if (addedCount > 0) {
        notifySuccess(`${addedCount} item${addedCount > 1 ? "s" : ""} added! You can now adjust your cart.`);
        setCartDrawerOpen(true);
      } else {
        notifyError("Could not add items — product data may be unavailable.");
      }
    } catch (err) {
      notifyError("Something went wrong. Please try again.");
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <>
      <div className="bg-[#0c0d16] p-5 sm:p-6 rounded-2xl shadow-xl border border-white/10 mt-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {showingTranslateValue(storeCustomizationSetting?.dashboard?.recent_order) || "Recent Orders"}
          </h3>
          <Link href="/user/my-orders" className="text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <CMSkeletonTwo count={10} width={100} error={error} loading={loading} />
        ) : data?.orders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-3 text-blue-400 shadow-inner">
              <IoBagHandle className="text-3xl" />
            </div>
            <p className="text-sm text-gray-300 font-semibold mb-1">No orders placed yet!</p>
            <p className="text-xs text-gray-400 mb-5">Explore fresh groceries, daily staples, and organic snacks.</p>
            <Link href="/search" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition-all active:scale-95">
              <FiShoppingCart size={14} /> Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* ── Desktop Table ── */}
            <div className="hidden sm:block overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr className="bg-white/[0.03]">
                    {["Order ID", "Date", "Items", "Status", "Total", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-transparent">
                  {data?.orders?.map((order) => (
                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                          #{order?._id?.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="text-xs text-gray-200 font-semibold">{dayjs(order.createdAt).format("DD MMM YYYY")}</div>
                        <div className="text-xs text-gray-400">{dayjs(order.createdAt).format("hh:mm A")}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <ProductStrip cart={order.cart} />
                        <span className="text-xs text-gray-400">{order.cart?.length || 0} item{(order.cart?.length || 0) !== 1 ? "s" : ""}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-sm font-bold text-white">{currency}{parseFloat(order?.total || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/order/${order._id}`} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 text-gray-300 hover:bg-blue-600 hover:text-white border border-white/10 transition-all">
                            <FiEye size={10} /> View
                          </Link>
                          <Link href={`/order/${order._id}`} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 transition-all">
                            <FiTruck size={10} /> Track
                          </Link>
                          <button
                            type="button"
                            disabled={reorderingId === order._id}
                            onClick={() => handleReorder(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60 transition-all"
                          >
                            {reorderingId === order._id
                              ? <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                              : <IoRefreshOutline size={10} />
                            }
                            Re-order
                          </button>
                          {order.status === "Delivered" && order?.cart?.[0]?.slug && (
                            <button type="button" onClick={() => { setSelectedProductForReview(order.cart[0]); setReviewModalOpen(true); }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white border border-amber-500/20 transition-all">
                              <FiStar size={10} /> Rate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="sm:hidden space-y-3">
              {data?.orders?.map((order) => (
                <div key={order._id} className="bg-[#10121e] border border-white/10 rounded-xl overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-white/[0.03] border-b border-white/10">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      #{order?._id?.slice(-6).toUpperCase()}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="px-3.5 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <ProductStrip cart={order.cart} />
                      <span className="text-sm font-bold text-white">{currency}{parseFloat(order?.total || 0).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <IoTimeOutline size={11} />
                      {dayjs(order.createdAt).format("DD MMM YYYY · hh:mm A")}
                    </p>
                  </div>
                  <div className="px-3.5 py-2.5 bg-white/[0.02] border-t border-white/10 flex gap-2">
                    <Link href={`/order/${order._id}`} className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-blue-600 hover:text-white transition-all">
                      <FiTruck size={11} /> Track
                    </Link>
                    <button type="button" disabled={reorderingId === order._id} onClick={() => handleReorder(order)}
                      className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60 transition-all">
                      {reorderingId === order._id
                        ? <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        : <IoRefreshOutline size={11} />
                      }
                      Re-order
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination ── */}
            {data?.totalDoc > 10 && (
              <div className="paginationOrder mt-5">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="Next →"
                  onPageChange={(e) => handleChangePage(e.selected + 1)}
                  pageRangeDisplayed={3}
                  pageCount={pageCount}
                  previousLabel="← Prev"
                  renderOnZeroPageCount={null}
                  pageClassName="page--item"
                  pageLinkClassName="page--link"
                  previousClassName="page-item"
                  previousLinkClassName="page-previous-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-next-link"
                  breakClassName="page--item"
                  breakLinkClassName="page--link"
                  containerClassName="pagination"
                  activeClassName="activePagination"
                  forcePage={currentPage - 1}
                />
              </div>
            )}
          </>
        )}
      </div>

      {reviewModalOpen && selectedProductForReview && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          productSnapshot={selectedProductForReview}
        />
      )}
    </>
  );
};

export default RecentOrder;
