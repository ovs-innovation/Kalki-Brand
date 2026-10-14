import React, { useState, useRef, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IoReturnUpBackOutline,
  IoArrowForward,
  IoBagHandle,
  IoWalletSharp,
  IoClose,
  IoChevronForward,
  IoLocationOutline
} from "react-icons/io5";
import { FiLoader } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { ImCreditCard } from "react-icons/im";
import useTranslation from "next-translate/useTranslation";
import { getUserSession } from "@lib/auth";

//internal import

import Layout from "@layout/Layout";
import Label from "@components/form/Label";
import Error from "@components/form/Error";
import CartItem from "@components/cart/CartItem";
import InputArea from "@components/form/InputArea";
import useGetSetting from "@hooks/useGetSetting";
import InputShipping from "@components/form/InputShipping";
import InputPayment from "@components/form/InputPayment";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import useUtilsFunction from "@hooks/useUtilsFunction";
import SettingServices from "@services/SettingServices";
import CustomerServices from "@services/CustomerServices";
import LocationServices from "@services/LocationServices";
import SwitchToggle from "@components/form/SwitchToggle";
import { notifySuccess, notifyError } from "@utils/toast";
import { UserContext } from "@context/UserContext";
import { isProfileComplete, getDisplayEmail } from "@utils/profileAuth";

