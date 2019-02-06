<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\supplier_detail;
use Validator;
use Exception;

class supplierDetailController extends Controller
{
    //
    public function supplierDetails(){
    	try {
    	$suppliers = array();
    	$suppliers = supplier_detail::get();
	    	return response()->json([
	    		'success'=>true,
	    		'error'=>null,
	    		'code'=>200,
	    		'total'=>count($suppliers),
	    		'data'=>$suppliers
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
