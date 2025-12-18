// components/Testimonial.js - Updated with Professional Colors
export default function Testimonial({ quote, name, role, avatar }) {
    return (
      <div className="p-8 rounded-2xl border border-gray-200 bg-white hover:shadow-xl hover:border-teal-200 transition-all duration-300 flex flex-col items-center text-center h-full">
        
        <div className="mb-8 w-full">
          <div className="flex justify-center text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 mx-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          <p className="text-gray-700 text-lg italic px-2 leading-relaxed max-w-xs mx-auto">
            "{quote}"
          </p>
        </div>
        
        <div className="mt-auto flex flex-col items-center w-full pt-6 border-t border-gray-100">
          <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center font-bold text-gray-700 text-lg mb-4">
            {avatar}
          </div>
          
          <div className="text-center">
            <h4 className="font-bold text-gray-900 text-lg mb-1">{name}</h4>
            <p className="text-gray-600 text-sm">{role}</p>
          </div>
        </div>
      </div>
    );
  }