const Checkout = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const formRef = useRef(null);
  const [portalReady, setPortalReady] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    phone: "",
    addressType: "Home",
    isDefault: false
  });
  const userInfo = getUserSession();
  const { showingTranslateValue, currency } = useUtilsFunction();

  useEffect(() => {
    if (!userInfo?.token) {
      router.replace("/auth/login?redirectUrl=checkout");
      return;
    }
  }, [userInfo, router]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!showAddressModal) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showAddressModal]);
  const { storeCustomizationSetting } = useGetSetting();
  const { state } = useContext(UserContext) || {};
  const isWholesaler = state?.userInfo?.role && state.userInfo.role.toString().toLowerCase() === "wholesaler";

  const { data: storeSetting } = useQuery({
    queryKey: ["storeSetting"],
    queryFn: async () => await SettingServices.getStoreSetting(),
    staleTime: 4 * 60 * 1000, // Api request after 4 minutes
  });

  // Fetch user's shipping addresses
  const { data: shippingAddressesResponse, refetch: refetchAddresses } = useQuery({
    queryKey: ["shippingAddresses", userInfo?._id || userInfo?.id],
    queryFn: async () => {
      const uId = userInfo?._id || userInfo?.id;
      if (!uId) return null;
      const response = await CustomerServices.getShippingAddress({ userId: uId });
      return response?.shippingAddress || [];
    },
    enabled: !!(userInfo?._id || userInfo?.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Normalize shippingAddresses to always be an array
  const shippingAddresses = Array.isArray(shippingAddressesResponse)
    ? shippingAddressesResponse
    : shippingAddressesResponse
      ? [shippingAddressesResponse]
      : [];

  // Set default selected address on load
  React.useEffect(() => {
    if (shippingAddresses && shippingAddresses.length > 0 && !selectedAddress) {
      const defaultAddress = shippingAddresses.find(addr => addr.isDefault) || shippingAddresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [shippingAddresses]);

  const {
    error,
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    register,
    errors,
    watch,
    showCard,
    setShowCard,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountAmount,
    shippingCost,
    isCheckoutSubmit,
    useExistingAddress,
    hasShippingAddress,
    isCouponAvailable,
    availableCoupons,
    selectedCouponCode,
    setSelectedCouponCode,
    handleDefaultShippingAddress,
    taxSummary,
    setValue,
    isCouponApplied,
    handleRemoveCoupon,
  } = useCheckoutSubmit(storeSetting);

  const selectedPaymentMethod = watch("paymentMethod");

  // Update form values when selected address changes
  React.useEffect(() => {
    if (selectedAddress && setValue) {
      const nameParts = (selectedAddress.name || "").split(" ");
      setValue("firstName", nameParts[0] || "");
      setValue("lastName", nameParts.slice(1).join(" ") || "");
      setValue("email", getDisplayEmail(userInfo) || "");
      setValue("contact", selectedAddress.phone || "");
      setValue("address", selectedAddress.address || "");
      setValue("address2", "");
      setValue("city", selectedAddress.city || "");
      setValue("state", selectedAddress.country || "");
      setValue("country", selectedAddress.country || "India");
      setValue("zipCode", selectedAddress.zipCode || "");
    }
  }, [selectedAddress, setValue, userInfo]);

  // Calculate totals for order summary
  const calculateTotals = () => {
    // For wholesalers, no discount calculation - only show subtotal
    if (isWholesaler) {
      return {
        totalMRP: 0,
        totalDiscount: 0,
        subtotal: cartTotal,
        taxAmount: taxSummary?.exclusiveTax || 0,
        total: parseFloat(total)
      };
    }

    let totalMRP = 0;
    let totalDiscount = 0;

    items.forEach(item => {
      const originalPrice = item.originalPrice || item.mrp || item.prices?.original || (item.price * 1.2);
      const currentPrice = item.price || item.prices?.sale || 0;
      const quantity = item.quantity || 1;

      totalMRP += originalPrice * quantity;
      totalDiscount += (originalPrice - currentPrice) * quantity;
    });

    return {
      totalMRP,
      totalDiscount,
      subtotal: cartTotal,
      taxAmount: taxSummary?.exclusiveTax || 0,
      total: parseFloat(total)
    };
  };

  // Handle address form input changes
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Auto fetch location by pincode
  React.useEffect(() => {
    const fetchLocation = async () => {
      if (addressForm.zipCode && addressForm.zipCode.length === 6 && /^\d+$/.test(addressForm.zipCode)) {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${addressForm.zipCode}`);
          const data = await response.json();
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const postOffice = data[0].PostOffice[0];
            setAddressForm(prev => ({
              ...prev,
              city: postOffice.District || postOffice.Block || postOffice.Name,
              country: postOffice.State
            }));
            notifySuccess(`Location fetched: ${postOffice.District || postOffice.Block || postOffice.Name}, ${postOffice.State}`);
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      fetchLocation();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [addressForm.zipCode]);

  // Handle Use Current Location
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      notifyError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const geocodeData = await LocationServices.getReverseGeocode({ lat: latitude, lng: longitude });

          if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
            const result = geocodeData.results[0];

            // Extract address components
            let street = "";
            let city = "";
            let state = "";
            let zip = "";

            // Street address parts
            const streetNumber = result.address_components.find(c => c.types.includes("street_number"))?.long_name || "";
            const route = result.address_components.find(c => c.types.includes("route"))?.long_name || "";
            const sublocality = result.address_components.find(c => c.types.includes("sublocality"))?.long_name || "";

            street = [streetNumber, route, sublocality].filter(Boolean).join(", ");

            // If street is still empty, use formatted_address part
            if (!street) {
              street = result.formatted_address.split(",")[0];
            }

            city = result.address_components.find(c => c.types.includes("locality"))?.long_name || "";
            state = result.address_components.find(c => c.types.includes("administrative_area_level_1"))?.long_name || "";
            zip = result.address_components.find(c => c.types.includes("postal_code"))?.long_name || "";

            setAddressForm(prev => ({
              ...prev,
              address: street || prev.address,
              city: city || prev.city,
              country: state || prev.country,
              zipCode: zip || prev.zipCode
            }));

            notifySuccess("Location updated successfully!");
          } else {
            notifyError("Unable to fetch current location. Please try again.");
          }
        } catch (error) {
          console.error("Location error:", error);
          notifyError("Unable to fetch current location. Please try again.");
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        setIsLocationLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          notifyError("Location permission denied. Please allow location access.");
        } else {
          notifyError("Unable to fetch current location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Open modal for adding new address
  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      name: userInfo?.name || "",
      address: "",
      city: "",
      country: "",
      zipCode: "",
      phone: userInfo?.phone || "",
      addressType: "Home",
      isDefault: shippingAddresses.length === 0
    });
    setShowAddressModal(true);
  };

  // Open modal for editing address
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name || "",
      address: address.address || "",
      city: address.city || "",
      country: address.country || "",
      zipCode: address.zipCode || "",
      phone: address.phone || "",
      addressType: address.addressType || "Home",
      isDefault: address.isDefault || false
    });
    setShowAddressModal(true);
  };

  // Handle address submission (add or update)
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const uId = userInfo?._id || userInfo?.id;
    try {
      if (!userInfo || !uId) {
        notifyError("User ID not found in session");
        return;
      }

      let response;
      if (editingAddress && editingAddress._id) {
        // Update existing address
        response = await CustomerServices.updateShippingAddress({
          userId: uId,
          shippingId: editingAddress._id,
          shippingAddressData: addressForm
        });
      } else {
        // Add new address
        response = await CustomerServices.addShippingAddress({
          userId: uId,
          shippingAddressData: addressForm
        });
      }

      if (response.success || response.message) {
        setShowAddressModal(false);
        setEditingAddress(null);
        // Reset form
        setAddressForm({
          name: "",
          address: "",
          city: "",
          country: "",
          zipCode: "",
          phone: "",
          addressType: "Home",
          isDefault: false
        });
        // Refetch addresses to get the latest
        await refetchAddresses();
        // If this was set as default or is first address, select it
        if (addressForm.isDefault || shippingAddresses.length === 0) {
          const updatedResponse = await CustomerServices.getShippingAddress({ userId: uId });
          const updatedAddresses = Array.isArray(updatedResponse?.shippingAddress)
            ? updatedResponse.shippingAddress
            : [];
          const newDefault = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[updatedAddresses.length - 1];
          if (newDefault) setSelectedAddress(newDefault);
        }
        notifySuccess(editingAddress ? "Address updated successfully" : "Address added successfully");
      } else {
        notifyError(response.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      notifyError(error?.response?.data?.message || error?.message || "Failed to save address");
    }
  };

  // Handle address deletion
  const handleDeleteAddress = async (addressId) => {


    const uId = userInfo?._id || userInfo?.id;
    try {
      const response = await CustomerServices.deleteShippingAddress({
        userId: uId,
        shippingId: addressId
      });

      if (response.message || response.success) {
        await refetchAddresses();
        // If deleted address was selected, select first available
        if (selectedAddress?._id === addressId) {
          const updatedResponse = await CustomerServices.getShippingAddress({ userId: uId });
          const updatedAddresses = Array.isArray(updatedResponse?.shippingAddress)
            ? updatedResponse.shippingAddress
            : [];
          if (updatedAddresses.length > 0) {
            setSelectedAddress(updatedAddresses[0]);
          } else {
            setSelectedAddress(null);
          }
        }
        notifySuccess("Address deleted successfully");
      } else {
        notifyError(response.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      notifyError(error?.response?.data?.message || error?.message || "Failed to delete address");
    }
  };

  const totals = calculateTotals();

  return (
    <>
      <Layout title="Checkout" description="this is checkout page">
        <div className="checkout-pure-black mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10 bg-black text-white">
          <div className="py-6 sm:py-8 lg:py-10 w-full flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
            <div className="w-full lg:w-3/5 flex flex-col min-w-0">
              <div>
                <form ref={formRef} onSubmit={handleSubmit(submitHandler)}>
                  {hasShippingAddress && (
                    <div className="flex justify-end my-2">
                      <SwitchToggle
                        id="shipping-address"
                        title="Use Default Shipping Address"
                        processOption={useExistingAddress}
                        handleProcess={handleDefaultShippingAddress}
                      />
                    </div>
                  )}

                  {/* Delivery Address Section */}
                  <div className="form-group">
                    <div className="checkout-card bg-black border border-white/10 rounded-2xl p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
                          Select Delivery Address
                        </h3>
                        <button
                          type="button"
                          onClick={handleAddAddress}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/40 text-xs font-medium text-blue-400 hover:bg-blue-500/10 hover:border-blue-500 transition-all shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Address
                        </button>
                      </div>

                      {shippingAddresses && shippingAddresses.length > 0 ? (
                        <div className="space-y-3 max-h-[320px] overflow-y-auto scrollbar-hide">
                          {shippingAddresses.map((address) => {
                            const locationText = `${address.city || ''}${address.city && address.zipCode ? ', ' : ''}${address.zipCode || ''}`;
                            const locationDisplay = locationText.length > 25 ? locationText.substring(0, 25) + '..' : locationText;
                            const fullAddress = `${address.address || ''}, ${address.city || ''}${address.city && address.country ? ', ' : ''}${address.country || ''}.`;

                            const isSelected = selectedAddress?._id === address._id || selectedAddress?.id === address.id;

                            return (
                              <div
                                key={address._id || address.id || Math.random()}
                                onClick={() => {
                                  setSelectedAddress(address);
                                  const nameParts = (address.name || "").split(" ");
                                  setValue("firstName", nameParts[0] || "");
                                  setValue("lastName", nameParts.slice(1).join(" ") || "");
                                  setValue("email", getDisplayEmail(userInfo) || "");
                                  setValue("contact", address.phone || "");
                                  setValue("address", address.address || "");
                                  setValue("address2", "");
                                  setValue("city", address.city || "");
                                  setValue("state", address.country || "");
                                  setValue("country", address.country || "India");
                                  setValue("zipCode", address.zipCode || "");
                                }}
                                className={`checkout-card rounded-xl p-4 cursor-pointer transition-all border ${
                                  isSelected
                                    ? "border-blue-500/60 bg-blue-500/[0.03] ring-1 ring-blue-500/30"
                                    : "border-white/10 hover:border-white/25 bg-black"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3 flex-1 min-w-0">
                                    {/* Custom indicator */}
                                    <div className="flex-shrink-0 mt-0.5">
                                      <div
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                          isSelected ? "border-blue-500" : "border-neutral-600"
                                        }`}
                                      >
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                      </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      {isSelected && (
                                        <div className="flex items-center gap-1.5 mb-1">
                                          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                                            Deliver to
                                          </span>
                                        </div>
                                      )}
                                      <p className="text-sm font-semibold text-white truncate">
                                        {address.name ? `${address.name} · ` : ""}{address.addressType || "Home"} <span className="text-neutral-400 font-normal">({locationDisplay})</span>
                                      </p>
                                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                                        {fullAddress}
                                      </p>
                                      {address.phone && (
                                        <p className="text-xs text-neutral-500 mt-1">
                                          Phone: {address.phone}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditAddress(address);
                                      }}
                                      className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                                      title="Edit address"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    {shippingAddresses.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteAddress(address._id || address.id);
                                        }}
                                        className="text-neutral-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                                        title="Delete address"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg className="mx-auto h-10 w-10 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="mt-2 text-sm text-neutral-300">No delivery address found</p>
                          <p className="text-xs text-neutral-500 mt-0.5">Add your delivery address to continue</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cart Items Section */}
                  <div className="form-group mt-8">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
                        Order Items {items?.length > 0 && <span className="text-neutral-400 font-normal">({items.length})</span>}
                      </h2>
                    </div>

                    <div className="space-y-2.5 max-h-[460px] overflow-y-auto scrollbar-hide">
                      {items.map((item) => (
                        <CartItem key={item.id} item={item} currency={currency} />
                      ))}

                      {isEmpty && (
                        <div className="text-center py-12 border border-white/10 rounded-2xl bg-black">
                          <span className="flex justify-center my-auto text-neutral-600 text-4xl">
                            <IoBagHandle />
                          </span>
                          <h2 className="font-medium text-sm pt-2 text-neutral-400">
                            No Item Added Yet!
                          </h2>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-2/5 flex flex-col self-start mt-8 lg:mt-0 lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto min-w-0">
              <div className="checkout-card border border-white/10 p-5 sm:p-6 lg:p-7 rounded-2xl bg-black">
                <h2 className="text-sm font-semibold text-white tracking-wide uppercase pb-4 border-b border-white/10">
                  {showingTranslateValue(storeCustomizationSetting?.checkout?.order_summary) || "Order Summary"}
                </h2>

                {/* Coupon Section - Hidden for wholesalers */}
                {!isWholesaler && (
                  <div className="py-4 border-b border-white/10 text-sm w-full">
                    <form className="w-full">
                      {couponInfo.couponCode ? (
                        <div className="relative bg-black border border-dashed border-blue-500/40 rounded-xl p-4 w-full">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[11px] uppercase font-semibold tracking-wider text-blue-400 flex items-center gap-1.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Coupon Applied
                              </span>
                              <span className="text-xl font-bold text-white tracking-wider uppercase font-mono">
                                {couponInfo.couponCode}
                              </span>
                            </div>
                            <div className="text-emerald-400 text-xs font-semibold pt-1">
                              Saved {currency}{discountAmount.toFixed(2)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                            <span className="text-xs text-neutral-400">Coupon discount active</span>
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <p className="text-[11px] text-neutral-500 italic">
                            * Applying a new coupon will replace the existing coupon.
                          </p>
                          {availableCoupons && availableCoupons.length > 0 ? (
                            <>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <select
                                    value={selectedCouponCode}
                                    onChange={(e) => setSelectedCouponCode(e.target.value)}
                                    className="w-full py-2.5 px-3 border border-white/15 rounded-xl text-xs bg-black text-white focus:outline-none focus:border-blue-500 appearance-none pr-8 cursor-pointer"
                                  >
                                    <option value="" className="bg-black text-neutral-400">
                                      {t("Select a coupon")}
                                    </option>
                                    {availableCoupons.map((coupon) => (
                                      <option key={coupon._id} value={coupon.couponCode} className="bg-black text-white">
                                        {coupon.couponCode} — Min {currency}{Number(coupon.minimumAmount || 0).toFixed(2)}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-neutral-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </div>

                                <button
                                  disabled={isCouponAvailable || !selectedCouponCode}
                                  onClick={handleCouponCode}
                                  type="button"
                                  className={`px-4 py-2.5 rounded-xl text-xs font-medium border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500 transition-all shrink-0 ${
                                    !selectedCouponCode ? "opacity-50 cursor-not-allowed" : ""
                                  }`}
                                >
                                  {isCouponAvailable ? "Applying..." : "Apply"}
                                </button>
                              </div>

                              {discountAmount > 0 && (
                                <p className="text-xs text-emerald-400 font-medium">
                                  You save {currency}{discountAmount.toFixed(2)} with this coupon.
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-neutral-500">
                              No coupons available for this order amount.
                            </p>
                          )}
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* Cost Rows */}
                <div className="py-4 space-y-2.5 text-sm border-b border-white/10">
                  {!isWholesaler && (
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Total MRP</span>
                      <span className="text-white font-medium">
                        {currency}{totals.totalMRP.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {!isWholesaler && totals.totalDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Total Discount</span>
                      <span className="font-semibold text-emerald-400">
                        -{currency}{totals.totalDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {taxSummary?.inclusiveTax > 0 && (
                    <div className="flex items-center justify-between text-neutral-400 text-xs">
                      <span>GST (included)</span>
                      <span className="text-neutral-300 font-medium">
                        {currency}{Number(taxSummary.inclusiveTax).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {taxSummary?.exclusiveTax > 0 && (
                    <div className="flex items-center justify-between text-neutral-400 text-xs">
                      <span>GST (added)</span>
                      <span className="text-neutral-300 font-medium">
                        {currency}{Number(taxSummary.exclusiveTax).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {!isWholesaler && discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Coupon Offer</span>
                      <span className="font-semibold text-emerald-400">
                        -{currency}{discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Shipping Cost</span>
                    <span className={`font-semibold ${shippingCost > 0 ? "text-white" : "text-emerald-400"}`}>
                      {shippingCost > 0 ? `${currency}${shippingCost.toFixed(2)}` : "FREE"}
                    </span>
                  </div>
                </div>

                {/* Estimated Payable */}
                <div className="py-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
                      Total Amount
                    </span>
                    <span className="text-base font-semibold text-white">
                      Estimated Payable
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-white tracking-tight">
                    {currency}{parseFloat(total).toFixed(2)}
                  </span>
                </div>

                {/* Payment & Place Order Section */}
                <div className="pt-2 space-y-4">
                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Payment Method
                    </label>
                    <div className="relative flex items-center rounded-xl border border-white/15 bg-black px-3.5 py-3 transition-all focus-within:border-blue-500">
                      <div className="mr-3 text-neutral-400">
                        <ImCreditCard className="w-5 h-5" />
                      </div>
                      <select
                        {...register("paymentMethod", {
                          required: "Payment Method is required!",
                        })}
                        className="w-full bg-transparent border-none text-sm font-medium text-white focus:outline-none focus:ring-0 cursor-pointer appearance-none pr-8 !bg-transparent"
                        defaultValue=""
                      >
                        <option value="" disabled className="bg-black text-neutral-400">
                          Select payment method
                        </option>
                        {storeSetting?.cod_status !== false && (
                          <option value="Cash" className="bg-black text-white">
                            Cash on Delivery (COD)
                          </option>
                        )}
                        {storeSetting?.razorpay_status !== false && (
                          <option value="RazorPay" className="bg-black text-white">
                            UPI / NetBanking / Cards (Razorpay)
                          </option>
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <Error errorMessage={errors.paymentMethod} />
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!agreeToTerms) {
                        notifyError("Please agree to Terms & Conditions to place order");
                        return;
                      }
                      if (formRef.current) {
                        formRef.current.requestSubmit();
                      }
                    }}
                    disabled={isEmpty || isCheckoutSubmit || !agreeToTerms}
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      isEmpty || isCheckoutSubmit || !agreeToTerms
                        ? "bg-neutral-900 text-neutral-500 border border-white/10 cursor-not-allowed checkout-btn-disabled"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-[0.99]"
                    }`}
                  >
                    {isCheckoutSubmit ? (
                      <span className="flex items-center justify-center">
                        <img
                          src="/loader/spinner.gif"
                          alt="Loading"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Processing...
                      </span>
                    ) : (
                      <span>
                        {showingTranslateValue(storeCustomizationSetting?.checkout?.place_order) || "Place order"}
                      </span>
                    )}
                  </button>

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="agreeToTerms" className="text-xs text-neutral-400 cursor-pointer leading-relaxed select-none">
                      By placing the order, you agree to our{" "}
                      <Link href="/terms" className="text-white hover:text-blue-400 underline underline-offset-2 transition-colors">
                        Terms & Conditions
                      </Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-white hover:text-blue-400 underline underline-offset-2 transition-colors">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* Address Modal — portal + high z-index so it sits above header/categories */}
      {portalReady && showAddressModal && createPortal(
        <div className="fixed inset-0 z-[10050]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowAddressModal(false)}
          />

          {/* Modal Panel - full screen on mobile, below header on desktop */}
          <div className="absolute right-0 w-full sm:max-w-md lg:max-w-lg flex flex-col top-16 h-[calc(100dvh-4rem)] lg:top-[148px] lg:h-[calc(100dvh-148px)]">
            <div className="flex flex-col flex-1 min-h-0 bg-black border-l border-white/10 shadow-2xl">
              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-black">
                <h3 className="text-base sm:text-lg font-semibold text-white pr-2">
                  {editingAddress ? "Edit Shipping Address" : "Add Shipping Address"}
                </h3>
                <button
                  type="button"
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                    setAddressForm({
                      name: "",
                      address: "",
                      city: "",
                      country: "",
                      zipCode: "",
                      phone: "",
                      addressType: "Home",
                      isDefault: false
                    });
                  }}
                >
                  <IoClose className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={handleAddressSubmit}
                className="flex flex-col flex-1 min-h-0 bg-black"
              >
                <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                  {/* Use Current Location Button */}
                  <div>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocationLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600/10 text-blue-400 border border-blue-500/30 rounded-xl font-medium text-xs hover:bg-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLocationLoading ? (
                        <FiLoader className="animate-spin" size={16} />
                      ) : (
                        <IoLocationOutline size={16} />
                      )}
                      {isLocationLoading ? "Fetching Location..." : "Use Current Location"}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                      Street Address
                    </label>
                    <textarea
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressChange}
                      required
                      rows={3}
                      className="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={addressForm.zipCode}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                        Address Type
                      </label>
                      <select
                        name="addressType"
                        value={addressForm.addressType}
                        onChange={handleAddressChange}
                        className="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="Home" className="bg-black text-white">Home</option>
                        <option value="Work" className="bg-black text-white">Work</option>
                        <option value="Other" className="bg-black text-white">Other</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-2 sm:pt-6">
                      <input
                        type="checkbox"
                        name="isDefault"
                        id="modalIsDefault"
                        checked={addressForm.isDefault}
                        onChange={handleAddressChange}
                        className="h-4 w-4 rounded border-white/20 bg-black text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="modalIsDefault" className="ml-2 block text-xs text-neutral-300 cursor-pointer">
                        Set as default address
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex-shrink-0 border-t border-white/10 px-4 sm:px-6 py-4 bg-black pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:space-x-3 sm:gap-0">
                    <button
                      type="button"
                      className="flex-1 px-4 py-2.5 border border-white/15 rounded-xl text-xs font-medium text-neutral-300 bg-black hover:bg-white/5 transition-colors"
                      onClick={() => setShowAddressModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 rounded-xl text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
                    >
                      {editingAddress ? "Update Address" : "Save Address"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Checkout), { ssr: false });
