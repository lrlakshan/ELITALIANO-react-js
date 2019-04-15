<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class sale_invoice extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'invoiceNum', 'customerId', 'date', 'details', 'totalBill', 'discount', 'cashPaid', 'balance',
    ];
}
