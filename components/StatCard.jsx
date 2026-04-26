// components/StatCard.js
export default function StatCard({ title, value, change, icon, color = "blue" }) {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-100 text-blue-600",
      teal: "bg-teal-50 border-teal-100 text-teal-600",
      amber: "bg-amber-50 border-amber-100 text-amber-600",
      purple: "bg-purple-50 border-purple-100 text-purple-600",
      green: "bg-green-50 border-green-100 text-green-600",
    };
  
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
            <span className="text-2xl">{icon}</span>
          </div>
          {change && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              change.startsWith('+') 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
            }`}>
              {change}
            </div>
          )}
        </div>
        
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-1">{value}</div>
          <p className="text-gray-600 dark:text-slate-300 text-sm">{title}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center text-xs text-gray-500 dark:text-slate-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last 30 days
          </div>
        </div>
      </div>
    );
  }