<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class cash_received_from_other_income extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'otherIncomeId', 'date', 'cashPaid'
    ];
}
