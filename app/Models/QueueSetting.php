<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QueueSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'current_number',
        'status',
        'start_time',
        'end_time',
        'average_service_time',
        'date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Check if the queue is active.
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the queue is paused.
     *
     * @return bool
     */
    public function isPaused(): bool
    {
        return $this->status === 'paused';
    }

    /**
     * Check if the queue is closed.
     *
     * @return bool
     */
    public function isClosed(): bool
    {
        return $this->status === 'closed';
    }

    /**
     * Get the formatted start time.
     *
     * @return string
     */
    public function getFormattedStartTimeAttribute(): string
    {
        return $this->start_time->format('H:i');
    }

    /**
     * Get the formatted end time.
     *
     * @return string
     */
    public function getFormattedEndTimeAttribute(): string
    {
        return $this->end_time->format('H:i');
    }

    /**
     * Get the status label.
     *
     * @return string
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'active' => 'Active',
            'paused' => 'Paused',
            'closed' => 'Closed',
            default => 'Unknown',
        };
    }
}
