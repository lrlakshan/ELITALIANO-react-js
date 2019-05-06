<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class employee_type extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'empId','empName','designation'
    ];
}
