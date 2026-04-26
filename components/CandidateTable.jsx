// components/CandidateTable.js
export default function CandidateTable({ search }) {
    const candidates = [
      { id: 1, name: "John Smith", role: "Frontend Developer", status: "hired", score: 8.5, lastInterview: "Nov 20, 2023" },
      { id: 2, name: "Sarah Chen", role: "Data Scientist", status: "interview", score: 7.8, lastInterview: "Nov 22, 2023" },
      { id: 3, name: "Mike Rodriguez", role: "DevOps Engineer", status: "review", score: 6.2, lastInterview: "Nov 25, 2023" },
      { id: 4, name: "Priya Patel", role: "Product Manager", status: "hired", score: 9.2, lastInterview: "Nov 14, 2023" },
      { id: 5, name: "David Kim", role: "Backend Engineer", status: "rejected", score: 5.5, lastInterview: "Nov 13, 2023" },
    ];
  
    const getStatusColor = (status) => {
      switch (status) {
        case "hired": return "bg-green-100 text-green-700";
        case "interview": return "bg-blue-100 text-blue-700";
        case "review": return "bg-amber-100 text-amber-700";
        case "rejected": return "bg-red-100 text-red-700";
        default: return "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200";
      }
    };
  
    const filteredCandidates = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.role.toLowerCase().includes(search.toLowerCase())
    );
  
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-slate-100">Candidate</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-slate-100">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-slate-100">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-slate-100">Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-slate-100">Last Interview</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-700 font-semibold">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-slate-100">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-300">{candidate.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-amber-500 mr-1">⭐</span>
                      <span className="font-medium">{candidate.score}/10</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-300">{candidate.lastInterview}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }