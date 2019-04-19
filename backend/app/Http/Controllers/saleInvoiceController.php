<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\sale_invoice;
use Validator;
use Exception;

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

    //get all invoices list
    public function getSalesInvoiceDetails(){
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

            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($invoiceDetials),
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
