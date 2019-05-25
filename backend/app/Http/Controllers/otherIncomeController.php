<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\other_income;
use Validator;
use Exception;
use Carbon\Carbon;

class otherIncomeController extends Controller
{
    //add sales invoice record
    public function addOtherIncome(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'date'=> 'required',
            'details'=> 'required',
            'totalBill'=> 'required',
            'cashPaid'=> 'required',
            'balance' => 'required',
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $input = $request->all();
        $user = other_income::create($input);
        return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }
}
