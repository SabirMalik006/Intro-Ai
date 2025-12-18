// components/AnalyticsChart.js
"use client";

export default function AnalyticsChart({ type, title, timeRange }) {
  // Mock data based on type and timeRange
  const getChartData = () => {
    if (type === "interviews") {
      return [45, 52, 38, 65, 72, 58, 49, 61, 55, 68, 75, 62];
    } else {
      return [10, 25, 35, 20, 10]; // Score distribution
    }
  };

  const data = getChartData();
  const maxValue = Math.max(...data);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-600">Last {timeRange}</span>
      </div>
      
      <div className="h-64">
        {type === "interviews" ? (
          <div className="h-full flex items-end space-x-2">
            {data.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-teal-500 to-blue-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(value / maxValue) * 100}%` }}
                />
                <span className="text-xs text-gray-500 mt-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-end space-x-4 justify-center">
            {data.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-16 bg-gradient-to-t from-teal-500 to-blue-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(value / maxValue) * 100}%` }}
                />
                <span className="text-xs text-gray-500 mt-2">
                  {["0-2", "3-5", "6-7", "8-9", "10"][index]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}