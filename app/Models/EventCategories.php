<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class EventCategories extends Model
{
    protected $fillable = [
        'event_id',
        'category_id'
    ];

    public function category(): HasOne {
        return $this->hasOne(Categories::class, 'id', 'category_id');
    }

}
