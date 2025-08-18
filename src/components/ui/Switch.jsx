export function Switch({ checked, className = "", onChange, ...props }) {
    return (
      <label className={`flex items-center cursor-pointer ${className}`} {...props}>
        <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
        <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${checked ? "bg-blue-500" : "bg-gray-300"}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${checked ? "translate-x-5" : "translate-x-0"}`}></div>
        </div>
      </label>
    );
  }
  