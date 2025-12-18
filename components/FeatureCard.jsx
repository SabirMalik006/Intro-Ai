// components/FeatureCard.js - Equal Height with Perfect Centering
export default function FeatureCard({ icon, title, description, gradient }) {
    return (
      <div className="group relative p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100  transition-all duration-300 bg-white flex flex-col items-center text-center min-h-[400px]">
        
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Main content container - perfectly centered */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
          
          {/* Icon container - perfectly centered */}
          <div className="mb-8 flex justify-center">
            <div className={`p-5 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center w-20 h-20 shadow-lg`}>
              <span className="text-3xl">{icon}</span>
            </div>
          </div>
          
          {/* Title - centered with max width */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 max-w-xs mx-auto">
            {title}
          </h3>
          
          {/* Description - centered with max width for perfect line length */}
          <p className="text-gray-600 leading-relaxed mb-8 max-w-xs mx-auto">
            {description}
          </p>
          
          {/* CTA Link - appears on hover */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
            <a 
              href="#" 
              className="inline-flex items-center text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Learn more
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
          
        </div>
      </div>
    );
  }