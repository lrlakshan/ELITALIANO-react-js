<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\purchase_invoice;
use Validator;
use Exception;

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

    //get the next invoice number for purchase
    public function purchaseInvoiceNextNumber(){
    	try {
    	$next_invoice_number = array();
    	$next_invoice_number = purchase_invoice::max('invoiceNum')+1;
	    	return response()->json([
	    		'success'=>true,
	    		'error'=>null,
	    		'code'=>200,
	    		//'total'=>count($invoice),
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
    public function getInvoiceDetails(){
        try {
        $invoiceDetials = array();
        $invoiceDetials = DB::table('purchase_invoices')
                            ->join('supplier_details', 'purchase_invoices.supplierId', '=', 'supplier_details.id')
                            ->select(
                                'purchase_invoices.invoiceNum',
                                'supplier_details.supplierName', 
                                'purchase_invoices.date', 
                                'purchase_invoices.details',
                                'purchase_invoices.totalBill'
                            )
                            ->paginate(5);
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
}
