<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SupervisorNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $requestSummary;
    public $requesterName;
    public $supervisorName;

    /**
     * Create a new message instance.
     */
    public function __construct($requestSummary, $requesterName = null, $supervisorName = null)
    {
        $this->requestSummary = $requestSummary;
        $this->requesterName = $requesterName;
        $this->supervisorName = $supervisorName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[ISPMS] Staff Supplies Request Notification',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.supervisor-notification',  // name of your Blade file
            with: [
                'requestSummary' => $this->requestSummary,
                'requesterName' => $this->requesterName,
                'supervisorName' => $this->supervisorName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
