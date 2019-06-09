<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\cash_received_from_other_income;
use Validator;
use Exception;
use Carbon\Carbon;

class cashReceivedFromOtherIncomesController extends Controller
{
    //insert cash received detials to the cash_received_from_other_incomes
    public function addCashReceivedFromOtherIncome(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'otherIncomeId'=> 'required',
            'date'=> 'required',
            'cashPaid'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $input = $request->all();
        $user = cash_received_from_other_income::create($input);
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
