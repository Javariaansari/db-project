const variants = {
  primary: "bg-gray-800 text-white hover:bg-gray-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({ children, onClick, type = "button", variant = "primary", disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={
        "px-3 py-1 text-sm border border-gray-400 disabled:opacity-50 " + variants[variant]
      }
    >
      {children}
    </button>
  );
}
