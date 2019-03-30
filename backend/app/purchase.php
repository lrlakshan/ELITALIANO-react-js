<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class purchase extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'invoiceNum', 'date', 'productId', 'supplierId', 'purchasePrice', 'amountPurchases',
    ];
}
