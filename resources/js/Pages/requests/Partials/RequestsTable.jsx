import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

const RequestsTable = ({
    requests,
    selectedRequest,
    onSelectRequest,
    month,
    year,
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
        });
    };

    const filteredRequests = requests.filter((req) => {
        const reqDate = new Date(req.requestdate);
        const reqMonth = String(reqDate.getMonth() + 1).padStart(2, "0");
        const reqYear = reqDate.getFullYear().toString();
        return reqMonth === month && reqYear === year;
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Requests</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredRequests.map((request) => (
                    <TableRow
                        key={request.requestsummaryid}
                        onClick={() => onSelectRequest(request)}
                        style={{
                            cursor: "pointer",
                            backgroundColor:
                                selectedRequest?.requestsummaryid ===
                                request.requestsummaryid
                                    ? "#e0e0e0"
                                    : "transparent",
                        }}
                    >
                        <TableCell className="py-2 text-sm text-gray-700">
                            <div className="text-gray-600 text-sm">
                                Requester:{" "}
                                <span className="font-medium">
                                    {request.requester_details && request.requester_details.firstname && request.requester_details.surname
        				? `${request.requester_details.firstname} ${request.requester_details.surname} ${request.requester_details.nameExtension ?? ''}`.trim()
        				: "Unknown Requester"}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Requested on: {formatDate(request.requestdate)}
                            </div>
                            <div
                                className={`font-semibold mb-1 ${
                                    request.xstatus === "Pending"
                                        ? "text-yellow-600"
                                        : request.xstatus === "Acknowledged"
                                        ? "text-green-600"
                                        : request.xstatus === "Served"
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                }`}
                            >
                                {request.xstatus}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default RequestsTable;
