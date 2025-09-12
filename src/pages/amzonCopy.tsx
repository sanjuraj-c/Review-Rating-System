import React, { FC } from "react";

interface Review {
    id: number;
    name: string;
    rating: number;
    title: string;
    date: string;
    verified: boolean;
    content: string;
}

const reviews: Review[] = [
    {
        id: 1,
        name: "kushal",
        rating: 5,
        title: "trendy and attractive, with safety",
        date: "15 September 2023",
        verified: true,
        content: "very good product at the best price in the market",
    },
    {
        id: 2,
        name: "surendarvarma",
        rating: 5,
        title: "Best 👌",
        date: "12 June 2021",
        verified: true,
        content: "Amazing 😃😃😃",
    },
];

const AmzonCopy: FC = () => {
    return (
        <div className="max-w-5xl mx-auto p-6 bg-white">
            {/* Customer Reviews Summary */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                    <h2 className="text-xl font-semibold">Customer reviews</h2>
                    <div className="flex items-center space-x-2 mt-2">
                        <span className="text-orange-500 text-lg">★★★☆☆</span>
                        <span className="font-medium">3.7 out of 5</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">8 global ratings</p>

                    {/* Ratings Breakdown */}
                    <div className="mt-4 space-y-2">
                        {[
                            { label: "5 star", percent: 42 },
                            { label: "4 star", percent: 35 },
                            { label: "3 star", percent: 0 },
                            { label: "2 star", percent: 0 },
                            { label: "1 star", percent: 23 },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                                <span className="w-12 text-sm">{item.label}</span>
                                <div className="w-40 bg-gray-200 rounded h-3 overflow-hidden">
                                    <div
                                        className="bg-orange-500 h-3"
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm">{item.percent}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 border-t pt-6">
                        <h2 className="text-lg font-semibold">Review this product</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Share your thoughts with other customers
                        </p>
                        <button className="px-5 py-2 border rounded-lg font-medium hover:bg-gray-100">
                            Write a product review
                        </button>
                    </div>
                </div>

                {/* Top Reviews */}
                <div className="md:w-2/3">
                    <h2 className="text-lg font-semibold">Top reviews from India</h2>
                    <div className="space-y-6 mt-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                    <span className="font-medium">{review.name}</span>
                                </div>
                                <div className="mt-2 text-orange-500">{"★".repeat(review.rating)}</div>
                                <h3 className="font-semibold mt-1">{review.title}</h3>
                                <p className="text-sm text-gray-500">
                                    Reviewed in India on {review.date}
                                </p>
                                {review.verified && (
                                    <p className="text-sm text-red-600 font-medium">Verified Purchase</p>
                                )}
                                <p className="mt-2 text-gray-700">{review.content}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <button className="px-3 py-1 border rounded-full hover:bg-gray-100">
                                        Helpful
                                    </button>
                                    <button className="text-sm text-gray-500 hover:underline">
                                        Report
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-6 text-blue-600 hover:underline">
                        See more reviews &gt;
                    </button>
                </div>
            </div>

            {/* Review This Product */}

        </div>
    );
};

export default AmzonCopy;
