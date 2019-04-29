<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class cash_received_from_sale extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'invoiceNum', 'date', 'cashPaid'
    ];
}
