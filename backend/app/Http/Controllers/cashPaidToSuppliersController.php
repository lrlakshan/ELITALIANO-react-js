<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\cash_paid_to_supplier;
use Validator;
use Exception;
use Carbon\Carbon;

class cashPaidToSuppliersController extends Controller
{
    //insert cash received detials to the cash_paid_to_suppliers
    public function addCashPaid(Request $request){

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
        $user = cash_paid_to_supplier::create($input);
        return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }


//----------------------CASH PAID API FOR CASH FLOW SUMMARY-------------------------------------

    //get all cash paid to suppliers details
    public function getAllCashPaidInvoiceDetails(){

        try {
        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('cash_paid_to_suppliers', 'purchase_invoices.invoiceNum', '=', 'cash_paid_to_suppliers.invoiceNum')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'cash_paid_to_suppliers.invoiceNum',
                                'supplier_details.supplierName', 
                                'cash_paid_to_suppliers.date', 
                                'cash_paid_to_suppliers.cashPaid'
                            )
                            ->get();

        $cashPaid = DB::table('cash_paid_to_suppliers')->sum('cashPaid');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumCashPaid'=>$cashPaid,
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

    //get today cash paid to suppliers details 
    public function getTodayCashPaidInvoiceDetails(){

        $myDate = Carbon::now();
        $todayDate =  $myDate->toDateString(); 

        try {
        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('cash_paid_to_suppliers', 'purchase_invoices.invoiceNum', '=', 'cash_paid_to_suppliers.invoiceNum')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'cash_paid_to_suppliers.invoiceNum',
                                'supplier_details.supplierName', 
                                'cash_paid_to_suppliers.date', 
                                'cash_paid_to_suppliers.cashPaid'
                            )
                            ->where('cash_paid_to_suppliers.date','=',$todayDate)
                            ->get();

        $cashPaid = DB::table('cash_paid_to_suppliers')->where('cash_paid_to_suppliers.date','=',$todayDate)->sum('cashPaid');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumCashPaid'=>$cashPaid,
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

    //get all cash paid to suppliers details between two dates
    public function searchCashPaidBetweenTimePeriod(request $request){

        try {
            $validator = Validator::make($request->all(), [
            'from'=> 'required',
            'to'=> 'required',
        ]);

        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('cash_paid_to_suppliers', 'purchase_invoices.invoiceNum', '=', 'cash_paid_to_suppliers.invoiceNum')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'cash_paid_to_suppliers.invoiceNum',
                                'supplier_details.supplierName', 
                                'cash_paid_to_suppliers.date', 
                                'cash_paid_to_suppliers.cashPaid'
                            )
                            ->whereBetween('cash_paid_to_suppliers.date', [$request->from, $request->to])
                            ->get();

        $cashPaid = DB::table('cash_paid_to_suppliers')->whereBetween('cash_paid_to_suppliers.date', [$request->from, $request->to])->sum('cashPaid');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumCashPaid'=>$cashPaid,
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
