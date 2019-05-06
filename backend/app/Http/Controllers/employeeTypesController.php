<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\employee_type;
use Validator;
use Exception;

class employeeTypesController extends Controller
{
    //add new employee Insert employee types details
	public function addNewEmployee(Request $request){

    	try {
    		$validator = Validator::make($request->all(), [
    		'empId'=> 'required',
    		'empName'=> 'required',
    		'designation'=> 'required',
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$input = $request->all();
    	$user = employee_type::create($input);
    	return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getCode()),
    			'code'=>500
    		], 500);
    	}
    }

    //get the next employee ID number
    public function employeeIdNextNumber(){
    	try {
    	$next_employee_id_number = array();
    	$next_employee_id_number = employee_type::max('empId')+1;
	    	return response()->json([
	    		'success'=>true,
	    		'error'=>null,
	    		'code'=>200,
	    		'data'=>$next_employee_id_number
	    	], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getMessage()),
    			'code'=>500
    		], 500);
    	}
    }

    //get the selected employee using the name
    public function getSelectedEmployeeByName(Request $request){

    	try {

    		$validator = Validator::make($request->all(), [
    		'employeeName'=> 'required'
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$data = $request->all();
    	$employeeName = $data['employeeName'];

    	if($employeeName != "" && !empty($employeeName)){

    		$details = employee_type::where('empName', 'LIKE', '%' . $employeeName . '%')->paginate(3);

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

    //get the selected employee using the ID
    public function getSelectedEmployeeById(Request $request){

    	try {

    		$validator = Validator::make($request->all(), [
    		'employeeId'=> 'required'
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$data = $request->all();
    	$employeeId = $data['employeeId'];

    	if($employeeId != "" && !empty($employeeId)){

    		$details = employee_type::where('empId', 'LIKE', '%' . $employeeId . '%')->paginate(3);

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
}
