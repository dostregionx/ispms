import React, { useState, useMemo } from "react";
import MainLayout from "@/Layouts/MainLayout";
import RequestsTable from "./Partials/RequestsTable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import RequestsDetails from "./Partials/RequestsDetails";

const Requests = ({ requests }) => {
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const currentYear = currentDate.getFullYear().toString();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requestsData, setRequestsData] = useState(requests);

    const years = Array.from(
        { length: 10 },
        (_, i) => `${currentDate.getFullYear() - i}`
    );

    const getMonthName = (monthNumber) =>
        new Date(2000, monthNumber - 1).toLocaleString("default", {
            month: "long",
        });

    const filteredRequests = useMemo(() => {
        return requestsData.filter((req) => {
            const reqDate = new Date(req.requestdate);
            const reqMonth = String(reqDate.getMonth() + 1).padStart(2, "0");
            const reqYear = String(reqDate.getFullYear());
            return reqMonth === selectedMonth && reqYear === selectedYear;
        });
    }, [requestsData, selectedMonth, selectedYear]);

    return (
        <>
            <div className="flex flex-1 flex-col p-4 pt-0">
                <div className="flex min-h-screen w-full">
                    {/* Sidebar */}
                    <div className="w-[20%] border-r border-border bg-muted/50 p-4 flex flex-col">
                        {/* Filters */}
                        <div className="mb-4">
                            <p className="mb-2 font-medium">Filters:</p>
                            <div className="flex gap-2">
                                <Select
                                    onValueChange={(val) => {
                                        setSelectedMonth(val);
                                        setSelectedRequest(null);
                                    }}
                                    value={selectedMonth}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[...Array(12)].map((_, i) => {
                                            const monthValue = String(
                                                i + 1
                                            ).padStart(2, "0");
                                            return (
                                                <SelectItem
                                                    key={monthValue}
                                                    value={monthValue}
                                                >
                                                    {getMonthName(i + 1)}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>

                                <Select
                                    onValueChange={(val) => {
                                        setSelectedYear(val);
                                        setSelectedRequest(null);
                                    }}
                                    value={selectedYear}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Request List */}
                        <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "calc(100vh - 100px)" }}
                        >
                            <RequestsTable
                                requests={filteredRequests}
                                month={selectedMonth}
                                year={selectedYear}
                                selectedRequest={selectedRequest}
                                onSelectRequest={setSelectedRequest}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-[80%] px-6 py-4 space-y-4">
                        <RequestsDetails
                            selectedRequest={selectedRequest}
                            setSelectedRequest={setSelectedRequest}
                            setRequestsData={setRequestsData}
                            requestsData={requestsData}
                        />
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    );
};

Requests.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Requests;
