export function Button({ children, className = "", ...props }) {
    return (
      <button
        className={`px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  