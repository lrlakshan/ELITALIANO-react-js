<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\purchase_invoice;
use Validator;
use Exception;

class purchaseInvoiceController extends Controller
{
    //
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
}
