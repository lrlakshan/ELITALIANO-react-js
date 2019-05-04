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

//----------------------CASH RECEIVED API FOR CASH FLOW SUMMARY-------------------------------------

    //get all cash received from sales details
    public function getAllCashReceivedInvoiceDetails(){

        try {
        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('cash_received_from_sales', 'sale_invoices.invoiceNum', '=', 'cash_received_from_sales.invoiceNum')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'cash_received_from_sales.invoiceNum',
                                'customer_details.customerName', 
                                'cash_received_from_sales.date', 
                                'cash_received_from_sales.cashPaid'
                            )
                            ->get();

        $cashReceived = DB::table('cash_received_from_sales')->sum('cashPaid');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumCashReceived'=>$cashReceived,
                'data'=>$invoiceDetials
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    //get today cash received from sales details
    public function getTodayCashReceivedInvoiceDetails(){
        $myDate = Carbon::now();
        $todayDate =  $myDate->toDateString(); 

        try {
        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('cash_received_from_sales', 'sale_invoices.invoiceNum', '=', 'cash_received_from_sales.invoiceNum')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'cash_received_from_sales.invoiceNum',
                                'customer_details.customerName', 
                                'cash_received_from_sales.date', 
                                'cash_received_from_sales.cashPaid'
                            )
                            ->where('cash_received_from_sales.date','=',$todayDate)
                            ->get();

        $cashReceived = DB::table('cash_received_from_sales')->where('cash_received_from_sales.date','=',$todayDate)->sum('cashPaid');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumCashReceived'=>$cashReceived,
                'data'=>$invoiceDetials
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    //get all cash received from sales details between two dates
    public function searchCashReceivedBetweenTimePeriod(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'from'=> 'required',
            'to'=> 'required',
        ]);

        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('cash_received_from_sales', 'sale_invoices.invoiceNum', '=', 'cash_received_from_sales.invoiceNum')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'cash_received_from_sales.invoiceNum',
                                'customer_details.customerName', 
                                'cash_received_from_sales.date', 
                                'cash_received_from_sales.cashPaid'
                            )
                            ->whereBetween('cash_received_from_sales.date', [$request->from, $request->to])
                            ->get();

        $cashReceived = DB::table('cash_received_from_sales')->whereBetween('cash_received_from_sales.date', [$request->from, $request->to])->sum('cashPaid');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumCashReceived'=>$cashReceived,
                'data'=>$invoiceDetials
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
