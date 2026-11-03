
function DashboardCards() {
  const cards = [
    {
      label: 'Total Leads',
      value: 120,
      icon: '📋',
      color: 'border-blue-500'
    },
    {
      label: 'New Leads',
      value: 35,
      icon: '✨',
      color: 'border-yellow-500'
    },
    {
      label: 'Contacted',
      value: 50,
      icon: '📞',
      color: 'border-purple-500'
    },
    {
      label: 'Won Leads',
      value: 35,
      icon: '✅',
      color: 'border-green-500'
    }
  ]

  const recentLeads = [
    { name: 'Rahul', email: 'rahul@gmail.com', status: 'New' },
    { name: 'Priya', email: 'priya@gmail.com', status: 'Contacted' },
    { name: 'Arjun', email: 'arjun@gmail.com', status: 'Won' }
  ]

  const statusColors = {
    New: 'bg-yellow-100 text-yellow-700',
    Contacted: 'bg-purple-100 text-purple-700',
    Won: 'bg-green-100 text-green-700'
  }

  return (
    <div className="min-h-screen bg-red-200 p-50">

      {/* Dashboard Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Lead Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's your lead overview.
          </p>
        </div>
{/* 
        <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
          + Add Lead
        </button> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border-l-4 ${card.color} bg-white p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                {card.label}
              </p>
              <span className="text-2xl">{card.icon}</span>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-gray-800">
              {card.value}
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              Leads overview
            </p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-800">
          Recent Leads
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.email} className="border-b last:border-0">
                  <td className="px-4 py-4 font-medium text-gray-800">
                    {lead.name}
                  </td>

                  <td className="px-4 py-4 text-gray-500">
                    {lead.email}
                  </td>

                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default DashboardCards
