import React, { useState } from 'react';
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE, GET_USERS_DEALS } from '@/graphql/queries';
import { useSelector } from "react-redux";
import { selectUserId } from "@/redux/auth/authSlice";
import { Mail, Calendar, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';

interface User {
    userId: string;
    fullName: string;
    email: string;
    role: { role: { roleName: string } }[];
    team: { teamName: string };
    createdAt: string;
}

interface Deal {
    id: string;
    dealName: string;
    dealValue: number;
    isEdited: boolean;
    remarks: string;
}

interface ProfileDetailBoxProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
}

function ProfilePage() {
    const userId = useSelector(selectUserId);
    const [showAllDeals, setShowAllDeals] = useState(false);

    // Fetch user profile
    const { loading: profileLoading, error: profileError, data: profileData } = useQuery(GET_USER_PROFILE, {
        variables: { userId }
    });

    // Fetch all user deals
    const { loading: dealsLoading, error: dealsError, data: dealsData } = useQuery(GET_USERS_DEALS, {
        variables: { userId }
    });

    if (profileLoading || dealsLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse text-2xl text-gray-500">Loading profile...</div>
        </div>
    );

    if (profileError) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded relative" role="alert">
            Error fetching profile: {profileError.message}
        </div>
    );

    if (dealsError) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded relative" role="alert">
            Error fetching deals: {dealsError.message}
        </div>
    );

    const user: User = profileData.getUserById.data;
    const deals: Deal[] = dealsData.dealsOfUser.deals.deals;

    // Calculate total deal value
    const totalDealValue = deals?.reduce((sum, deal) => sum + deal.dealValue, 0);

    // Function to get initials with explicit typing
    const getInitials = (name: string): string => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };


    // Format currency
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-12 sm:px-16 max-w-screen-full mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 2xl:gap-28">
                {/* Profile Information */}
                <div className="bg-white shadow-md rounded-lg p-8">
                    <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 bg-blue-500 text-white p-8 rounded-full">
                            <span className="text-5xl font-bold">{getInitials(user?.fullName)}</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-semibold text-gray-800">{user.fullName}</h1>
                            <p className="text-xl text-gray-500">{user?.email}</p>
                            <p className="text-base text-gray-400">Member of {user?.team?.teamName}</p>
                            <p className="text-base text-gray-400">Role: {user?.role[0]?.role?.roleName}</p>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                        <ProfileDetailBox label="Email" value={user.email} bgColor="bg-blue-100" icon={<Mail className="w-8 h-8 text-blue-500" />} />
                        <ProfileDetailBox label="Role" value={user.role[0]?.role?.roleName || "No role"} bgColor="bg-green-100" icon={<Calendar className="w-8 h-8 text-green-500" />} />
                        <ProfileDetailBox label="Deals" value={deals.length} bgColor="bg-yellow-100" icon={<Briefcase className="w-8 h-8 text-yellow-500" />} />
                        <ProfileDetailBox label="Total Deal Value" value={formatCurrency(totalDealValue)} bgColor="bg-green-500" icon={<Briefcase className="w-8 h-8 text-black" />} />
                    </div>
                </div>

                {/* Recent Deals */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Recent Deals</h2>
                    <div className="mt-4">
                        <table className="table-auto w-full text-left border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2">Deal Name</th>
                                    <th className="border px-4 py-2">Remarks</th>
                                    <th className="border px-4 py-2">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deals.slice(0, showAllDeals ? deals.length : 5).map((deal) => (
                                    <tr key={deal.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2 max-w-[5cm] overflow-x-auto whitespace-nowrap">{deal.dealName}</td>
                                        <td className="border px-4 py-2 max-w-[5cm] overflow-x-auto whitespace-nowrap">{deal.remarks}</td>
                                        <td className="border px-4 py-2">{formatCurrency(deal.dealValue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            className="mt-4 flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                            onClick={() => setShowAllDeals(!showAllDeals)}
                        >
                            <span>{showAllDeals ? "Show Less" : "Show More"}</span>
                            {showAllDeals ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ProfileDetailBox: React.FC<ProfileDetailBoxProps> = ({ label, value, icon, bgColor }) => (
    <div className={`flex p-6 ${bgColor} shadow-md rounded-lg`}>
        {/* Icon */}
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-white">
            {icon}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center overflow-hidden">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-lg font-semibold text-gray-800 break-words leading-tight">
                {value}
            </p>
        </div>
    </div>
);


export default ProfilePage;

