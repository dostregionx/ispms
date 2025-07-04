<p>Dear {{ $supervisorName ?? 'Supervisor' }},</p>

<p>This is an automated notification to inform you that your staff has submitted a supplies request through the ISPMS.</p>

<p><strong>Request Summary:</strong></p>
<ul>
    <li><strong>Request Date:</strong> {{ \Carbon\Carbon::parse($requestSummary->requestdate)->format('F j, Y') }}</li>
    <li><strong>Purpose:</strong> {{ $requestSummary->purpose }}</li>
    <li><strong>Requested By (Emp No):</strong> {{ $requestSummary->requester }}</li>
</ul>

<p>This is for your reference.</p>

<br>
<small><i>This is a system-generated email. Please do not reply to this message.</i></small>
