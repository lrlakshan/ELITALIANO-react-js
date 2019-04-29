<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class cash_paid_to_supplier extends Model
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
