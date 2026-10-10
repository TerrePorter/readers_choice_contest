<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CategoriesDatabase extends Model
{
    protected $fillable = [
        'category_id',
        'campaign_id',
        'name',
        'city',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'category_id', 'id');
    }
}
