<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class purchase_invoice extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'invoiceNum', 'supplierId', 'date', 'details', 'totalBill', 'discount', 'cashPaid', 'balance',
    ];
}
