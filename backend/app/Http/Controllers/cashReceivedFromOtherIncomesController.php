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




//----------------------OTHER INCOME RECEIVED API FOR CASH FLOW SUMMARY-------------------------------------

    //get all cash received from sales details
    public function getAllOtherIncomeReceivedDetails(){

        try {
        $otherIncomeDetials = array();
        $otherIncomeDetials = DB::table('other_incomes')
                            ->join('cash_received_from_other_incomes', 'other_incomes.otherIncomeId', '=', 'cash_received_from_other_incomes.otherIncomeId')
                            ->select(
                                'other_incomes.details', 
                                'cash_received_from_other_incomes.otherIncomeId', 
                                'cash_received_from_other_incomes.date', 
                                'cash_received_from_other_incomes.cashPaid'
                            )
                            ->get();

        $cashReceived = DB::table('cash_received_from_other_incomes')->sum('cashPaid');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($otherIncomeDetials),
                'cumCashReceived'=>$cashReceived,
                'data'=>$otherIncomeDetials
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    //get today other income received
    public function getTodayOtherIncomeReceivedDetails(){
        $myDate = Carbon::now();
        $todayDate =  $myDate->toDateString(); 

        try {
        $otherIncomeDetials = array();
        $otherIncomeDetials = DB::table('other_incomes')
                            ->join('cash_received_from_other_incomes', 'other_incomes.otherIncomeId', '=', 'cash_received_from_other_incomes.otherIncomeId')
                            ->select(
                                'other_incomes.details', 
                                'cash_received_from_other_incomes.otherIncomeId', 
                                'cash_received_from_other_incomes.date', 
                                'cash_received_from_other_incomes.cashPaid'
                            )
                            ->where('cash_received_from_other_incomes.date','=',$todayDate)
                            ->get();

        $cashReceived = DB::table('cash_received_from_other_incomes')->where('cash_received_from_other_incomes.date','=',$todayDate)->sum('cashPaid');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($otherIncomeDetials),
                'cumCashReceived'=>$cashReceived,
                'data'=>$otherIncomeDetials
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    //get all other income received from details between two dates
    public function searchOtherIncomeReceivedBetweenTimePeriod(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'from'=> 'required',
            'to'=> 'required',
        ]);

        $otherIncomeDetials = array();
        $otherIncomeDetials = DB::table('other_incomes')
                            ->join('cash_received_from_other_incomes', 'other_incomes.otherIncomeId', '=', 'cash_received_from_other_incomes.otherIncomeId')
                            ->select(
                                'other_incomes.details', 
                                'cash_received_from_other_incomes.otherIncomeId', 
                                'cash_received_from_other_incomes.date', 
                                'cash_received_from_other_incomes.cashPaid'
                            )
                            ->whereBetween('cash_received_from_other_incomes.date', [$request->from, $request->to])
                            ->get();

        $cashReceived = DB::table('cash_received_from_other_incomes')->whereBetween('cash_received_from_other_incomes.date', [$request->from, $request->to])->sum('cashPaid');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($otherIncomeDetials),
                'cumCashReceived'=>$cashReceived,
                'data'=>$otherIncomeDetials
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

}
