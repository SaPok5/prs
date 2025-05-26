function ClientDeal({deal}:any) {

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
            {/* Header */}
            <div className="border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Deal Details</h1>
                <p className="text-sm text-gray-500">Information about the deal made by the client</p>
            </div>

            {/* Deal Information */}
            <div className="grid grid-cols-2 gap-6">
                {/* Deal ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Deal ID</label>
                    <p className="text-lg text-gray-800 font-semibold">{deal.dealId || 'NAN'}</p>
                </div>

                {/* Deal Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Deal Name</label>
                    <p className="text-lg text-gray-800 font-semibold">{deal.dealName || 'NAN'}</p>
                </div>

                {/* Client */}
                {/* <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Client</label>
                    <p className="text-lg text-gray-800 font-semibold">{deal.fullName || 'NAN'}</p>
                </div> */}

                {/* Organization */}
                {/* <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Organization</label>
                    <p className="text-lg text-gray-800 font-semibold">{deal?.organization?.organizationName || 'NAN'}</p>
                </div> */}

                {/* Work Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Work Type</label>
                    <p className="text-lg text-gray-800 font-semibold">{deal.workType.name || 'NAN'}</p>
                </div>

                {/* Source Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Source Type</label>
                    <p className="text-lg text-gray-800 font-semibold">{deal.sourceType.name || 'NAN'}</p>
                </div>

                {/* Deal Value */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Deal Value</label>
                    <p className="text-lg text-gray-800 font-semibold">${deal.dealValue.toLocaleString() || 'NAN'}</p>
                </div>

                {/* Deal Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Deal Date</label>
                    <p className="text-lg text-gray-800 font-semibold">{new Date(deal.dealDate).toLocaleDateString() || 'NAN'}</p>
                </div>

                {/* Due Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Due Date</label>
                    <p className="text-lg text-gray-800 font-semibold">{new Date(deal.dueDate).toLocaleDateString() || 'NAN'}</p>
                </div>

                {/* Remarks */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Remarks</label>
                    <p className="text-lg text-gray-800 font-semibold">{deal.remarks || 'NAN'}</p>
                </div>
            </div>
        </div>
    );
}

export default ClientDeal;
