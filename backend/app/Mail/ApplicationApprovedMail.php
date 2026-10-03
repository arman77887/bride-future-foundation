<?php

namespace App\Mail;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicationApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public JobApplication $application,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Application Approved - Bright Future Foundation',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.application-approved',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
