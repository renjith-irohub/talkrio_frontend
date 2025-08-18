export function Label({ children, className = "", ...props }) {
    return (
      <label className={`block text-gray-700 font-medium mb-1 ${className}`} {...props}>
        {children}
      </label>
    );
  }
  