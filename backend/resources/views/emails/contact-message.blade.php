<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
</head>
<body style="margin:0; padding:24px; background:#f5f5f5; font-family:Arial, sans-serif; color:#222;">
    <div style="max-width:680px; margin:0 auto; background:#ffffff; padding:30px; border-radius:10px;">
        <h2 style="margin-top:0;">New Contact Message</h2>

        <p><strong>Name:</strong> {{ $contactMessage->name }}</p>
        <p><strong>Email:</strong> {{ $contactMessage->email }}</p>

        @if($contactMessage->phone)
            <p><strong>Phone:</strong> {{ $contactMessage->phone }}</p>
        @endif

        <p><strong>Subject:</strong> {{ $contactMessage->subject }}</p>

        <hr style="border:0; border-top:1px solid #ddd; margin:24px 0;">

        <p><strong>Message:</strong></p>

        <div style="white-space:pre-wrap; background:#f8f8f8; padding:16px; border-radius:8px;">{{ $contactMessage->message }}</div>

        <p style="margin-top:24px; color:#666; font-size:13px;">
            This message was submitted through the Bright Further Foundation website.
        </p>
    </div>
</body>
</html>
