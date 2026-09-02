<?php

namespace App\Jobs;

use App\Mail\UpdateNotificationMail;
use App\Models\EmailNotificationLog;
use App\Models\EmailSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class SendUpdateNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(
        public string $updateType,
        public string $updateId,
        public string $titleBn,
        public string $titleEn,
        public string $descriptionBn,
        public string $descriptionEn,
        public string $url,
    ) {
    }

    public function handle(): void
    {
        EmailSubscriber::active()
            ->whereNotNull('unsubscribe_token')
            ->chunkById(100, function ($subscribers) {
                foreach ($subscribers as $subscriber) {
                    $log = EmailNotificationLog::firstOrCreate([
                        'email_subscriber_id' => $subscriber->id,
                        'update_type' => $this->updateType,
                        'update_id' => $this->updateId,
                    ]);

                    if ($log->sent_at) {
                        continue;
                    }

                    Mail::to($subscriber->email)->send(
                        new UpdateNotificationMail(
                            subscriber: $subscriber,
                            updateType: $this->updateType,
                            titleBn: $this->titleBn,
                            titleEn: $this->titleEn,
                            descriptionBn: $this->descriptionBn,
                            descriptionEn: $this->descriptionEn,
                            url: $this->url,
                        )
                    );

                    $log->update([
                        'sent_at' => now(),
                    ]);
                }
            });
    }
}
