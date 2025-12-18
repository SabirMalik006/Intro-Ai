// components/PricingCard.js
export default function PricingCard({ plan, price, period, description, features, highlighted }) {
    return (
      <div className={`relative rounded-2xl p-8 border-2 ${
        highlighted 
          ? 'border-teal-500 bg-gradient-to-b from-white to-teal-50 shadow-xl' 
          : 'border-gray-200 bg-white'
      }`}>
        {highlighted && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="px-4 py-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white text-sm font-bold rounded-full">
              Most Popular
            </span>
          </div>
        )}
        
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan}</h3>
          <div className="flex items-baseline mb-2">
            <span className="text-5xl font-bold text-gray-900">{price}</span>
            {period && <span className="text-gray-600 ml-2">{period}</span>}
          </div>
          <p className="text-gray-600">{description}</p>
        </div>
        
        <ul className="space-y-4 mb-10">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-teal-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <a
          href="/register"
          className={`block w-full py-3 px-6 rounded-xl text-center font-semibold transition-all duration-300 ${
            highlighted
              ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:shadow-lg hover:shadow-teal-200'
              : 'border-2 border-gray-300 text-gray-700 hover:border-teal-300 hover:bg-teal-50'
          }`}
        >
          Get Started
        </a>
      </div>
    );
  }