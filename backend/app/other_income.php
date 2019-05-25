<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class other_income extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
         'date', 'details', 'totalBill', 'cashPaid', 'balance',
    ];
}
