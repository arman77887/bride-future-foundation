<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subscription\SubscribeRequest;
use App\Models\EmailSubscriber;
use App\Mail\AdminNotificationMail;
use App\Mail\SubscriptionConfirmationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    public function subscribe(SubscribeRequest $request): JsonResponse
    {
        $email = strtolower(trim($request->email));

        $subscriber = EmailSubscriber::where('email', $email)->first();

        if ($subscriber) {
            $subscriber->update([
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);

            DB::table('email_subscribers')
                ->where('id', $subscriber->id)
                ->update(['is_active' => DB::raw('TRUE')]);
        } else {
            $id = (string) \Illuminate\Support\Str::uuid();

            DB::table('email_subscribers')->insert([
                'id' => $id,
                'email' => $email,
                'unsubscribe_token' => (string) \Illuminate\Support\Str::uuid(),
                'is_active' => DB::raw('TRUE'),
                'subscribed_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $subscriber = EmailSubscriber::findOrFail($id);
        }

        $recipients = config('mail.notification_recipients', [
            'tha.crypticx.official@gmail.com',
            'dyppomahadi2000@gmail.com',
        ]);

        // Admin notification
        Mail::to($recipients)->send(
            new AdminNotificationMail(
                notificationType: 'NEWSLETTER_SUBSCRIPTION',
                title: 'New Newsletter Subscriber',
                data: [
                    'email' => $subscriber->email,
                    'subscriber_id' => $subscriber->id,
                    'subscribed_at' => $subscriber->subscribed_at,
                ],
            )
        );

        // Confirmation to the subscriber
        Mail::to($subscriber->email)->send(
            new SubscriptionConfirmationMail($subscriber)
        );

        return response()->json([
            'success' => true,
            'message' => 'Successfully subscribed to BFF updates.',
            'data' => [
                'email' => $subscriber->email,
                'is_active' => (bool) $subscriber->is_active,
            ],
        ], 201);
    }

    public function unsubscribeByToken(string $token): JsonResponse
    {
        $subscriber = EmailSubscriber::where('unsubscribe_token', $token)->first();

        if (! $subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired unsubscribe link.',
            ], 404);
        }

        DB::table('email_subscribers')
            ->where('id', $subscriber->id)
            ->update([
                'is_active' => DB::raw('FALSE'),
                'unsubscribed_at' => now(),
                'updated_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Successfully unsubscribed from BFF updates.',
        ]);
    }

    public function unsubscribe(SubscribeRequest $request): JsonResponse
    {
        $email = strtolower(trim($request->email));

        $subscriber = EmailSubscriber::where('email', $email)->first();

        if (! $subscriber) {
            return response()->json([
                'success' => true,
                'message' => 'Subscription not found or already unsubscribed.',
            ]);
        }

        DB::table('email_subscribers')
            ->where('id', $subscriber->id)
            ->update([
                'is_active' => DB::raw('FALSE'),
                'unsubscribed_at' => now(),
                'updated_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Successfully unsubscribed from BFF updates.',
        ]);
    }
}
