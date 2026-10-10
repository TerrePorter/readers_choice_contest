<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Events extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'campaign_id',
        'enabled',
        'banner_image',
        'info_text',
        'info_text_image',
        'start_date',
        'end_date'
    ];

    public function events() : BelongsTo
    {
        return $this->belongsTo(Campaigns::class, 'id', 'campaign_id');
    }

    public function eventCategories(): HasMany
    {
        return $this->hasMany(EventCategories::class, 'event_id', 'id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Categories::class, 'event_categories', 'event_id', 'category_id');
    }
}
