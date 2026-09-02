<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BFF Update</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <div style="max-width:620px;margin:30px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="padding:24px;background:#166534;color:#ffffff;">
            <h1 style="margin:0;font-size:24px;">Bride Future Foundation</h1>
            <p style="margin:8px 0 0;font-size:14px;">New Update</p>
        </div>

        <div style="padding:28px;">
            <h2 style="margin:0 0 10px;font-size:22px;">{{ $titleEn }}</h2>

            @if($titleBn)
                <h3 style="margin:0 0 18px;font-size:18px;font-weight:normal;">{{ $titleBn }}</h3>
            @endif

            @if($descriptionEn)
                <p style="line-height:1.7;margin:0 0 12px;">{{ \Illuminate\Support\Str::limit(strip_tags($descriptionEn), 500) }}</p>
            @endif

            @if($descriptionBn)
                <p style="line-height:1.7;margin:0 0 22px;">{{ \Illuminate\Support\Str::limit(strip_tags($descriptionBn), 500) }}</p>
            @endif

            <a href="{{ $url }}"
               style="display:inline-block;padding:12px 22px;background:#166534;color:#ffffff;text-decoration:none;border-radius:7px;font-weight:bold;">
                View Update
            </a>
        </div>

        <div style="padding:20px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
            <p style="margin:0 0 8px;">
                You are receiving this email because you subscribed to Bride Future Foundation updates.
            </p>
            <p style="margin:0;">
                <a href="{{ url('/api/v1/subscriptions/unsubscribe/' . $subscriber->unsubscribe_token) }}"
                   style="color:#166534;">
                    Unsubscribe from future updates
                </a>
            </p>
        </div>
    </div>
</body>
</html>
