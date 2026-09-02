<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactMessageMail;
use App\Models\ContactMessage;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class ContactMessageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $key = 'contact-message:' . Str::lower((string) $request->ip());

        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json([
                'message' => 'Too many messages. Please try again later.',
            ], 429);
        }

        RateLimiter::hit($key, 60);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'subject' => ['required', 'string', 'max:200'],
            'message' => ['required', 'string', 'max:10000'],
        ]);

        $contactMessage = ContactMessage::create([
            'name' => trim($validated['name']),
            'email' => trim($validated['email']),
            'phone' => isset($validated['phone'])
                ? trim($validated['phone'])
                : null,
            'subject' => trim($validated['subject']),
            'message' => trim($validated['message']),
            'status' => 'new',
        ]);

        $setting = SystemSetting::where('key', 'contact_message_email')->first();

        $recipient = $setting?->value
            ?: config('mail.contact_recipient', 'tha.crypticx.official@gmail.com');

        Mail::to($recipient)->send(
            new ContactMessageMail($contactMessage)
        );

        return response()->json([
            'message' => 'Your message has been sent successfully.',
            'data' => [
                'id' => $contactMessage->id,
                'status' => $contactMessage->status,
            ],
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('subject', 'ilike', "%{$search}%");
            });
        }

        $messages = $query
            ->latest()
            ->paginate((int) $request->input('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);

        if ($message->status === 'new') {
            $message->update([
                'status' => 'read',
                'read_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $message->fresh(),
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:new,read,replied,closed'],
        ]);

        $message = ContactMessage::findOrFail($id);

        $data = [
            'status' => $validated['status'],
        ];

        if ($validated['status'] !== 'new' && !$message->read_at) {
            $data['read_at'] = now();
        }

        if ($validated['status'] === 'new') {
            $data['read_at'] = null;
        }

        $message->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Contact message status updated successfully.',
            'data' => $message->fresh(),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        ContactMessage::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contact message deleted successfully.',
        ]);
    }
}
