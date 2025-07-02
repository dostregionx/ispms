<?php

namespace App\Http\Controllers;

use App\Models\RequestDetailsModel;
use App\Models\RequestSummaryModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewRequestNotification;
use PHPUnit\TextUI\XmlConfiguration\Logging\TeamCity;


class RequestController extends Controller
{
    public function index()
    {
        $employees = DB::connection('mysql2')->table('tblemppersonal')->get()->toArray();
        

            $items = DB::table('tblinventory_items as a')
                ->join('tbluom as c', 'c.uomid', '=', 'a.uomid')
                ->select(
                    'a.invitemsid',
                    'a.stock_no',
                    'a.item',

                    DB::raw("
                        CASE 
                            WHEN (
                                SUM(a.quantity) - (
                                    SELECT COALESCE(SUM(b.quantity), 0) 
                                    FROM tblrequest_details b 
                                    WHERE b.is_served = 1 
                                    AND b.stock_no = a.stock_no
                                )
                            ) > 1 THEN CONCAT(c.name, 's')
                            ELSE c.name
                        END as uom_name
                    "),

                    DB::raw("
                        CASE 
                            WHEN (
                                SUM(a.quantity) - (
                                    SELECT COALESCE(SUM(b.quantity), 0) 
                                    FROM tblrequest_details b 
                                    WHERE b.is_served = 1 
                                    AND b.stock_no = a.stock_no
                                )
                            ) > 1 THEN CONCAT(c.abbreviation, 's')
                            ELSE c.abbreviation
                        END as uom_shorthand
                    "),

                    DB::raw('SUM(a.quantity) as inventory_quantity'),

                    DB::raw("(
                        SELECT COALESCE(SUM(b.quantity), 0) 
                        FROM tblrequest_details b 
                        WHERE b.is_served = 1 
                        AND b.stock_no = a.stock_no
                    ) as served_quantity"),

                    DB::raw("(
                        SUM(a.quantity) - (
                            SELECT COALESCE(SUM(b.quantity), 0) 
                            FROM tblrequest_details b 
                            WHERE b.is_served = 1 
                            AND b.stock_no = a.stock_no
                        )
                    ) as quantity")
                )
                ->groupBy('a.stock_no', 'a.item')
                ->get();

        return inertia('request/page',['employees' => $employees, 'items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        // Create the request summary
        $requestSummary = RequestSummaryModel::create($data['summary']);

        // Create each request detail
        foreach ($data['details'] as $details) {
            $details['requestsummaryid'] = $requestSummary->requestsummaryid;
            $details['quantity'] = $details['requestedQuantity'] ?? 0;
            RequestDetailsModel::create($details);
        }

        // Send email to supply office
        $recipientEmail = env('SUPPLY_OFFICE_EMAIL', 'supply@region10.dost.gov.ph');
        Mail::to($recipientEmail)->send(new NewRequestNotification($requestSummary));


        return back()->with('message', 'Your order has been sent!');
    }


    public function requestSent(){
        return inertia('request/RequestSent');
    }
}

