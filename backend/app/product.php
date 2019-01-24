<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class product extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'productId', 'productName', 'purchasePrice', 'sellingPrice', 'marketPrice', 'amountAvailable',
    ];
}
