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
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$input = $request->all();
    	$user = product::create($input);
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

    public function updateProducts(Request $request){

    	try {

    		$validator = Validator::make($request->all(), [
    		'productId'=> 'required',
	    	'productName'=> 'required',
	    	'purchasePrice' => 'required',
	    	'sellingPrice'=> 'required',
	    	'marketPrice'=> 'required',
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$data = $request->all();
    	$productId = $data['productId'];

    	if($productId != "" && !empty($productId)){

    		$update = product::where('productId', $productId)->first();

    		if($update){
    				product::where('productId', $productId)->update([
	    			'productName' => $request->productName,
	    			'purchasePrice' => $request->purchasePrice,
	    			'sellingPrice' => $request->sellingPrice,
	    			'marketPrice' => $request->marketPrice
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

    public function deleteProducts(Request $request){

    	try {

    		$validator = Validator::make($request->all(), [
    		'productId'=> 'required'
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$data = $request->all();
    	$productId = $data['productId'];

    	if($productId != "" && !empty($productId)){

    		$delete = product::where('productId', $productId)->first();

    		if($delete){
    				product::where('productId', $productId)->delete();

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

    public function getSelectedProductDetails(Request $request){

    	try {

    		$validator = Validator::make($request->all(), [
    		'productId'=> 'required'
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$data = $request->all();
    	$productId = $data['productId'];

    	if($productId != "" && !empty($productId)){

    		$details = product::where('productId', $productId)->first();

    		if($details){
    				// product::where('productId', $productId)->details();

	    		return response()->json([
	    			'success'=>true,
	    			'error'=>[],
	    			'code'=>200,
	    			'data'=>$details
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
}
