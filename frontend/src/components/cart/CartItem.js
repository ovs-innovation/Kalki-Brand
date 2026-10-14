import { useContext } from "react";
import Link from "next/link";
import { useCart } from "react-use-cart";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import Image from "next/image";

//internal import
import useAddToCart from "@hooks/useAddToCart";
import useCartDB from "@hooks/useCartDB";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import { notifyError } from "@utils/toast";

const CartItem = ({ item, currency = "₹" }) => {
  const { closeCartDrawer } = useContext(SidebarContext);
  const { handleIncreaseQuantity } = useAddToCart();
  const { updateQuantityWithDB, removeItemWithDB } = useCartDB();
  const { state } = useContext(UserContext) || {};
  const isWholesaler =
    state?.userInfo?.role &&
    state.userInfo.role.toString().toLowerCase() === "wholesaler";

  // Calculate MRP and discount - Check multiple possible price fields (only for non-wholesalers)
  const originalPrice =
    item.originalPrice ||
    item.mrp ||
    item.prices?.original ||
    item.price * 1.2; // Add 20% markup as fallback
  const currentPrice = item.price || item.prices?.sale || 0;
  const discount = originalPrice > currentPrice ? originalPrice - currentPrice : 0;
  const discountPercentage =
    originalPrice > currentPrice
      ? ((discount / originalPrice) * 100).toFixed(0)
      : 0;

  /**
   * Handle decrease quantity — updates local cart + DB.
   * Enforces minQuantity constraint.
   */
  const handleDecrease = async () => {
    const minQty = item?.minQuantity ? Number(item.minQuantity) : 1;
    if (item.quantity - 1 < minQty) {
      notifyError(`Minimum quantity is ${minQty}`);
      return;
    }
    await updateQuantityWithDB(item.id, item.quantity - 1);
  };

  /**
   * Handle remove — removes from local cart + DB.
   */
  const handleRemove = async () => {
    await removeItemWithDB(item.id);
  };

  return (
    <div className="group w-full h-auto flex justify-start items-start bg-black py-3.5 px-4 mb-3 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 relative">
      {/* Enhanced Image Container */}
      <div className="relative flex rounded-lg border border-white/10 overflow-hidden flex-shrink-0 cursor-pointer mr-3.5 bg-black">
        <Image
          key={item.id}
          src={
            (Array.isArray(item.image) ? item.image[0] : item.image) ||
            (Array.isArray(item.images) ? item.images[0] : item.images) ||
            "/placeholder.png"
          }
          width={70}
          height={70}
          alt={item.title}
          className="object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col w-full overflow-hidden flex-1">
        {/* Product Title */}
        <Link
          href={`/product/${item.slug || item.id || item._id}`}
          onClick={closeCartDrawer}
          className="truncate text-sm md:text-base font-medium text-white hover:text-blue-400 transition-colors duration-200 line-clamp-2 mb-1"
        >
          {item.title}
        </Link>

        {/* MRP and Discount - Clean text without badge background */}
        {!isWholesaler && originalPrice > currentPrice && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-neutral-500 line-through font-normal">
              MRP: {currency}{originalPrice.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              ({discountPercentage}% OFF)
            </span>
          </div>
        )}

        {/* Item Price - Hidden for wholesalers */}
        {!isWholesaler && (
          <span className="text-xs text-neutral-400 mb-2 font-normal">
            Unit Price:{" "}
            <span className="text-neutral-200 font-medium">
              {currency}{item.price.toFixed(2)}
            </span>
          </span>
        )}

        {/* Bottom Section: Price, Quantity, Delete */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          {/* Total Price */}
          <div className="flex flex-col">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider">Total</span>
            <span className="font-semibold text-base md:text-lg text-white leading-tight">
              {currency}{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <div className="h-8 flex items-center justify-center p-0.5 border border-white/15 bg-black text-white rounded-lg transition-all">
              <button
                onClick={handleDecrease}
                className="h-full px-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-md transition-colors active:scale-95"
                aria-label="Decrease quantity"
              >
                <FiMinus className="text-xs" />
              </button>

              <span className="text-xs font-semibold text-white px-2.5 min-w-[1.75rem] text-center">
                {item.quantity}
              </span>

              <button
                onClick={() => handleIncreaseQuantity(item)}
                className="h-full px-2 text-neutral-400 hover:text-blue-400 hover:bg-white/5 rounded-md transition-colors active:scale-95"
                aria-label="Increase quantity"
              >
                <FiPlus className="text-xs" />
              </button>
            </div>

            {/* Delete Button */}
            <button
              onClick={handleRemove}
              className="h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all active:scale-95 ml-1"
              aria-label="Remove item"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;