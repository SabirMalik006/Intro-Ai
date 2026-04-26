// components/UpcomingInterviews.js
export default function UpcomingInterviews() {
    const upcoming = [
      { id: 1, name: "Emma Wilson", role: "UX Designer", time: "Today, 3:30 PM", duration: "45 min", type: "Technical" },
      { id: 2, name: "James Lee", role: "Mobile Developer", time: "Tomorrow, 11:00 AM", duration: "60 min", type: "Behavioral" },
      { id: 3, name: "Lisa Wong", role: "QA Engineer", time: "Nov 18, 2:00 PM", duration: "30 min", type: "Technical" },
    ];
  
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Upcoming Interviews</h3>
          <button className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
            View Calendar
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
  
        <div className="space-y-4">
          {upcoming.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📅</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-slate-100">{item.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-slate-300">{item.role}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="inline-flex items-center text-sm text-gray-500 dark:text-slate-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.duration}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{item.time}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      Reschedule
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300">
                      Start
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Add Interview Button */}
        <button className="w-full mt-6 py-3.5 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-gray-600 dark:text-slate-300 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Schedule New Interview
        </button>
      </div>
    );
  }