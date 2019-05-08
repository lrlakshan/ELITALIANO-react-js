<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\purchase_invoice;
use Validator;
use Exception;
use Carbon\Carbon;

class purchaseInvoiceController extends Controller
{
    //add purchase invoice record
    public function addPurchaseInvoice(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'invoiceNum'=> 'required',
            'supplierId'=> 'required',
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
        $user = purchase_invoice::create($input);
        return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    //update purchases invoice record for trade payable payments
    public function tradePayablePayments(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'invoiceNum'=> 'required',
            'cashPaid' => 'required',
            'balance'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $data = $request->all();
        $invoiceNum = $data['invoiceNum'];

        if($invoiceNum != "" && !empty($invoiceNum)){

            $update = purchase_invoice::where('invoiceNum', $invoiceNum)->first();

            if($update){
                    purchase_invoice::where('invoiceNum', $invoiceNum)->update([
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

    //get the next invoice number for purchase
    public function purchaseInvoiceNextNumber(){
    	try {
    	$next_invoice_number = array();
    	$next_invoice_number = purchase_invoice::max('invoiceNum')+1;
	    	return response()->json([
	    		'success'=>true,
	    		'error'=>null,
	    		'code'=>200,
	    		'data'=>$next_invoice_number
	    	], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getMessage()),
    			'code'=>500
    		], 500);
    	}
    }

    //get all purchases invoices list
    public function getAllPurchasesInvoiceDetails(){
        try {
        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'purchase_invoices.invoiceNum',
                                'supplier_details.supplierName', 
                                'purchase_invoices.date', 
                                'purchase_invoices.details',
                                'purchase_invoices.totalBill',
                                'purchase_invoices.cashPaid',
                                'purchase_invoices.balance'
                            )
                            ->get();
        $totalCost = DB::table('purchase_invoices')->sum('totalBill');
        $cashPaid = DB::table('purchase_invoices')->sum('cashPaid');   
        $balance = DB::table('purchase_invoices')->sum('balance');

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'totalCost'=>$totalCost,
                'cashPaid'=>$cashPaid,
                'balance'=>$balance,
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

    //get today's purchases invoices list
    public function getTodayPurchasesInvoiceDetails(){

        $myDate = Carbon::now();
        $todayDate =  $myDate->toDateString();

        try {
        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'purchase_invoices.invoiceNum',
                                'supplier_details.supplierName', 
                                'purchase_invoices.date', 
                                'purchase_invoices.details',
                                'purchase_invoices.totalBill',
                                'purchase_invoices.cashPaid',
                                'purchase_invoices.balance'
                            )
                            ->where('date','=',$todayDate)
                            ->get();
        $totalCost = DB::table('purchase_invoices')->where('date','=',$todayDate)->sum('totalBill');
        $cashPaid = DB::table('purchase_invoices')->where('date','=',$todayDate)->sum('cashPaid');   
        $balance = DB::table('purchase_invoices')->where('date','=',$todayDate)->sum('balance');

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'totalCost'=>$totalCost,
                'cashPaid'=>$cashPaid,
                'balance'=>$balance,
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

    //get the purchases invoice details of a paticular invoice number
    public function searchByPurchasesInvoiceNumber(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'invoiceNum'=> 'required'
        ]);

        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'purchase_invoices.invoiceNum',
                                'supplier_details.supplierName', 
                                'purchase_invoices.date', 
                                'purchase_invoices.details',
                                'purchase_invoices.totalBill',
                                'purchase_invoices.cashPaid',
                                'purchase_invoices.balance'
                            )
                            ->where('invoiceNum','=',$request->all())
                            ->get();
        $totalCost = DB::table('purchase_invoices')->where('invoiceNum','=',$request->all())->sum('totalBill');
        $cashPaid = DB::table('purchase_invoices')->where('invoiceNum','=',$request->all())->sum('cashPaid');   
        $balance = DB::table('purchase_invoices')->where('invoiceNum','=',$request->all())->sum('balance');

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'totalCost'=>$totalCost,
                'cashPaid'=>$cashPaid,
                'balance'=>$balance,
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

    //get the purchases invoice details of a paticular supplier name from all purchases data
    public function searchBySupplierFromAllData(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'supplierId'=> 'required'
        ]);

        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'purchase_invoices.invoiceNum',
                                'supplier_details.supplierName', 
                                'purchase_invoices.date', 
                                'purchase_invoices.details',
                                'purchase_invoices.totalBill',
                                'purchase_invoices.cashPaid',
                                'purchase_invoices.balance'
                            )
                            ->where('supplierId','=',$request->all())
                            ->get();
        $totalCost = DB::table('purchase_invoices')->where('supplierId','=',$request->all())->sum('totalBill');
        $cashPaid = DB::table('purchase_invoices')->where('supplierId','=',$request->all())->sum('cashPaid');   
        $balance = DB::table('purchase_invoices')->where('supplierId','=',$request->all())->sum('balance');

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'totalCost'=>$totalCost,
                'cashPaid'=>$cashPaid,
                'balance'=>$balance,
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

    //get the purchases invoice details of a paticular supplier name between two dates
    public function searchBySupplierBetweenTimePeriod(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'supplierId'=> 'required',
            'from'=> 'required',
            'to'=> 'required',
        ]);

        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'purchase_invoices.invoiceNum',
                                'supplier_details.supplierName', 
                                'purchase_invoices.date', 
                                'purchase_invoices.details',
                                'purchase_invoices.totalBill',
                                'purchase_invoices.cashPaid',
                                'purchase_invoices.balance'
                            )
                            ->where('supplierId','=',$request->all())
                            ->whereBetween('date', [$request->from, $request->to])
                            ->get();
        $totalCost = DB::table('purchase_invoices')->where('supplierId','=',$request->all())->whereBetween('date', [$request->from, $request->to])->sum('totalBill');
        $cashPaid = DB::table('purchase_invoices')->where('supplierId','=',$request->all())->whereBetween('date', [$request->from, $request->to])->sum('cashPaid');   
        $balance = DB::table('purchase_invoices')->where('supplierId','=',$request->all())->whereBetween('date', [$request->from, $request->to])->sum('balance');

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'totalCost'=>$totalCost,
                'cashPaid'=>$cashPaid,
                'balance'=>$balance,
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

