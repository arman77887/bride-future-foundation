<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $notificationType,
        public string $title,
        public array $data = [],
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[BFF] ' . $this->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-notification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
