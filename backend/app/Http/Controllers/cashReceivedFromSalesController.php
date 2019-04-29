<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\cash_received_from_sale;
use Validator;
use Exception;
use Carbon\Carbon;

class cashReceivedFromSalesController extends Controller
{
	//insert cash received detials to the cash_received_from_sales
    public function addCashReceived(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'invoiceNum'=> 'required',
            'date'=> 'required',
            'cashPaid'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $input = $request->all();
        $user = cash_received_from_sale::create($input);
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