export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '',
  disabled = false
}) {
  const baseStyles = "font-medium rounded focus:outline-none focus:ring-2 px-4 py-2";
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300",
  };
  
  const styleClasses = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={styleClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
}