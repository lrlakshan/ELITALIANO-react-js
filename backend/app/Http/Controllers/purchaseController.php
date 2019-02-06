<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\purchase;
use Validator;
use Exception;

class purchaseController extends Controller
{
    //
    public function addPurchases(Request $request){

    	try {
    		$validator = Validator::make($request->all(), [
    		'invoiceNum'=> 'required',
	    	'date'=> 'required',
	    	'productId' => 'required',
	    	'amountPurchases'=> 'required',
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$input = $request->all();
    	$user = purchase::create($input);
    	return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getMessage()),
    			'code'=>500
    		], 500);
    	}
    }
}
