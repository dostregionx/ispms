import React, { useEffect, useState } from "react";

const RISDetails = ({
    selectedEmployee,
    selectedMonth,
    selectedYear,
    setRISDatax,
}) => {
    const [RISData, setRISData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                "/reports/ris/show/" +
                    selectedEmployee.empNumber +
                    "?month=" +
                    selectedMonth +
                    "&year=" +
                    selectedYear
            );

            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setRISData(data);
            setRISDatax(data);
        } catch (error) {
            console.error("Error fetching RIS data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedEmployee) {
            getData();
        }
    }, [selectedEmployee, selectedMonth, selectedYear]);

    if (!selectedEmployee)
        return (
            <div className="p-4 text-center text-red-600">
                No employee selected.
            </div>
        );

    if (loading) {
        return (
            <div className="p-4 text-center text-gray-600">
                <svg
                    className="animate-spin h-8 w-8 mx-auto text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
                <div className="mt-2 text-sm">Loading RIS data...</div>
            </div>
        );
    }

    if (!RISData || RISData.length === 0)
        return (
            <div className="p-4 text-center text-red-600">
                No RIS data available for {selectedEmployee.firstname}
                {selectedEmployee.middlename
                    ? ` ${selectedEmployee.middlename.charAt(0)}.`
                    : ""}
                {selectedEmployee.surname ? ` ${selectedEmployee.surname}` : ""}
                {selectedEmployee.nameExtension
                    ? ` ${selectedEmployee.nameExtension}`
                    : ""}{" "}
                for the month of {selectedMonth} {selectedYear}.
            </div>
        );

    return (
        <div className="p-4 max-w-7xl mx-auto text-base">
            <div className="text-right text-r text-sm text-12">
                <i>Appendix 63</i>
            </div>
            <table className="table-auto w-full border border-black border-collapse text-sm text-13">
                <tbody>
                    <tr>
                        <td
                            className="text-center text-xl font-bold p-1 brdr-t brdr-l brdr-r text-16"
                            colSpan={10}
                        >
                            <b>REQUISITION AND ISSUE SLIP</b>
                        </td>
                    </tr>
                    <tr className="brdr-l brdr-r">
                        <td colSpan={10} className="p-1">
                            &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td
                            className="text-l p-1 font-semibold brdr-l"
                            colSpan={5}
                        >
                            <b>
                                Entity Name: Department of Science and
                                Technology
                            </b>
                        </td>
                        <td className="p-1" colSpan={3}>
                            <b>Fund Cluster:</b>
                        </td>
                        <td colSpan={2} className="text-l p-1 brdr-r">
                            <u>General Fund</u>
                        </td>
                    </tr>
                    <tr className=" border-black brdr-l brdr-r">
                        <td className="p-1 font-semibold" colSpan={1}></td>
                        <td
                            className="p-1 font-semibold text-left text-l"
                            colSpan={9}
                        >
                            &nbsp;&nbsp;&nbsp;&nbsp; <b>Regional Office 10</b>
                        </td>
                    </tr>
                    <tr className="border-t border-black brdr-t brdr-l brdr-r">
                        <td className="p-1 font-semibold text-l" colSpan={1}>
                            Division:
                        </td>
                        <td
                            className="p-1 border-r border-black brdr-r text-l"
                            colSpan={4}
                        >
                            {selectedEmployee.division || ""}
                        </td>
                        <td
                            className="p-1 font-semibold text-12 text-l text-13"
                            colSpan={3}
                        >
                            Responsibility Center Code:
                        </td>
                        <td
                            className="text-13 p-1 text-left text-l brdr-r"
                            colSpan={3}
                        >
                            {selectedEmployee.empNumber &&
                            selectedEmployee.empNumber.length > 4
                                ? selectedEmployee.empNumber.slice(0, -4)
                                : selectedEmployee.empNumber || ""}
                        </td>
                    </tr>
                    <tr className="border-b border-black">
                        <td
                            className="p-1 font-semibold text-l brdr-l"
                            colSpan={1}
                        >
                            Office:
                        </td>
                        <td
                            className="p-1 border-r border-black brdr-r text-l"
                            colSpan={4}
                        >
                            {selectedEmployee.office || ""}
                        </td>
                        <td className="p-1 font-semibold text-l" colSpan={1}>
                            RIS No.:
                        </td>
                        <td className="p-1 brdr-r text-l" colSpan={4}>
                            {selectedYear +
                                "-" +
                                selectedMonth +
                                "-" +
                                selectedEmployee.risno || ""}
                        </td>
                    </tr>

                    <tr className="brdr-a">
                        <td
                            className="border border-black p-1 text-center font-semibold brdr-a text-12"
                            colSpan={6}
                        >
                            <b>
                                <i>Requisition</i>
                            </b>
                        </td>
                        <td
                            className="border border-black p-1 font-semibold brdr-a text-12"
                            colSpan={2}
                        >
                            <b>
                                <i>Stock Available?</i>
                            </b>
                        </td>
                        <td
                            className="border border-black p-1 font-semibold brdr-a text-12 text-center"
                            colSpan={2}
                        >
                            <b>
                                <i>Issue</i>
                            </b>
                        </td>
                    </tr>
                    <tr className="bg-gray-100 text-center font-semibold brdr-a">
                        <th className="border border-black text-base w-20 brdr-a width-10">
                            Stock No.
                        </th>
                        <th className="border border-black text-base w-4 brdr-a text-13 width-7">
                            UOM
                        </th>
                        <th
                            className="border border-black text-base w-96 brdr-a text-13 w-50"
                            colSpan={3}
                        >
                            Description
                        </th>
                        <th className="border border-black text-base w-10 brdr-a text-13 width-8">
                            Quantity
                        </th>
                        <th className="border border-black text-base w-16 brdr-a text-13  width-8">
                            Yes
                        </th>
                        <th className="border border-black text-base w-16  brdr-a text-13  width-8">
                            No
                        </th>
                        <th className="border border-black text-base w-12 brdr-a text-13  width-8">
                            Quantity
                        </th>
                        <th className="border border-black text-base w-12 brdr-a text-13  width-8">
                            Remarks
                        </th>
                    </tr>
                    <tr>
                        <td className="text-13 p-1 text-l brdr-l brdr-r p-2"></td>
                        <td className="text-13 border-l border-r border-black p-1 brdr-r p-2"></td>
                        <td
                            className="text-13 border-black p-1 text-left text-l brdr-r p-2"
                            colSpan={3}
                        ></td>
                        <td className="text-13 border-l border-r border-black p-1 brdr-r p-2"></td>
                        <td className="text-13 border-l border-r border-black p-1 brdr-r p-2"></td>
                        <td className="text-13 border-black p-1 brdr-r"></td>
                        <td className="text-13 border-l border-r border-black p-1 brdr-r p-2"></td>
                        <td className="text-13 border-l border-r border-black p-1 brdr-r p-2"></td>
                    </tr>
                    {RISData.map((item, idx) => (
                        <tr
                            key={idx}
                            className="text-center align-top items-list"
                        >
                            <td className="text-13 p-1 text-l brdr-l brdr-r">
                                {item.stock_no || ""}
                            </td>
                            <td className="text-13 border-l border-r border-black p-1 brdr-r">
                                {item.unit || ""}
                            </td>
                            <td
                                className="text-13 border-black p-1 text-left text-l brdr-r"
                                colSpan={3}
                            >
                                {item.item}
                            </td>
                            <td className="text-13 border-l border-r border-black p-1 brdr-r">
                                {item.quantity}
                            </td>
                            <td className="text-13 border-l border-r border-black p-1 brdr-r">
                                {item.is_served ? "x" : ""}
                            </td>
                            <td className="text-13 border-black p-1 brdr-r">
                                {!item.is_served ? "x" : ""}
                            </td>
                            <td className="text-13 border-l border-r border-black p-1 brdr-r">
                                {item.issueQty}
                            </td>
                            <td className="text-13 border-l border-r border-black p-1 brdr-r"></td>
                        </tr>
                    ))}
                    <tr>
                        <td className="text-13 p-1 text-l brdr-l brdr-r p-2"></td>
                        <td className="text-13 border-l border-r border-black p-1 brdr-r p-2"></td>
                        <td
                            className="text-13 border-black p-1 text-left text-l brdr-r p-2"
                            colSpan={3}
                        ></td>
                        <td className="text-13 border-l border-r border-black p-1 brdr-r p-2"></td>
                        <td className="text-13 border-l border-r border-black p-1 brdr-r p-2"></td>
                        <td className="text-13 border-black p-1 brdr-r"></td>
                        <td className="text-13 border-l border-r border-black p-1 brdr-r p-2"></td>
                        <td className="text-13 border-l border-r border-black p-1 brdr-r p-2"></td>
                    </tr>
                    <tr className="brdr-a">
                        <td
                            className="border border-black p-1 font-semibold brdr-a text-r"
                            colSpan={1}
                        >
                            <i>Purpose:</i>
                        </td>
                        <td
                            className="border border-black p-1 text-l"
                            colSpan={9}
                        >
                            <i>Supplies and Materials</i>
                        </td>
                    </tr>
                    <tr className="brdr-a">
                        <td colSpan={10} className="border border-black p-1">
                            &nbsp;
                        </td>
                    </tr>
                    <tr className="text-center font-semibold brdr-a">
                        <td
                            colSpan={2}
                            className="border border-black p-1 brdr-a"
                        ></td>
                        <td
                            className="border border-black p-1 brdr-a text-l text-left"
                            colSpan={2}
                        >
                            <b>Requested by:</b>
                        </td>
                        <td
                            className="border border-black p-1 brdr-a width-25 text-left text-l"
                            colSpan={3}
                        >
                            <b>Approved/Issued by:</b>
                        </td>
                        <td
                            className="border border-black p-1 brdr-a width-25 text-left text-l"
                            colSpan={3}
                        >
                            <b>Received by:</b>
                        </td>
                    </tr>
                    <tr className="brdr-l brdr-r text-13">
                        <td
                            className="border border-black p-1 brdr-r text-left text-l"
                            colSpan={2}
                        >
                            Signature:
                        </td>
                        <td
                            className="border border-black p-1 brdr-r"
                            colSpan={2}
                        ></td>
                        <td
                            className="border border-black p-1 brdr-r"
                            colSpan={3}
                        ></td>
                        <td
                            className="border border-black p-1 brdr-r"
                            colSpan={3}
                        ></td>
                    </tr>
                    <tr className="text-center brdr-r brdr-l brdr-b">
                        <td
                            colSpan={2}
                            className="border border-black px-2 text-left brdr-r text-left text-l"
                        >
                            PRINTED NAME:
                        </td>
                        <td
                            className="border border-black px-2 text-semibold brdr-r text-13"
                            colSpan={2}
                        >
                            <b>
                                {selectedEmployee.firstname?.toUpperCase()}
                                {selectedEmployee.middlename
                                    ? ` ${selectedEmployee.middlename
                                          .charAt(0)
                                          .toUpperCase()}.`
                                    : ""}
                                {selectedEmployee.surname
                                    ? ` ${selectedEmployee.surname.toUpperCase()}`
                                    : ""}
                                {selectedEmployee.nameExtension
                                    ? ` ${selectedEmployee.nameExtension.toUpperCase()}`
                                    : ""}
                            </b>
                        </td>
                        <td
                            className="border border-black px-2 text-semibold brdr-r text-13"
                            colSpan={3}
                        >
                            <b>RAZIEL ANTONIETTE P. BAYAGNA</b>
                        </td>
                        <td
                            className="border border-black px-2 text-semibold text-13"
                            colSpan={3}
                        >
                            <b>
                                {selectedEmployee.firstname?.toUpperCase()}
                                {selectedEmployee.middlename
                                    ? ` ${selectedEmployee.middlename
                                          .charAt(0)
                                          .toUpperCase()}.`
                                    : ""}
                                {selectedEmployee.surname
                                    ? ` ${selectedEmployee.surname.toUpperCase()}`
                                    : ""}
                                {selectedEmployee.nameExtension
                                    ? ` ${selectedEmployee.nameExtension.toUpperCase()}`
                                    : ""}
                            </b>
                        </td>
                    </tr>
                    <tr className="text-center brdr-a">
                        <td
                            colSpan={2}
                            className="border border-black p-1 text-left brdr-a text-left text-l"
                        >
                            Designation:
                        </td>
                        <td
                            className="border border-black p-1 brdr-a"
                            colSpan={2}
                        >
                            {selectedEmployee.positionAbb || ""}
                        </td>
                        <td
                            className="border border-black p-1 brdr-a"
                            colSpan={3}
                        >
                            Admin Officer V
                        </td>
                        <td
                            className="border border-black p-1 brdr-a"
                            colSpan={3}
                        >
                            {selectedEmployee.positionAbb || ""}
                        </td>
                    </tr>
                    <tr className="text-center brdr-a">
                        <td
                            colSpan={2}
                            className="border border-black p-1 text-left brdr-a text-left text-l"
                        >
                            Date:
                        </td>
                        <td
                            className="border border-black p-1 brdr-a"
                            colSpan={2}
                        ></td>
                        <td
                            className="border border-black p-1 brdr-a"
                            colSpan={3}
                        ></td>
                        <td
                            className="border border-black p-1 brdr-a"
                            colSpan={3}
                        ></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RISDetails;
