import { X, CheckCircle, XCircle, Clock, User, Building2, Phone, FileText, MapPin, CreditCard } from 'lucide-react'

const ApplicationModal = ({ isOpen, onClose, vendor, application, onApprove, onReject, loading }) => {
  if (!isOpen || !vendor) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'under_review': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className='w-5 h-5' />
      case 'rejected': return <XCircle className='w-5 h-5' />
      default: return <Clock className='w-5 h-5' />
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-black'>Business Application</h2>
            <p className='text-blue-100 text-sm mt-1'>{vendor.email}</p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-white/20 rounded-lg transition'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-200px)]'>
          {!application ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='w-8 h-8 text-gray-400' />
              </div>
              <p className='text-gray-600 font-semibold'>No application submitted yet</p>
              <p className='text-sm text-gray-500 mt-1'>This vendor hasn't submitted their business application</p>
            </div>
          ) : (
            <>
              {/* Status Badge */}
              <div className='mb-6'>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(application.applicationStatus)}`}>
                  {getStatusIcon(application.applicationStatus)}
                  <span className='uppercase text-sm'>{application.applicationStatus?.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Basic Information */}
              <div className='mb-6'>
                <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                  <Building2 className='w-5 h-5 text-blue-600' />
                  Basic Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4'>
                  <div>
                    <label className='text-xs font-semibold text-gray-600 uppercase'>Business Name</label>
                    <p className='text-gray-900 font-semibold mt-1'>{application.businessName}</p>
                  </div>
                  <div>
                    <label className='text-xs font-semibold text-gray-600 uppercase'>Owner Name</label>
                    <p className='text-gray-900 font-semibold mt-1'>{application.ownerName}</p>
                  </div>
                  <div>
                    <label className='text-xs font-semibold text-gray-600 uppercase'>Mobile</label>
                    <p className='text-gray-900 font-semibold mt-1'>{application.mobile}</p>
                  </div>
                  <div>
                    <label className='text-xs font-semibold text-gray-600 uppercase'>GST Number</label>
                    <p className='text-gray-900 font-semibold mt-1 uppercase'>{application.gstNumber}</p>
                  </div>
                  <div className='md:col-span-2'>
                    <label className='text-xs font-semibold text-gray-600 uppercase'>Business Category</label>
                    <p className='text-gray-900 font-semibold mt-1'>{application.businessCategory}</p>
                  </div>
                </div>
              </div>

              {/* Business Address */}
              {application.businessAddress && (
                <div className='mb-6'>
                  <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                    <MapPin className='w-5 h-5 text-blue-600' />
                    Business Address
                  </h3>
                  <div className='bg-gray-50 rounded-xl p-4'>
                    <p className='text-gray-900 font-semibold'>
                      {application.businessAddress.street && `${application.businessAddress.street}, `}
                      {application.businessAddress.city && `${application.businessAddress.city}, `}
                      {application.businessAddress.state && `${application.businessAddress.state} - `}
                      {application.businessAddress.pincode}
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Details */}
              {application.bankAccount?.accountNumber && (
                <div className='mb-6'>
                  <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                    <CreditCard className='w-5 h-5 text-blue-600' />
                    Bank Details
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4'>
                    <div>
                      <label className='text-xs font-semibold text-gray-600 uppercase'>Account Holder</label>
                      <p className='text-gray-900 font-semibold mt-1'>{application.bankAccount.accountHolderName}</p>
                    </div>
                    <div>
                      <label className='text-xs font-semibold text-gray-600 uppercase'>Account Number</label>
                      <p className='text-gray-900 font-semibold mt-1'>{application.bankAccount.accountNumber}</p>
                    </div>
                    <div>
                      <label className='text-xs font-semibold text-gray-600 uppercase'>IFSC Code</label>
                      <p className='text-gray-900 font-semibold mt-1'>{application.bankAccount.ifscCode}</p>
                    </div>
                    <div>
                      <label className='text-xs font-semibold text-gray-600 uppercase'>Bank Name</label>
                      <p className='text-gray-900 font-semibold mt-1'>{application.bankAccount.bankName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Details */}
              {application.upiId?.upi && (
                <div className='mb-6'>
                  <h3 className='text-lg font-bold text-gray-800 mb-4'>UPI Details</h3>
                  <div className='bg-gray-50 rounded-xl p-4'>
                    <p className='text-gray-900 font-semibold'>{application.upiId.upi}</p>
                    {application.upiId.accountHolderName && (
                      <p className='text-sm text-gray-600 mt-1'>{application.upiId.accountHolderName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Comments & Rejection Reason */}
              {(application.adminComments || application.rejectionReason) && (
                <div className='mb-6'>
                  {application.rejectionReason && (
                    <div className='bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-4'>
                      <h4 className='font-bold text-red-900 mb-2'>Rejection Reason</h4>
                      <p className='text-red-800'>{application.rejectionReason}</p>
                    </div>
                  )}
                  {application.adminComments && (
                    <div className='bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4'>
                      <h4 className='font-bold text-blue-900 mb-2'>Admin Comments</h4>
                      <p className='text-blue-800'>{application.adminComments}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Submission Info */}
              <div className='bg-gray-50 rounded-xl p-4 text-sm text-gray-600'>
                <p><span className='font-semibold'>Submitted:</span> {new Date(application.submittedAt || application.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                {application.reviewedAt && (
                  <p className='mt-1'><span className='font-semibold'>Reviewed:</span> {new Date(application.reviewedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer - Action Buttons */}
        {application && ['pending', 'under_review'].includes(application.applicationStatus) && (
          <div className='border-t border-gray-200 p-6 bg-gray-50 flex gap-3'>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reject this application?')) {
                  const reason = prompt('Enter rejection reason:')
                  if (reason) {
                    onReject(vendor._id, reason)
                  }
                }
              }}
              disabled={loading}
              className='flex-1 px-6 py-3 bg-white border-2 border-red-500 text-red-600 font-bold rounded-xl hover:bg-red-50 transition disabled:opacity-50 flex items-center justify-center gap-2'
            >
              <XCircle className='w-5 h-5' />
              Reject
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to approve this vendor?')) {
                  onApprove(vendor._id)
                }
              }}
              disabled={loading}
              className='flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2'
            >
              <CheckCircle className='w-5 h-5' />
              {loading ? 'Approving...' : 'Approve'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationModal
