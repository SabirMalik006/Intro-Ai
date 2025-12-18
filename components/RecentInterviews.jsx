// components/RecentInterviews.js
export default function RecentInterviews() {
    const interviews = [
      { id: 1, name: "John Smith", role: "Frontend Developer", date: "Today, 10:30 AM", status: "completed", score: 8.5 },
      { id: 2, name: "Sarah Chen", role: "Data Scientist", date: "Yesterday, 2:15 PM", status: "completed", score: 7.8 },
      { id: 3, name: "Mike Rodriguez", role: "DevOps Engineer", date: "Nov 15, 11:00 AM", status: "pending", score: null },
      { id: 4, name: "Priya Patel", role: "Product Manager", date: "Nov 14, 4:45 PM", status: "completed", score: 9.2 },
      { id: 5, name: "David Kim", role: "Backend Engineer", date: "Nov 13, 3:30 PM", status: "completed", score: 7.5 },
    ];
  
    const getStatusColor = (status) => {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-700';
        case 'pending': return 'bg-amber-100 text-amber-700';
        case 'scheduled': return 'bg-blue-100 text-blue-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };
  
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Interviews</h3>
          <button className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
  
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div key={interview.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-teal-700 font-semibold">
                    {interview.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{interview.name}</h4>
                  <p className="text-sm text-gray-600">{interview.role}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500">{interview.date}</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                  </span>
                  {interview.score && (
                    <div className="flex items-center text-sm">
                      <span className="text-amber-500 mr-1">⭐</span>
                      <span className="font-medium">{interview.score}/10</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {interviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎤</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h4>
            <p className="text-gray-600 mb-4">Create your first AI-powered interview</p>
            <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium">
              + Create Interview
            </button>
          </div>
        ) : null}
      </div>
    );
  }