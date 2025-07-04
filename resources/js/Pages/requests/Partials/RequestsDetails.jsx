// resources/js/Pages/requests/Partials/RequestsDetails.jsx
import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ShowToast } from "@/Layouts/ShowToast";
import axios from "axios";

const RequestsDetails = ({
    selectedRequest,
    setSelectedRequest,
    setRequestsData,
    requestsData,
}) => {
    const [requestDetails, setRequestDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toServe, setToServe] = useState([]);
    const [remarks, setRemarks] = useState("");
    const [checkAll, setCheckAll] = useState(false);
    const [processingAcknowledge, setProcessingAcknowledge] = useState(false);
    const [processingServe, setProcessingServe] = useState(false);

    const isAcknowledged = selectedRequest?.xstatus === "Acknowledged";
    const isServed = selectedRequest?.xstatus === "Served";

    useEffect(() => {
        if (!selectedRequest) return setRequestDetails(null);
        const controller = new AbortController();

        const fetchRequestDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/inventory/requests/details/${selectedRequest.requestsummaryid}`,
                    { signal: controller.signal }
                );
                if (!res.ok) throw new Error("Failed to fetch request details");
                const data = await res.json();
                setRequestDetails(data);
                setToServe([]);
                setCheckAll(false);
            } catch (err) {
                if (err.name !== "AbortError") console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequestDetails();
        return () => controller.abort();
    }, [selectedRequest]);

    const toggleScratch = (index) => {
        if (!isAcknowledged) return;
        const item = requestDetails.items[index];
        const itemObj = {
            stockno: item.stockno,
            requestdetailsid: item.requestdetailsid,
        };

        setToServe((prev) => {
            const exists = prev.some(
                (i) =>
                    i.stockno === itemObj.stockno &&
                    i.requestdetailsid === itemObj.requestdetailsid
            );
            return exists
                ? prev.filter(
                      (i) =>
                          !(
                              i.stockno === itemObj.stockno &&
                              i.requestdetailsid === itemObj.requestdetailsid
                          )
                  )
                : [...prev, itemObj];
        });
    };

    const toggleAll = () => {
        if (!isAcknowledged) return;

        if (checkAll) {
            setToServe([]);
        } else {
            const allItems = requestDetails.items.map((item) => ({
                stockno: item.stockno,
                requestdetailsid: item.requestdetailsid,
            }));
            setToServe(allItems);
        }

        setCheckAll(!checkAll);
    };

    const handleAcknowledge = async () => {
        setProcessingAcknowledge(true);
        try {
            const res = await fetch(
                `/inventory/requests/acknowledge/${selectedRequest.requestsummaryid}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                }
            );

            if (!res.ok) throw new Error("Acknowledge failed");

            ShowToast({
                title: "Success!",
                description: "Request acknowledged successfully.",
                className: "bg-green-500 text-white",
            });

            setRequestsData((prev) =>
                prev.map((r) =>
                    r.requestsummaryid === selectedRequest.requestsummaryid
                        ? { ...r, xstatus: "Acknowledged" }
                        : r
                )
            );

            setSelectedRequest((prev) => ({
                ...prev,
                xstatus: "Acknowledged",
            }));
        } catch (err) {
            ShowToast({
                title: "Error!",
                description: err.message,
                className: "bg-red-500 text-white",
            });
        } finally {
            setProcessingAcknowledge(false);
        }
    };

    const handleMarkAsServed = async () => {
        setProcessingServe(true);
        try {
            const response = await fetch(
                `/inventory/requests/serve/${selectedRequest.requestsummaryid}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                    body: JSON.stringify({
                        remarks,
                        toServe,
                        summary: selectedRequest,
                    }),
                }
            );

            if (!response.ok) throw new Error("Failed to serve request");

            const data = await response.json();

            ShowToast({
                title: "Success!",
                description: data.message,
                className: "bg-green-500 text-white",
            });

            setRequestsData((prev) =>
                prev.map((r) =>
                    r.requestsummaryid === selectedRequest.requestsummaryid
                        ? { ...r, xstatus: "Served", remarks }
                        : r
                )
            );

            setSelectedRequest((prev) => ({
                ...prev,
                xstatus: "Served",
                remarks,
            }));

            const refreshed = await fetch(
                `/inventory/requests/details/${selectedRequest.requestsummaryid}`
            );
            if (!refreshed.ok) throw new Error("Refresh failed");
            const freshData = await refreshed.json();
            setRequestDetails(freshData);
            setToServe([]);
            setCheckAll(false);
        } catch (err) {
            ShowToast({
                title: "Error!",
                description: err.message || "Something went wrong",
                className: "bg-red-500 text-white",
            });
        } finally {
            setProcessingServe(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/inventory/requests/${selectedRequest.requestsummaryid}`);
            ShowToast({
                title: "Deleted",
                description: "Request deleted successfully.",
                className: "bg-red-600 text-white",
            });

            const updated = requestsData.filter(
                (r) => r.requestsummaryid !== selectedRequest.requestsummaryid
            );
            setRequestsData(updated);
            setSelectedRequest(null);
        } catch (error) {
            ShowToast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete request.",
                className: "bg-red-600 text-white",
            });
        }
    };

    if (!selectedRequest)
        return (
            <div className="text-sm text-muted-foreground text-center">
                No request selected.
            </div>
        );
    if (loading)
        return <div className="text-sm text-muted-foreground">Loading...</div>;
    if (!requestDetails)
        return (
            <div className="text-sm text-destructive">
                Failed to load details.
            </div>
        );

    const { items } = requestDetails;
    const requester = selectedRequest.requester_details;
    const supervisor = selectedRequest.supervisor_details;

    const formatName = (p) =>
        [
            p?.firstname,
            p?.middleInitial && `${p.middleInitial}.`,
            p?.surname,
            p?.nameExtension,
        ]
            .filter(Boolean)
            .join(" ");

    return (
        <div className="border bg-background p-4 rounded-md shadow-sm space-y-4 text-sm">
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h2 className="text-lg font-semibold text-primary">
                        Request Summary
                    </h2>
                </div>
                <div className="flex gap-2">
                    {!isAcknowledged && !isServed && (
                        <Button
                            onClick={handleAcknowledge}
                            disabled={processingAcknowledge}
                        >
                            {processingAcknowledge
                                ? "Processing..."
                                : "Acknowledge"}
                        </Button>
                    )}
                    {isAcknowledged && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button disabled={processingServe}>
                                    {processingServe
                                        ? "Processing..."
                                        : "Mark as Served"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Confirm Serve
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Proceed to mark this request as served?
                                        This action is final.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleMarkAsServed}
                                        disabled={processingServe}
                                    >
                                        Confirm
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    {/* Always show Delete button */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this request?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the request and its items.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                    Confirm Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Separator />

            <div className="space-y-1">
                <p><strong>Requester:</strong> {formatName(requester)}</p>
                <p><strong>Supervisor:</strong> {formatName(supervisor)}</p>
                <p><strong>Purpose:</strong> {selectedRequest.purpose}</p>
                <p className="text-right">
                    <strong>Date Requested:</strong>{" "}
                    {new Date(selectedRequest.requestdate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            <Separator />

            <div>
                <h3 className="font-semibold text-primary mb-2">Items</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Served</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>UOM</TableHead>
                            <TableHead>Requested Qty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => {
                            const isServedItem = item.is_served === 1;
                            const isScratched =
                                isServedItem ||
                                toServe.some(
                                    (i) =>
                                        i.stockno === item.stockno &&
                                        i.requestdetailsid === item.requestdetailsid
                                );

                            const textStyle = cn(
                                selectedRequest?.xstatus !== "Served" &&
                                    isScratched &&
                                    "line-through text-muted-foreground"
                            );

                            return (
                                <TableRow key={index} className="cursor-pointer">
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={isScratched}
                                            onCheckedChange={() => isAcknowledged && toggleScratch(index)}
                                            disabled={!isAcknowledged}
                                        />
                                    </TableCell>
                                    <TableCell
                                        onClick={() => isAcknowledged && toggleScratch(index)}
                                        className={textStyle}
                                    >
                                        {item.item}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => isAcknowledged && toggleScratch(index)}
                                        className={textStyle}
                                    >
                                        {item.uom_name}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => isAcknowledged && toggleScratch(index)}
                                        className={textStyle}
                                    >
                                        {item.quantity}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {selectedRequest?.xstatus === "Served" && (
                <div className="text-sm text-muted-foreground mt-4">
                    <strong>Remarks:</strong> {selectedRequest?.remarks || "—"}
                </div>
            )}

            {isAcknowledged && (
                <>
                    <Separator />
                    <div className="space-y-1">
                        <label
                            htmlFor="remarks"
                            className="text-sm font-medium text-muted-foreground"
                        >
                            Remarks from Supply Office
                        </label>
                        <textarea
                            id="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full border bg-muted p-2 text-sm resize-y min-h-[80px] focus:ring-1 focus:ring-primary"
                            placeholder="Notes or instructions..."
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default RequestsDetails;
