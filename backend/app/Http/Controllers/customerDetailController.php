<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\customer_detail;
use Validator;
use Exception;

class customerDetailController extends Controller
{

	//add new customer. Insert customer details
	public function addNewCustomer(Request $request){

    	try {
    		$validator = Validator::make($request->all(), [
    		'customerName'=> 'required',
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$input = $request->all();
    	$user = customer_detail::create($input);
    	return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getCode()),
    			'code'=>500
    		], 500);
    	}
    }

    //get the selected customer using the mobile number
    public function getSelectedCustomerByMobile(Request $request){

    	try {

    		$validator = Validator::make($request->all(), [
    		'mobileNumber'=> 'required'
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$data = $request->all();
    	$mobileNumber = $data['mobileNumber'];

    	if($mobileNumber != "" && !empty($mobileNumber)){

    		$details = customer_detail::where('mobileNumber', 'LIKE', '%' . $mobileNumber . '%')->paginate(5);

    		if($details){

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
	    			'error'=>'Customer did not found. Search again correctly or add as a new customer',
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


     //get the selected customer using the name
    public function getSelectedCustomerByName(Request $request){

    	try {

    		$validator = Validator::make($request->all(), [
    		'customerName'=> 'required'
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$data = $request->all();
    	$customerName = $data['customerName'];

    	if($customerName != "" && !empty($customerName)){

    		$details = customer_detail::where('customerName', 'LIKE', '%' . $customerName . '%')->paginate(5);

    		if($details){

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
	    			'error'=>'Customer did not found. Search again correctly or add as a new customer',
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

    //get the next customer ID number
    public function customerIdNextNumber(){
    	try {
    	$next_customer_id_number = array();
    	$next_customer_id_number = customer_detail::max('id')+1;
	    	return response()->json([
	    		'success'=>true,
	    		'error'=>null,
	    		'code'=>200,
	    		'data'=>$next_customer_id_number
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
