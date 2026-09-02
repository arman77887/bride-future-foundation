<?php

namespace App\Mail;

use App\Models\EmailSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UpdateNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public EmailSubscriber $subscriber,
        public string $updateType,
        public string $titleBn,
        public string $titleEn,
        public string $descriptionBn,
        public string $descriptionEn,
        public string $url,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'BFF Update: ' . $this->titleEn,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.update-notification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
