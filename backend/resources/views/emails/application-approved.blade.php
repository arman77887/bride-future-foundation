<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Approved</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:Arial,sans-serif;color:#1f2937;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center" style="padding:32px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                   style="max-width:620px;background:#ffffff;border-radius:12px;overflow:hidden;">
                <tr>
                    <td style="background:#065f46;padding:26px;text-align:center;color:#ffffff;">
                        <h1 style="margin:0;font-size:24px;">Bright Future Foundation</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:32px;">
                        <h2 style="margin-top:0;color:#065f46;">Application Approved</h2>

                        <p>Dear {{ $application->applicant_name }},</p>

                        <p>
                            Congratulations! Your application to Bright Future Foundation
                            has been approved.
                        </p>

                        <p>
                            <strong>Application Reference:</strong>
                            {{ $application->application_reference }}
                        </p>

                        @if($application->vacancy)
                            <p>
                                <strong>Position:</strong>
                                {{ $application->vacancy->position?->title_en ?? $application->vacancy->title_en ?? $application->vacancy->title_bn }}
                            </p>

                            <p>
                                <strong>Department:</strong>
                                {{ $application->vacancy->department?->name_en ?? $application->vacancy->department?->name_bn ?? 'N/A' }}
                            </p>
                        @endif

                        <p>
                            Your Foundation Member profile has now been created using your
                            registered account and approved application information.
                        </p>

                        <p style="margin-bottom:0;">
                            Regards,<br>
                            <strong>Bright Future Foundation</strong>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
