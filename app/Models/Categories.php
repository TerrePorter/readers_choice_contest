<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Categories extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'group_id'
    ];

    public function group() : HasOne
    {
       return $this->hasOne(CategoriesGroup::class, 'id', 'group_id');
    }
}
