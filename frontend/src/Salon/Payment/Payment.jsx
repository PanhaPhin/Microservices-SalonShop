import Divider from '@mui/material/Divider'
import React from 'react'

const Payment = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">

        {/* ── Total Earning ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-1">
          <p className="text-sm text-gray-500">Total Earning</p>
          <h2 className="font-bold text-2xl text-gray-900 pb-1">$100</h2>
          <Divider />
          <p className="text-sm text-gray-600 pt-1">
            Last Payment: <strong className="text-gray-900">$20</strong>
          </p>
        </div>

        {/* ── This Month ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-1">
          <p className="text-sm text-gray-500">This Month</p>
          <h2 className="font-bold text-2xl text-gray-900 pb-1">$45</h2>
          <Divider />
          <p className="text-sm text-gray-600 pt-1">
            Last Month: <strong className="text-gray-900">$38</strong>
          </p>
        </div>

        {/* ── Pending ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-1">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="font-bold text-2xl text-amber-500 pb-1">$15</h2>
          <Divider />
          <p className="text-sm text-gray-600 pt-1">
            Next Payout: <strong className="text-gray-900">June 30</strong>
          </p>
        </div>

        {/* ── Recent Transactions ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:col-span-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Transactions</h3>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Classic Haircut — Sophea K.', date: 'Jun 24', amount: '+$25', color: 'text-green-600' },
              { label: 'Hair Coloring — Dara M.',     date: 'Jun 22', amount: '+$80', color: 'text-green-600' },
              { label: 'Refund — Lina T.',            date: 'Jun 20', amount: '-$10', color: 'text-red-500'   },
              { label: 'Facial Treatment — Chan P.',  date: 'Jun 18', amount: '+$55', color: 'text-green-600' },
            ].map((tx, i) => (
              <div key={i}>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{tx.label}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${tx.color}`}>{tx.amount}</span>
                </div>
                {i < 3 && <Divider />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Payment