<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
    <h2>{{ $title }}</h2>

    <p><strong>Notification Type:</strong> {{ $notificationType }}</p>

    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse;">
        @foreach ($data as $key => $value)
            <tr>
                <td><strong>{{ ucwords(str_replace('_', ' ', $key)) }}</strong></td>
                <td>{{ is_scalar($value) || $value === null ? ($value ?? '-') : json_encode($value) }}</td>
            </tr>
        @endforeach
    </table>

    <p style="margin-top: 24px;">
        Bright Future Foundation
    </p>
</body>
</html>