    //get the purchases invoice details  from purchases between two dates
    public function searchPurchasesBetweenTimePeriod(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'from'=> 'required',
            'to'=> 'required',
        ]);

        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'purchase_invoices.invoiceNum',
                                'supplier_details.supplierName', 
                                'purchase_invoices.date', 
                                'purchase_invoices.details',
                                'purchase_invoices.totalBill',
                                'purchase_invoices.cashPaid',
                                'purchase_invoices.balance'
                            )
                            ->whereBetween('date', [$request->from, $request->to])
                            ->get();
        $totalCost = DB::table('purchase_invoices')->whereBetween('date', [$request->from, $request->to])->sum('totalBill');
        $cashPaid = DB::table('purchase_invoices')->whereBetween('date', [$request->from, $request->to])->sum('cashPaid');   
        $balance = DB::table('purchase_invoices')->whereBetween('date', [$request->from, $request->to])->sum('balance');

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'totalCost'=>$totalCost,
                'cashPaid'=>$cashPaid,
                'balance'=>$balance,
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

    //get purchases history data from searching in the details column
    public function getPurchasesDataFromDetails(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'details'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'purchase_invoices.invoiceNum',
                                'supplier_details.supplierName', 
                                'purchase_invoices.date', 
                                'purchase_invoices.details',
                                'purchase_invoices.totalBill',
                                'purchase_invoices.cashPaid',
                                'purchase_invoices.balance'
                            )
                            ->where('details', 'LIKE', '%' . $request->details . '%')
                            ->get();
        $totalCost = DB::table('purchase_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->sum('totalBill');
        $cashPaid = DB::table('purchase_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->sum('cashPaid');   
        $balance = DB::table('purchase_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->sum('balance');

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'totalCost'=>$totalCost,
                'cashPaid'=>$cashPaid,
                'balance'=>$balance,
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

    //get purchases history data from searching in the details column between two dates
    public function getPurchasesDataFromDetailsBetweenTimePeriod(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'details'=> 'required',
            'from'=> 'required',
            'to'=> 'required',
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'purchase_invoices.invoiceNum',
                                'supplier_details.supplierName', 
                                'purchase_invoices.date', 
                                'purchase_invoices.details',
                                'purchase_invoices.totalBill',
                                'purchase_invoices.cashPaid',
                                'purchase_invoices.balance'
                            )
                            ->where('details', 'LIKE', '%' . $request->details . '%')
                            ->whereBetween('date', [$request->from, $request->to])
                            ->get();
        $totalCost = DB::table('purchase_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->whereBetween('date', [$request->from, $request->to])->sum('totalBill');
        $cashPaid = DB::table('purchase_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->whereBetween('date', [$request->from, $request->to])->sum('cashPaid');   
        $balance = DB::table('purchase_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->whereBetween('date', [$request->from, $request->to])->sum('balance');

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'totalCost'=>$totalCost,
                'cashPaid'=>$cashPaid,
                'balance'=>$balance,
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

    //get remaining trade payable details
    public function getTradePayableDetails(){
        try {
        $payableDetials = array();
        $payableDetials = DB::table('purchase_invoices')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'purchase_invoices.invoiceNum',
                                'supplier_details.supplierName', 
                                'purchase_invoices.date', 
                                'purchase_invoices.details',
                                'purchase_invoices.totalBill',
                                'purchase_invoices.cashPaid',
                                'purchase_invoices.balance'
                            )
                            ->where('balance','!=',"0.00")
                            ->orderBy('purchase_invoices.invoiceNum', 'ASC')
                            ->get();
            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($payableDetials),
                'data'=>$payableDetials
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
