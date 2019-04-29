<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\sale_invoice;
use Validator;
use Exception;
use Carbon\Carbon;

class saleInvoiceController extends Controller
{

    //add sales invoice record
    public function addSalesInvoice(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'invoiceNum'=> 'required',
            'customerId'=> 'required',
            'date'=> 'required',
            'details'=> 'required',
            'totalBill'=> 'required',
            'discount'=> 'required',
            'cashPaid'=> 'required',
            'balance' => 'required',
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $input = $request->all();
        $user = sale_invoice::create($input);
        return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    //get the next invoice number for sales
    public function salesInvoiceNextNumber(){
    	try {
    	$next_invoice_number = array();
    	$next_invoice_number = sale_invoice::max('invoiceNum')+1;
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

    //get all sales invoices list
    public function getAllSalesInvoiceDetails(){
        try {
        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'sale_invoices.invoiceNum',
                                'customer_details.customerName', 
                                'sale_invoices.date', 
                                'sale_invoices.details',
                                'sale_invoices.totalBill',
                                'sale_invoices.discount',
                                'sale_invoices.cashPaid',
                                'sale_invoices.balance'
                            )
                            ->get();

        $revenue = DB::table('sale_invoices')->sum('totalBill');
        $costOfSales = DB::table('sales')
                            ->join('products', 'products.productId', '=', 'sales.productId')
                            ->select(DB::raw('sum(products.purchasePrice*sales.amountPurchases) AS costOfSales'))
                            ->first();
        $discount = DB::table('sale_invoices')->sum('discount');
        $cashPaid = DB::table('sale_invoices')->sum('cashPaid');   
        $balance = DB::table('sale_invoices')->sum('balance');                   
            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumRevenue'=>$revenue,
                'cumCostOfSales'=>$costOfSales->costOfSales,
                'cumDiscount'=>$discount,
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

    //get today sales invoices list
    public function getTodaySalesInvoiceDetails(){
        $myDate = Carbon::now();
        $todayDate =  $myDate->toDateString(); 

        try {
        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'sale_invoices.invoiceNum',
                                'customer_details.customerName', 
                                'sale_invoices.date', 
                                'sale_invoices.details',
                                'sale_invoices.totalBill',
                                'sale_invoices.discount',
                                'sale_invoices.cashPaid',
                                'sale_invoices.balance'
                            )
                            ->where('date','=',$todayDate)
                            ->get();

        $revenue = DB::table('sale_invoices')->where('date','=',$todayDate)->sum('totalBill');
        $costOfSales = DB::table('sales')
                            ->join('products', 'products.productId', '=', 'sales.productId')
                            ->select(DB::raw('sum(products.purchasePrice*sales.amountPurchases) AS costOfSales'))
                            ->where('date','=',$todayDate)
                            ->first();
        $discount = DB::table('sale_invoices')->where('date','=',$todayDate)->sum('discount');
        $cashPaid = DB::table('sale_invoices')->where('date','=',$todayDate)->sum('cashPaid');   
        $balance = DB::table('sale_invoices')->where('date','=',$todayDate)->sum('balance');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumRevenue'=>$revenue,
                'cumCostOfSales'=>$costOfSales->costOfSales,
                'cumDiscount'=>$discount,
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

    //get the sales invoice details of a paticular invoice number
    public function searchByInvoiceNumber(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'invoiceNum'=> 'required'
        ]);

        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'sale_invoices.invoiceNum',
                                'customer_details.customerName', 
                                'sale_invoices.date', 
                                'sale_invoices.details',
                                'sale_invoices.totalBill',
                                'sale_invoices.discount',
                                'sale_invoices.cashPaid',
                                'sale_invoices.balance'
                            )
                            ->where('invoiceNum','=',$request->all())
                            ->get();

        $revenue = DB::table('sale_invoices')->where('invoiceNum','=',$request->all())->sum('totalBill');
        $costOfSales = DB::table('sales')
                            ->join('products', 'products.productId', '=', 'sales.productId')
                            ->select(DB::raw('sum(products.purchasePrice*sales.amountPurchases) AS costOfSales'))
                            ->where('invoiceNum','=',$request->all())
                            ->first();
        $discount = DB::table('sale_invoices')->where('invoiceNum','=',$request->all())->sum('discount');
        $cashPaid = DB::table('sale_invoices')->where('invoiceNum','=',$request->all())->sum('cashPaid');   
        $balance = DB::table('sale_invoices')->where('invoiceNum','=',$request->all())->sum('balance');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumRevenue'=>$revenue,
                'cumCostOfSales'=>$costOfSales->costOfSales,
                'cumDiscount'=>$discount,
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

     //get the sales invoice details of a paticular customer name from all sales details
    public function searchBycustomerFromAllData(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'customerId'=> 'required'
        ]);

        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'sale_invoices.invoiceNum',
                                'customer_details.customerName', 
                                'sale_invoices.date', 
                                'sale_invoices.details',
                                'sale_invoices.totalBill',
                                'sale_invoices.discount',
                                'sale_invoices.cashPaid',
                                'sale_invoices.balance'
                            )
                            ->where('customerId','=',$request->all())
                            ->get();

        $revenue = DB::table('sale_invoices')->where('customerId','=',$request->all())->sum('totalBill');
        $costOfSales = DB::table('sales')
                            ->join('products', 'products.productId', '=', 'sales.productId')
                            ->select(DB::raw('sum(products.purchasePrice*sales.amountPurchases) AS costOfSales'))
                            ->where('customerId','=',$request->all())
                            ->first();
        $discount = DB::table('sale_invoices')->where('customerId','=',$request->all())->sum('discount');
        $cashPaid = DB::table('sale_invoices')->where('customerId','=',$request->all())->sum('cashPaid');   
        $balance = DB::table('sale_invoices')->where('customerId','=',$request->all())->sum('balance');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumRevenue'=>$revenue,
                'cumCostOfSales'=>$costOfSales->costOfSales,
                'cumDiscount'=>$discount,
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

    //get the sales invoice details of a paticular customer name from sales between two dates
    public function searchBycustomerBetweenTimePeriod(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'customerId'=> 'required',
            'from'=> 'required',
            'to'=> 'required',
        ]);

        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'sale_invoices.invoiceNum',
                                'customer_details.customerName', 
                                'sale_invoices.date', 
                                'sale_invoices.details',
                                'sale_invoices.totalBill',
                                'sale_invoices.discount',
                                'sale_invoices.cashPaid',
                                'sale_invoices.balance'
                            )
                            ->where('customerId','=',$request->customerId)
                            ->whereBetween('date', [$request->from, $request->to])
                            ->get();

        $revenue = DB::table('sale_invoices')->where('customerId','=',$request->customerId)
                            ->whereBetween('date', [$request->from, $request->to])->sum('totalBill');
        $costOfSales = DB::table('sales')
                            ->join('products', 'products.productId', '=', 'sales.productId')
                            ->select(DB::raw('sum(products.purchasePrice*sales.amountPurchases) AS costOfSales'))
                            ->where('customerId','=',$request->customerId)
                            ->whereBetween('date', [$request->from, $request->to])
                            ->first();
        $discount = DB::table('sale_invoices')->where('customerId','=',$request->customerId)
                            ->whereBetween('date', [$request->from, $request->to])->sum('discount');
        $cashPaid = DB::table('sale_invoices')->where('customerId','=',$request->customerId)
                            ->whereBetween('date', [$request->from, $request->to])->sum('cashPaid');   
        $balance = DB::table('sale_invoices')->where('customerId','=',$request->customerId)
                            ->whereBetween('date', [$request->from, $request->to])->sum('balance');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumRevenue'=>$revenue,
                'cumCostOfSales'=>$costOfSales->costOfSales,
                'cumDiscount'=>$discount,
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

    //get the sales invoice details  from sales between two dates
    public function searchBetweenTimePeriod(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'from'=> 'required',
            'to'=> 'required',
        ]);

        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'sale_invoices.invoiceNum',
                                'customer_details.customerName', 
                                'sale_invoices.date', 
                                'sale_invoices.details',
                                'sale_invoices.totalBill',
                                'sale_invoices.discount',
                                'sale_invoices.cashPaid',
                                'sale_invoices.balance'
                            )
                            ->whereBetween('date', [$request->from, $request->to])
                            ->get();

        $revenue = DB::table('sale_invoices')->whereBetween('date', [$request->from, $request->to])->sum('totalBill');
        $costOfSales = DB::table('sales')
                            ->join('products', 'products.productId', '=', 'sales.productId')
                            ->select(DB::raw('sum(products.purchasePrice*sales.amountPurchases) AS costOfSales'))
                            ->whereBetween('date', [$request->from, $request->to])
                            ->first();
        $discount = DB::table('sale_invoices')->whereBetween('date', [$request->from, $request->to])->sum('discount');
        $cashPaid = DB::table('sale_invoices')->whereBetween('date', [$request->from, $request->to])->sum('cashPaid');   
        $balance = DB::table('sale_invoices')->whereBetween('date', [$request->from, $request->to])->sum('balance');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumRevenue'=>$revenue,
                'cumCostOfSales'=>$costOfSales->costOfSales,
                'cumDiscount'=>$discount,
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

    //get sales history data from searching in the details column
    public function getSalesDataFromDetails(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'details'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $foundRowsInvoiceNums = sale_invoice::select('invoiceNum')->where('details', 'LIKE', '%' . $request->details . '%')->get();

        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'sale_invoices.invoiceNum',
                                'customer_details.customerName', 
                                'sale_invoices.date', 
                                'sale_invoices.details',
                                'sale_invoices.totalBill',
                                'sale_invoices.discount',
                                'sale_invoices.cashPaid',
                                'sale_invoices.balance'
                            )
                            ->where('details', 'LIKE', '%' . $request->details . '%')
                            ->get();

        $revenue = DB::table('sale_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->sum('totalBill');
        $costOfSales = DB::table('sales')
                            ->join('products', 'products.productId', '=', 'sales.productId')
                            ->select(DB::raw('sum(products.purchasePrice*sales.amountPurchases) AS costOfSales'))
                            ->whereIn('invoiceNum',$foundRowsInvoiceNums )
                            ->get();
        $discount = DB::table('sale_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->sum('discount');
        $cashPaid = DB::table('sale_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->sum('cashPaid');   
        $balance = DB::table('sale_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->sum('balance');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumRevenue'=>$revenue,
                'cumCostOfSales'=>$costOfSales[0]->costOfSales,
                'cumDiscount'=>$discount,
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

    //get sales history data from searching in the details column between two dates
    public function getSalesDataFromDetailsBetweenTimePeriod(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'details'=> 'required',
            'from'=> 'required',
            'to'=> 'required',
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

       $foundRowsInvoiceNums = sale_invoice::select('invoiceNum')->where('details', 'LIKE', '%' . $request->details . '%')->whereBetween('date', [$request->from, $request->to])->get();

        $invoiceDetials = array();
        $invoiceDetials = DB::table('sale_invoices')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'sale_invoices.invoiceNum',
                                'customer_details.customerName', 
                                'sale_invoices.date', 
                                'sale_invoices.details',
                                'sale_invoices.totalBill',
                                'sale_invoices.discount',
                                'sale_invoices.cashPaid',
                                'sale_invoices.balance'
                            )
                            ->where('details', 'LIKE', '%' . $request->details . '%')
                            ->whereBetween('date', [$request->from, $request->to])
                            ->get();

        $revenue = DB::table('sale_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->whereBetween('date', [$request->from, $request->to])->sum('totalBill');
        $costOfSales = DB::table('sales')
                            ->join('products', 'products.productId', '=', 'sales.productId')
                            ->select(DB::raw('sum(products.purchasePrice*sales.amountPurchases) AS costOfSales'))
                            ->whereIn('invoiceNum',$foundRowsInvoiceNums )
                            ->whereBetween('date', [$request->from, $request->to])
                            ->get();
        $discount = DB::table('sale_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->whereBetween('date', [$request->from, $request->to])->sum('discount');
        $cashPaid = DB::table('sale_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->whereBetween('date', [$request->from, $request->to])->sum('cashPaid');   
        $balance = DB::table('sale_invoices')->where('details', 'LIKE', '%' . $request->details . '%')->whereBetween('date', [$request->from, $request->to])->sum('balance');  

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
                'cumRevenue'=>$revenue,
                'cumCostOfSales'=>$costOfSales[0]->costOfSales,
                'cumDiscount'=>$discount,
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

    //get remaining trade receivable details
    public function getTradeReceivableDetails(){
        try {
        $receivableDetials = array();
        $receivableDetials = DB::table('sale_invoices')
                            ->join('customer_details', 'sale_invoices.customerId', '=', 'customer_details.id')
                            ->select(
                                'sale_invoices.invoiceNum',
                                'customer_details.customerName', 
                                'sale_invoices.date', 
                                'sale_invoices.details',
                                'sale_invoices.balance'
                            )
                            ->where('balance','!=',"0.00")
                            ->orderBy('sale_invoices.invoiceNum', 'ASC')
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
}
