import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useContext } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";
import { FiHeart } from "react-icons/fi";
import { useCart } from "react-use-cart";
import { useRouter } from "next/router";

// internal import
import Stock from "@components/common/Stock";
import { notifyError, notifySuccess } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import { UserContext } from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import Discount from "@components/common/Discount";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@components/modal/ProductModal";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { handleLogEvent } from "src/lib/analytics";
import { addToWishlist } from "@lib/wishlist";

const PersonalCareProductCard = ({
  product,
  attributes,
  hidePriceAndAdd = false,
  hideDiscount = false,
  hideWishlistCompare = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { items, addItem, updateItemQuantity, inCart, getItem } = useCart();
  const { state } = useContext(UserContext) || {};
  const isWholesaler =
    state?.userInfo?.role &&
    state.userInfo.role.toString().toLowerCase() === "wholesaler";
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue, getNumberTwo } = useUtilsFunction();
  const router = useRouter();

  const currency = "₹";

  const handleAddItem = (p) => {
    if (p.stock < 1) return notifyError("Insufficient stock!");

    if (p?.variants?.length > 0) {
      setModalOpen(!modalOpen);
      return;
    }
    const { slug, variants, categories, description, ...updatedProduct } = product;

    const wholesalePriceValue =
      product?.wholePrice && Number(product.wholePrice) > 0
        ? Number(product.wholePrice)
        : null;
    const priceToUse =
      isWholesaler && wholesalePriceValue
        ? wholesalePriceValue
        : p.prices?.price || 0;

    const newItem = {
      ...updatedProduct,
      title: showingTranslateValue(p?.title),
      id: p._id,
      variant: p.prices,
      price: priceToUse,
      originalPrice: product.prices?.originalPrice,
      image: product.image?.[0] || product.images?.[0],
    };

    const minQty =
      isWholesaler && product?.minQuantity ? Number(product.minQuantity) : 1;
    addItem(newItem, minQty);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;

    try {
      const result = addToWishlist(product);
      if (!result.ok && result.reason === "exists") {
        notifyError("Product already in wishlist");
        return;
      }
      if (!result.ok) {
        notifyError("Failed to add to wishlist");
        return;
      }
      notifySuccess("Product added to wishlist");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      notifyError("Failed to add to wishlist");
    }
  };

  const imageSrc =
    product?.image?.[0] || product?.images?.[0] || "/images/default.webp";

  const titleText = showingTranslateValue(product?.title) || "";

  const basePrice = product?.isCombination
    ? product?.variants[0]?.price
    : product?.prices?.price;
  const wholesalePrice =
    product?.wholePrice && Number(product.wholePrice) > 0
      ? Number(product.wholePrice)
      : null;
  const currentPrice =
    isWholesaler && wholesalePrice ? wholesalePrice : basePrice;
  const discount = product?.isCombination
    ? product?.variants[0]?.discount
    : product?.prices?.discount;
  let originalPriceValue = product?.isCombination
    ? product?.variants[0]?.originalPrice
    : product?.prices?.originalPrice;

  if (!originalPriceValue && discount) {
    originalPriceValue = (basePrice || 0) + (discount || 0);
  }

  return (
    <>
      {modalOpen && (
        <ProductModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          product={product}
          currency={currency}
          attributes={attributes}
        />
      )}
      <div className="group relative flex flex-col w-full bg-[#0d0d12] rounded-2xl border border-white/10 hover:border-blue-500/50 shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden p-2 sm:p-2.5 justify-between">
        {/* Product Image Container */}
        <div
          onClick={() => {
            router.push(`/product/${product.slug}`);
            handleLogEvent(
              "product",
              `Mapped to ${titleText} product page`
            );
          }}
          className="relative w-full aspect-square flex items-center justify-center bg-[#13141b] rounded-xl overflow-hidden cursor-pointer mb-2"
        >
          {/* Discount Badge */}
          {!hideDiscount && !isWholesaler && (
            <div className="absolute top-1.5 left-1.5 z-10">
              <Discount product={product} />
            </div>
          )}

          {/* Stock Badge */}
          {product.stock < 1 && (
            <div className="absolute top-1.5 left-1.5 z-10">
              <Stock product={product} stock={product.stock} card />
            </div>
          )}

          {/* Wishlist Button - Top Right */}
          {!hideWishlistCompare && (
            <div className="absolute top-1.5 right-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleAddToWishlist}
                className="p-1.5 bg-black/70 backdrop-blur-sm text-white hover:text-red-400 rounded-full border border-white/10 hover:scale-110 active:scale-95 transition-all"
                aria-label="Add to wishlist"
              >
                <FiHeart className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* Centered Image */}
          <div className="relative w-full h-full flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform duration-300">
            {product?.image?.[0] || product?.images?.[0] ? (
              <ImageWithFallback
                src={imageSrc}
                alt={titleText}
                width={160}
                height={160}
                className="max-w-full max-h-full object-contain drop-shadow-md"
                style={{ width: "auto", height: "auto" }}
              />
            ) : (
              <Image
                src="/placeholder.png"
                width={160}
                height={160}
                style={{
                  objectFit: "contain",
                  width: "auto",
                  height: "auto",
                }}
                alt="product"
                className="max-w-full max-h-full drop-shadow-md"
              />
            )}
          </div>
        </div>

        {/* Info Content Section */}
        <div className="flex flex-col flex-grow justify-between text-left">
          <div>
            {/* Product Title (2-line clamp) */}
            <h2
              className="text-xs sm:text-[13px] font-bold text-white line-clamp-2 leading-snug cursor-pointer hover:text-blue-400 transition-colors mb-2 min-h-[2rem]"
              onClick={() => router.push(`/product/${product.slug}`)}
              title={titleText}
            >
              {titleText}
            </h2>
          </div>

          {/* Bottom Row: Price (left) + ADD Button (right) */}
          {!hidePriceAndAdd && (
            <div className="flex items-center justify-between w-full mt-auto pt-1 gap-2">
              {/* Price */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-white">
                    {currency}
                    {getNumberTwo(Math.max(0, currentPrice))}
                  </span>
                  {!isWholesaler && originalPriceValue > currentPrice && (
                    <span className="text-[10px] sm:text-[11px] text-gray-500 line-through font-normal">
                      {currency}
                      {getNumberTwo(originalPriceValue)}
                    </span>
                  )}
                </div>
                {isWholesaler && wholesalePrice && (
                  <span className="text-[9px] text-gray-400 truncate">
                    Min {product.minQuantity || 1}
                  </span>
                )}
              </div>

              {/* Action Button: ADD or Quantity Counter */}
              <div className="shrink-0">
                {inCart(product._id) ? (
                  (() => {
                    const item = getItem(product._id);
                    return (
                      item && (
                        <div
                          key={item.id}
                          className="h-7 sm:h-8 flex items-center justify-between px-2 bg-blue-600 text-white rounded-lg font-bold text-xs shadow-sm gap-2"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const minQty =
                                isWholesaler && product?.minQuantity
                                  ? Number(product.minQuantity)
                                  : 1;
                              if (
                                isWholesaler &&
                                product?.minQuantity &&
                                item.quantity <= minQty
                              ) {
                                notifyError(`Minimum quantity is ${minQty}`);
                                return;
                              }
                              updateItemQuantity(item.id, item.quantity - 1);
                            }}
                            disabled={
                              isWholesaler &&
                              product?.minQuantity &&
                              item.quantity <= Number(product.minQuantity)
                            }
                            className="hover:scale-110 active:scale-90 transition-transform p-0.5"
                            aria-label="Decrease quantity"
                          >
                            <IoRemove className="w-3 h-3 stroke-[2]" />
                          </button>
                          <span className="text-xs font-black px-1">
                            {item.quantity}
                          </span>
                          <button
                            className="hover:scale-110 active:scale-90 transition-transform p-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              item?.variants?.length > 0
                                ? handleAddItem(item)
                                : handleIncreaseQuantity({
                                    ...item,
                                    stock: product.stock,
                                  });
                            }}
                            aria-label="Increase quantity"
                          >
                            <IoAdd className="w-3 h-3 stroke-[2]" />
                          </button>
                        </div>
                      )
                    );
                  })()
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddItem(product);
                    }}
                    type="button"
                    className="border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white bg-blue-500/10 h-7 sm:h-8 px-3.5 sm:px-4 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm shadow-blue-900/20"
                  >
                    ADD
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(PersonalCareProductCard), {
  ssr: false,
});
