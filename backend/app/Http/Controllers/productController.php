<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\product;
use Validator;
use Exception;

class productController extends Controller
{
    //
    public function addProducts(Request $request){

    	try {
    		$validator = Validator::make($request->all(), [
    		'productId'=> 'required',
	    	'productName'=> 'required',
	    	'purchasePrice' => 'required',
	    	'sellingPrice'=> 'required',
	    	'marketPrice'=> 'required',
	    	'amountAvailable' => 'required',
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$input = $request->all();
    	//$input['password'] = bcrypt($input['password']);
    	$user = product::create($input);
    	// $success['token'] = $user->createToken('MyApp')->accessToken;
    	$success['name'] = $user->name;
    	return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getMessage()),
    			'code'=>500
    		], 500);
    	}
    }

    public function productDetails(){
    	try {
    	$products = array();
    	$products = product::get();
	    	return response()->json([
	    		'success'=>true,
	    		'error'=>null,
	    		'code'=>200,
	    		'total'=>count($products),
	    		'data'=>$products
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
