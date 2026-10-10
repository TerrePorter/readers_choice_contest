<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ballot extends Model
{
    protected $fillable = [
        'ballot_token',
        'event_id',
        'category_id',
        'categories_database_id',
        'session_id',
    ];
}
