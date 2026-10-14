const myTheme = {
  // Alert
  alert: {
    base: "p-4 pl-12 relative rounded-xl leading-5",
    withClose: "pr-12",
    success: "bg-store-50 text-store-900 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border dark:border-emerald-500/20",
    danger: "bg-red-50 text-red-900 dark:bg-rose-950/40 dark:text-rose-300 dark:border dark:border-rose-500/20",
    warning: "bg-yellow-50 text-yellow-900 dark:bg-amber-950/40 dark:text-amber-300 dark:border dark:border-amber-500/20",
    neutral: "bg-gray-50 text-gray-800 dark:bg-zinc-900 dark:text-zinc-200 dark:border dark:border-white/10",
    info: "bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:border dark:border-blue-500/20",
    icon: {
      base: "h-5 w-5",
      success: "text-store-400 dark:text-emerald-400",
      danger: "text-red-400 dark:text-rose-400",
      warning: "text-yellow-400 dark:text-amber-400",
      neutral: "text-gray-400 dark:text-zinc-400",
      info: "text-blue-400 dark:text-blue-400",
    },
  },
  // Pagination
  pagination: {
    base: "flex flex-col justify-between text-xs sm:flex-row text-gray-600 dark:text-zinc-400",
  },
  // TableFooter
  tableFooter: {
    base: "px-4 py-3 border-t border-gray-200 dark:border-white/10 bg-white text-gray-500 dark:text-zinc-400 dark:bg-black",
  },
  // TableRow
  tableRow: {
    base: "",
  },
  // TableHeader
  tableHeader: {
    base: "text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-white/10 bg-gray-100 dark:text-zinc-400 dark:bg-zinc-950",
  },
  // TableContainer
  tableContainer: {
    base: "w-full overflow-hidden border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-black",
  },
  // TableCell
  tableCell: {
    base: "px-4 py-3",
  },
  // TableBody
  tableBody: {
    base: "bg-white divide-y divide-gray-100 dark:divide-white/10 dark:bg-black text-gray-800 dark:text-zinc-200",
  },
  // DropdownItem
  dropdownItem: {
    base: "mb-1 last:mb-0",
  },
  // Dropdown
  dropdown: {
    base: "absolute w-56 p-1.5 mt-2 text-gray-600 bg-white dark:bg-zinc-950 dark:border-white/10 border border-gray-100 rounded-2xl shadow-2xl min-w-max-content",
    align: {
      left: "left-0",
      right: "right-0",
    },
  },
  // Avatar
  avatar: {
    base: "relative rounded-full inline-block",
    size: {
      large: "w-10 h-10",
      regular: "w-8 h-8",
      small: "w-6 h-6",
    },
  },
  // Modal
  modal: {
    base: "w-full px-6 py-4 overflow-hidden bg-white rounded-t-2xl dark:bg-zinc-950 border border-transparent dark:border-white/10 sm:rounded-2xl sm:m-4 sm:max-w-xl custom-modal text-gray-900 dark:text-white",
  },
  // ModalBody
  modalBody: {
    base: "mb-6 text-sm text-gray-800 dark:text-zinc-300",
  },
  // ModalFooter
  modalFooter: {
    base: "flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex-row bg-gray-50 dark:bg-zinc-900/60 border-t border-transparent dark:border-white/10",
  },
  // ModalHeader
  modalHeader: {
    base: "mt-4 mb-2 text-lg font-bold text-gray-900 dark:text-white",
  },
  // Badge
  badge: {
    base: "inline-flex px-2.5 py-0.5 text-xs font-semibold leading-5 rounded-full",
    success: "text-store-600 bg-store-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border dark:border-emerald-500/20",
    danger: "text-red-500 bg-red-100 dark:text-rose-400 dark:bg-rose-500/10 dark:border dark:border-rose-500/20",
    warning: "text-yellow-600 bg-yellow-100 dark:text-amber-400 dark:bg-amber-500/10 dark:border dark:border-amber-500/20",
    neutral: "text-gray-500 bg-gray-100 dark:text-zinc-300 dark:bg-zinc-800 dark:border dark:border-white/10",
    primary: "text-blue-500 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:border dark:border-blue-500/20",
  },
  // Backdrop
  backdrop: {
    base: "fixed inset-0 z-40 flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center",
  },
  // Textarea
  textarea: {
    base: "block w-full border bg-gray-100 focus:bg-white text-sm dark:text-white rounded-xl focus:outline-none p-3 dark:bg-zinc-900 dark:border-white/10 dark:focus:border-white/30",
    active:
      "border border-gray-200 dark:border-white/10 dark:focus:border-white/30 dark:bg-zinc-900",
    disabled: "cursor-not-allowed opacity-50 bg-gray-300 dark:bg-zinc-900",
    valid:
      "border-store-600 dark:bg-zinc-900 focus:border-store-400 dark:focus:border-store-400",
    invalid:
      "border-red-600 dark:bg-zinc-900 focus:border-red-400 dark:focus:border-red-400",
  },
  // Select
  select: {
    base: "block w-full h-12 border bg-gray-100 px-3 py-1 text-sm dark:text-white focus:outline-none rounded-xl form-select focus:bg-white dark:bg-zinc-900 dark:border-white/10 dark:focus:bg-zinc-800",
    active:
      "focus:border-gray-200 border-gray-200 dark:border-white/10 focus:shadow-none dark:focus:border-white/30 dark:bg-zinc-900",
    select: "leading-5",
    disabled: "cursor-not-allowed opacity-50 bg-gray-300 dark:bg-zinc-900",
    valid:
      "border-store-600 dark:bg-zinc-900 focus:border-store-400 dark:focus:border-store-400",
    invalid:
      "border-red-600 dark:bg-zinc-900 focus:border-red-400 dark:focus:border-red-400",
  },
  // Label
  label: {
    base: "block text-sm text-gray-800 dark:text-zinc-300 font-medium",
    check: "inline-flex items-center",
    disabled: "opacity-50 cursor-not-allowed",
  },
  // Input
  input: {
    base: "block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-white leading-5 rounded-xl bg-gray-100 focus:bg-white dark:bg-zinc-900 dark:border-white/10 dark:focus:bg-zinc-800",
    active:
      "focus:border-gray-200 border-gray-200 dark:border-white/10 dark:focus:border-white/30 dark:bg-zinc-900",
    disabled:
      "border border-gray-400 cursor-not-allowed opacity-50 bg-gray-300 dark:bg-zinc-900",
    valid:
      "border-store-600 dark:bg-zinc-900 focus:border-store-400 dark:focus:border-store-400",
    invalid:
      "border-red-600 dark:bg-zinc-900 focus:border-red-400 dark:focus:border-red-400",
    radio: "text-store-600 form-radio focus:border-store-400 focus:outline-none",
    checkbox:
      "text-store-600 form-checkbox focus:border-store-500 focus:outline-none rounded",
  },
  // HelperText
  helperText: {
    base: "text-xs mt-1",
    valid: "text-store-600 dark:text-emerald-400",
    invalid: "text-red-600 dark:text-rose-400",
  },
  // Card
  card: {
    base: "min-w-0 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10",
    default: "bg-white dark:bg-zinc-950",
  },
  cardBody: {
    base: "p-5",
  },
  // Button
  button: {
    base: "align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-all duration-200 font-semibold focus:outline-none rounded-xl",
    block: "w-full",
    size: {
      larger: "px-10 py-4 rounded-xl",
      large: "px-5 py-3 rounded-xl",
      regular: "px-4 py-2.5 rounded-xl text-sm",
      small: "px-3 py-1.5 rounded-lg text-sm",
      icon: {
        larger: "p-4 rounded-xl",
        large: "p-3 rounded-xl",
        regular: "p-2.5 rounded-xl",
        small: "p-2 rounded-lg",
      },
      pagination: "px-3 py-1 rounded-lg text-xs",
    },
    icon: {
      larger: "h-5 w-5",
      large: "h-5 w-5",
      regular: "h-5 w-5",
      small: "h-3.5 w-3.5",
      left: "mr-2 -ml-1",
      right: "ml-2 -mr-1",
    },
    primary: {
      base: "text-white bg-blue-600 border border-transparent hover:bg-blue-500 active:bg-blue-700 shadow-md",
      active: "active:bg-blue-700 hover:bg-blue-500",
      disabled: "opacity-50 cursor-not-allowed",
    },
    modern: {
      base: "text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 active:bg-black",
      active: "active:bg-black hover:bg-zinc-800",
      disabled: "opacity-50 cursor-not-allowed",
    },
    outline: {
      base: "text-gray-700 border-gray-200 border dark:text-zinc-300 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none",
      active:
        "rounded-xl border bg-gray-200 border-gray-200 px-4 w-full mr-3 flex items-center justify-center cursor-pointer h-12",
      disabled: "opacity-50 cursor-not-allowed bg-gray-300",
    },
    delete: {
      base: "text-rose-500 border-rose-200 border dark:text-rose-400 dark:border-rose-500/20 hover:bg-rose-500/10 focus:outline-none",
      active:
        "rounded-xl border border-rose-200 px-4 w-full mr-3 flex items-center justify-center cursor-pointer h-12 bg-rose-500 text-white",
      disabled: "opacity-50 cursor-not-allowed bg-rose-300",
    },

    link: {
      base: "text-gray-600 dark:text-zinc-400 focus:outline-none border border-transparent hover:text-black dark:hover:text-white",
      active:
        "active:bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:text-white",
      disabled: "opacity-50 cursor-not-allowed",
    },
    dropdownItem: {
      base: "inline-flex items-center cursor-pointer w-full px-3 py-2 text-sm font-medium transition-all duration-150 rounded-xl hover:bg-gray-100 hover:text-black dark:hover:bg-white/10 dark:text-zinc-300 dark:hover:text-white",
    },
  },
};
export default myTheme;
