<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Queue extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'number',
        'user_id',
        'status',
        'called_at',
        'completed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'called_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user that owns the queue.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the status label.
     *
     * @return string
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'waiting' => 'Waiting',
            'serving' => 'Serving',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            default => 'Unknown',
        };
    }

    /**
     * Check if the queue is active.
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return in_array($this->status, ['waiting', 'serving']);
    }

    /**
     * Calculate the waiting time in minutes.
     *
     * @return int|null
     */
    public function getWaitingTimeAttribute(): ?int
    {
        if (!$this->called_at) {
            return null;
        }

        return $this->created_at->diffInMinutes($this->called_at);
    }

    /**
     * Calculate the service time in minutes.
     *
     * @return int|null
     */
    public function getServiceTimeAttribute(): ?int
    {
        if (!$this->called_at || !$this->completed_at) {
            return null;
        }

        return $this->called_at->diffInMinutes($this->completed_at);
    }
}
