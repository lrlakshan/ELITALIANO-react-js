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

    //get the next other income ID number
    public function otherIncomeNextNumber(){
    	try {
    	$next_other_income_id = array();
    	$next_other_income_id = other_income::max('otherIncomeId')+1;
	    	return response()->json([
	    		'success'=>true,
	    		'error'=>null,
	    		'code'=>200,
	    		'data'=>$next_other_income_id
	    	], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getMessage()),
    			'code'=>500
    		], 500);
    	}
    }

    //get remaining other income receivable details
    public function getOtherIncomeReceivableDetails(){
        try {
        $receivableDetials = array();
        $receivableDetials = DB::table('other_incomes')
                            ->select(
                                'otherIncomeId',
                                'date', 
                                'details',
                                'totalBill',
                                'cashPaid',
                                'balance'
                            )
                            ->where('balance','!=',"0.00")
                            ->orderBy('otherIncomeId', 'ASC')
                            ->get();
            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($receivableDetials),
                'data'=>$receivableDetials
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    //update sales invoice record for trade receivable payments
    public function OtherIncomeReceivablePayments(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'otherIncomeId'=> 'required',
            'cashPaid' => 'required',
            'balance'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $data = $request->all();
        $otherIncomeId = $data['otherIncomeId'];

        if($otherIncomeId != "" && !empty($otherIncomeId)){

            $update = other_income::where('otherIncomeId', $otherIncomeId)->first();

            if($update){
                    other_income::where('otherIncomeId', $otherIncomeId)->update([
                    'cashPaid' => $request->cashPaid,
                    'balance' => $request->balance
                ]);

                return response()->json([
                    'success'=>true,
                    'error'=>[],
                    'code'=>200
                ],200);
            }   
        }
        return response()->json([
                    'success'=>false,
                    'error'=>'Record not found',
                    'code'=>401
                ],401);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }
}
