<?php

namespace App\Http\Controllers;

use App\Models\RequestDetailsModel;
use App\Models\RequestSummaryModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\RequestAcknowledgedMail;
use App\Mail\RequestReadyForPickupMail;


class InventoryRequestsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = collect(DB::connection('mysql2')->select("
            SELECT 
                a.empNumber, 
                a.surname, 
                a.firstname, 
                a.nameExtension, 
                a.middlename, 
                a.middleInitial, 
                c.positionDesc
            FROM tblemppersonal a 
            LEFT JOIN tblempposition b ON b.empNumber = a.empNumber
            LEFT JOIN tblposition c ON c.positionCode = b.positionCode
        "))->keyBy('empNumber');


        // Load all request summaries
        $requests = RequestSummaryModel::orderBy('requestsummaryid','DESC')->get()->toArray();


        // Merge requests with both requester and supervisor info
        $mergedRequests = array_map(function ($request) use ($employees) {
            $requesterEmpNo = $request['requester'];
            $supervisorEmpNo = $request['supervisor'];

            // Add requester details
            $request['requester_details'] = $employees->has($requesterEmpNo)
                ? (array) $employees->get($requesterEmpNo)
                : null;


            // Add supervisor details
            $request['supervisor_details'] = $employees->has($supervisorEmpNo)
                ? (array) $employees->get($supervisorEmpNo)
                : null;

            return $request;
        }, $requests);


        return inertia('requests/page', [
            'requests' => $mergedRequests,
        ]);
    }


    public function show(string $requestsummaryid)
    {

        $data = DB::table('tblrequest_details as a')
            ->join('tblinventory_items as b', 'b.stock_no', '=', 'a.stock_no')
            ->leftJoin('tblrequest_summary as s', 's.requestsummaryid', '=', 'a.requestsummaryid')
            ->join('tbluom as c', 'c.uomid', '=', 'b.uomid')
            ->where('a.requestsummaryid', $requestsummaryid)
            ->select(
                'a.*',
                'b.item',
                'c.name as uom_name'
            )
            ->groupBy(
                'b.stock_no',
                'a.requestdetailsid',
                'a.requestsummaryid',
                'a.stock_no',
                'b.item'
            )
            ->get();

            return response()->json([
                'items' => $data
            ]);
    }


    public function acknowledge($requestsummaryid)
    {
        $requestSummary = RequestSummaryModel::find($requestsummaryid);

        if ($requestSummary) {
            $requestSummary->xstatus = 'Acknowledged';
            $requestSummary->save();

            $recipientEmail = $this->get_employee_email($requestSummary->requester);


            $data = [
                'requestSummary' => $requestSummary,
            ];

            $this->sendNotification(fn () => Mail::to($recipientEmail)->send(new RequestAcknowledgedMail($data)));

            return response()->json(['message' => 'Request acknowledged successfully.']);
        }

        return response()->json(['message' => 'Request summary not found.'], 404);
    }



    public function serve(Request $request, int $requestsummaryid)
    {
        $data = $request->all();
        $items = $data['toServe'];

        foreach ($items as $item) {
            RequestDetailsModel::where('requestdetailsid', $item['requestdetailsid'])
                ->update(['is_served' => 1]);
        }

        $requestSummary = RequestSummaryModel::where('requestsummaryid', $requestsummaryid)->first();
        $requestSummary->xstatus = 'Served';
        $requestSummary->remarks = $data['remarks'];
        $requestSummary->save();

        // Example recipient
        $recipientEmail = $this->get_employee_email($requestSummary->requester);


        $this->sendNotification(fn () => Mail::to($recipientEmail)->send(new RequestReadyForPickupMail([
            'requestSummary' => $requestSummary
        ])));

        return response()->json(['message' => 'Request has been served successfully.']);
    }

    public function get_employee_email($empNumber)
    {
        return DB::connection('mysql2')->table('tblemppersonal')
            ->where('empNumber', $empNumber)
            ->select(DB::raw('COALESCE(work_email, email) as email'))
            ->value('email'); // this gets the single email value
    }


    private function sendNotification(callable $send): void
    {
        try {
            $send();
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning(
                'ISPMS email notification failed; transaction remains saved.',
                ['controller' => static::class,
                 'exception_class' => get_class($e),
                 'exception_code' => $e->getCode()]
            );
        }
    }

}
