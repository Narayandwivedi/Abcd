import { useState, useEffect } from 'react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { toast } from 'react-toastify'

const WhatsAppSessions = () => {
  const { hasPermission } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('sessions') // 'sessions' or 'messages'
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showMobilePrompt, setShowMobilePrompt] = useState(false)
  const [newSessionMobile, setNewSessionMobile] = useState('')
  const [qrCode, setQrCode] = useState(null)
  const [addingSession, setAddingSession] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    connected: 0
  })
  const [currentSessionId, setCurrentSessionId] = useState(null)

  // Message Logs State
  const [messages, setMessages] = useState([])
  const [messageLoading, setMessageLoading] = useState(false)
  const [messageFilter, setMessageFilter] = useState('all') // 'all', 'pending', 'failed', 'sent'
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMessages, setTotalMessages] = useState(0)

  // Test Message State
  const [testNumber, setTestNumber] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  // WhatsApp API Configuration
  // Use VITE_BACKEND_URL or default to localhost:5005
  const WHATSAPP_API_URL = 'http://localhost:5005/api/v1'
  const WHATSAPP_API_KEY = 'f8d34cf7-987e-4c6e-888e-4366108b61de'

  useEffect(() => {
    fetchSessions()
    // Poll for sessions every 30 seconds
    const interval = setInterval(fetchSessions, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages()
    }
  }, [activeTab, messageFilter, currentPage])

  // Fast polling when QR modal is open
  useEffect(() => {
    let pollInterval;
    if (showQRModal && currentSessionId) {
      pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`${WHATSAPP_API_URL}/sessions/${currentSessionId}/status`, {
            headers: { 'x-api-key': WHATSAPP_API_KEY }
          })
          const data = await response.json()
          if (data && data.connected) {
            setShowQRModal(false)
            setCurrentSessionId(null)
            fetchSessions() // Refresh the whole list and stats
            toast.success("WhatsApp connected successfully!")
          }
        } catch (err) {
          console.error("Polling error:", err)
        }
      }, 3000)
    }
    return () => clearInterval(pollInterval)
  }, [showQRModal, currentSessionId])

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${WHATSAPP_API_URL}/sessions`, {
        headers: {
          'x-api-key': WHATSAPP_API_KEY
        }
      })
      const data = await response.json()
      
      if (data.sessions) {
        setSessions(data.sessions)
        setStats({
          total: data.totalSessions || 0,
          connected: data.connectedSessions || 0
        })
      }
    } catch (error) {
      console.error('Error fetching WhatsApp sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      setMessageLoading(true)
      const query = new URLSearchParams({
        page: currentPage,
        limit: 10
      })
      if (messageFilter !== 'all') {
        query.append('status', messageFilter)
      }

      const response = await fetch(`${WHATSAPP_API_URL}/messages?${query.toString()}`, {
        headers: {
          'x-api-key': WHATSAPP_API_KEY
        }
      })
      const data = await response.json()
      
      if (data.messages) {
        setMessages(data.messages)
        setTotalPages(data.pages || 1)
        setTotalMessages(data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching message logs:', error)
    } finally {
      setMessageLoading(false)
    }
  }

  const handleSendTestMessage = async (e) => {
    e.preventDefault()
    if (!testNumber || !testMessage) {
      toast.warn('Please enter both number and message')
      return
    }

    try {
      setSendingTest(true)
      const response = await fetch(`${WHATSAPP_API_URL}/messages/send`, {
        method: 'POST',
        headers: {
          'x-api-key': WHATSAPP_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ number: testNumber, text: testMessage }]
        })
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Test message queued successfully! Job ID: ' + data.jobId)
        setTestMessage('')
        if (activeTab === 'messages') fetchMessages()
      } else {
        toast.error(data.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending test message:', error)
      toast.error('Failed to connect to WhatsApp Engine')
    } finally {
      setSendingTest(false)
    }
  }

  const startSessionAddFlow = () => {
    setNewSessionMobile('')
    setShowMobilePrompt(true)
  }

  const handleReconnectSession = async (sessionId) => {
    try {
      setAddingSession(true)
      const response = await fetch(`${WHATSAPP_API_URL}/sessions/${sessionId}/reconnect`, {
        method: 'POST',
        headers: {
          'x-api-key': WHATSAPP_API_KEY
        }
      })
      const data = await response.json()
      
      if (data.qr) {
        setQrCode(data.qr)
        setCurrentSessionId(sessionId)
        setShowQRModal(true)
      } else {
        toast.error(data.message || 'Failed to generate QR Code')
      }
    } catch (error) {
      console.error('Error reconnecting session:', error)
      toast.error('Failed to connect to WhatsApp Engine')
    } finally {
      setAddingSession(false)
    }
  }

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session? This will log out the phone and remove all data.')) {
      return
    }

    try {
      const response = await fetch(`${WHATSAPP_API_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': WHATSAPP_API_KEY
        }
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Session deleted successfully')
        fetchSessions()
      } else {
        toast.error(data.message || 'Failed to delete session')
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('Failed to connect to WhatsApp Engine')
    }
  }

  const handleAddSession = async () => {
    if (!newSessionMobile || newSessionMobile.length < 10) {
      toast.warn('Please enter a valid mobile number first')
      return
    }

    try {
      setAddingSession(true)
      setShowMobilePrompt(false)
      const response = await fetch(`${WHATSAPP_API_URL}/sessions/add`, {
        method: 'POST',
        headers: {
          'x-api-key': WHATSAPP_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizationName: `Admin-${newSessionMobile}`
        })
      })
      const data = await response.json()
      
      if (data.qr) {
        setQrCode(data.qr)
        setCurrentSessionId(data.sessionId)
        setShowQRModal(true)
      } else {
        toast.error(data.message || 'Failed to generate QR Code')
      }
    } catch (error) {
      console.error('Error adding session:', error)
      toast.error('Failed to connect to WhatsApp Engine')
    } finally {
      setAddingSession(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 mt-4 font-medium">Connecting to WhatsApp Engine...</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">WhatsApp Sessions</h1>
          <p className="text-gray-500 mt-1">Manage linked phones and message limits</p>
        </div>
        <button
          onClick={startSessionAddFlow}
          disabled={addingSession}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
        >
          {addingSession ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <span>Add New Session</span>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
            📱
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Sessions</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl">
            ✅
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Connected</p>
            <p className="text-2xl font-bold text-gray-800">{stats.connected}</p>
          </div>
        </div>

        {/* Quick Send Test Message */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100">
          <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-3">
            <span>🚀</span> Send Test Message
          </h3>
          <form onSubmit={handleSendTestMessage} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="91xxxxxxxxxx"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Hello world!"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="flex-[2] px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={sendingTest || stats.connected === 0}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {sendingTest ? 'Sending...' : 'Send'}
            </button>
          </form>
          {stats.connected === 0 && (
            <p className="text-[10px] text-indigo-600 mt-2 font-medium">
              * Connect at least one phone to send messages
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-8 py-4 font-bold transition-all border-b-2 ${
            activeTab === 'sessions'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          📱 Sessions
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-8 py-4 font-bold transition-all border-b-2 ${
            activeTab === 'messages'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          📜 Message Logs
        </button>
      </div>

      {activeTab === 'sessions' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Connected Phones</h2>
            <button 
              onClick={fetchSessions}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition"
            >
              🔄 Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Session ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Hourly Limit</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Daily Limit</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sent Today</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No sessions found. Add your first WhatsApp session to start sending messages.
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr key={session.sessionId} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">{session.sessionId}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{session.number || 'Not connected'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          session.connected 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {session.connected ? '● ONLINE' : '○ OFFLINE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="font-bold text-gray-800">{session.sentThisHour}</span> / {session.hourlyLimit}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="font-bold text-gray-800">{session.dailyLimit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-100 rounded-full h-2 max-w-[100px]">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(session.sentToday / session.dailyLimit) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] mt-1 text-gray-500 font-medium">
                          {session.sentToday} sent today
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReconnectSession(session.sessionId)}
                            title="Relogin / Reconnect"
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          >
                            🔑
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.sessionId)}
                            title="Delete Session"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Message Logs</h2>
              <p className="text-sm text-gray-500">{totalMessages} messages found</p>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto">
              {['all', 'pending', 'sent', 'failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setMessageFilter(status)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition ${
                    messageFilter === status
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
              <button 
                onClick={fetchMessages}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Refresh Logs"
              >
                🔄
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">To Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Message</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Sent At</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messageLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No messages found with this filter.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg, idx) => (
                    <tr key={msg._id || idx} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-mono text-sm text-gray-800">{msg.toNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={msg.messageBody}>
                        {msg.messageBody}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          msg.status === 'sent' ? 'bg-green-100 text-green-700' :
                          msg.status === 'failed' ? 'bg-red-100 text-red-700' :
                          msg.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {msg.sentAt ? new Date(msg.sentAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-xs text-red-500 max-w-xs truncate" title={msg.error}>
                        {msg.error || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page <span className="font-bold text-gray-800">{currentPage}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1 || messageLoading}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition shadow-sm"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages || messageLoading}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Prompt Modal */}
      {showMobilePrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <h3 className="text-xl font-bold">Add New Session</h3>
              <p className="text-blue-100 text-sm">Enter the phone number you are about to link</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Mobile Number</label>
                <input
                  type="text"
                  placeholder="91xxxxxxxxxx"
                  value={newSessionMobile}
                  onChange={(e) => setNewSessionMobile(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
                  autoFocus
                />
                <p className="text-xs text-gray-500">Includes country code (e.g. 91 for India)</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-700 flex gap-3">
                <span className="text-xl">💡</span>
                <p>This number is for your reference only. The actual number will be automatically detected after scanning.</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowMobilePrompt(false)}
                className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-xl font-bold border border-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSession}
                disabled={!newSessionMobile || newSessionMobile.length < 10}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg disabled:opacity-50"
              >
                Continue to QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Link WhatsApp Phone</h3>
                <p className="text-blue-100 text-sm">Scan the QR code to connect</p>
              </div>
              <button 
                onClick={() => {
                  setShowQRModal(false)
                  setCurrentSessionId(null)
                  fetchSessions()
                }}
                className="text-white/80 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 flex flex-col items-center gap-6">
              <div className="bg-white p-4 rounded-2xl shadow-inner border-2 border-gray-100">
                <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
              </div>
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-800 font-bold">How to scan?</p>
                  <ol className="text-sm text-gray-600 text-left space-y-1 inline-block list-decimal pl-4">
                    <li>Open WhatsApp on your phone</li>
                    <li>Tap Menu (⋮) or Settings (⚙️)</li>
                    <li>Tap Linked Devices</li>
                    <li>Tap Link a Device and scan this code</li>
                  </ol>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
                  ⚠️ This QR code will expire soon. Please scan it immediately.
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setShowQRModal(false)
                  setCurrentSessionId(null)
                  fetchSessions()
                }}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition"
              >
                Done
              </button>
              <button
                onClick={handleAddSession}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WhatsAppSessions
