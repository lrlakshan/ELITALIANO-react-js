<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\sale_invoice;
use Validator;
use Exception;

class saleInvoiceController extends Controller
{
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
}
