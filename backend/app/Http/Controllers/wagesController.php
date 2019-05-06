<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\wage;
use Validator;
use Exception;
use Carbon\Carbon;

class wagesController extends Controller
{
	//add new salary to database
    public function addNewSalary(Request $request){

    	try {
    		$validator = Validator::make($request->all(), [
    		'empId'=> 'required',
    		'date'=> 'required',
    		'details'=> 'required',
    		'cashPaid'=> 'required',
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$input = $request->all();
    	$user = wage::create($input);
    	return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getMessage()),
    			'code'=>500
    		], 500);
    	}
    }

    //get last 15 salary details
    public function getSalarysDetails(){
        try {
        $salaryDetials = array();
        $salaryDetials = DB::table('wages')
                            ->join('employee_types', 'wages.empId', '=', 'employee_types.empId')
                            ->select(
                            	'wages.id',
                                'employee_types.empId',
                                'employee_types.empName', 
                                'wages.date', 
                                'wages.details',
                                'wages.cashPaid'
                            )
                            ->orderBy('id', 'DESC')
                            ->paginate(15);
                  
            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($salaryDetials),
                'data'=>$salaryDetials
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }


    //----------------------SALARY API FOR CASH FLOW SUMMARY-------------------------------------

    //get all salaries history details
    public function getAllSalaryDetails(){

        try {
        $salaryDetials = array();
        $salaryDetials = DB::table('wages')
                            ->join('employee_types', 'wages.empId', '=', 'employee_types.empId')
                            ->select(
                            	'wages.id',
                                'employee_types.empId',
                                'employee_types.empName', 
                                'wages.date', 
                                'wages.details',
                                'wages.cashPaid'
                            )
                            ->get();

        $salaryPaid = DB::table('wages')->sum('cashPaid');
                  
            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($salaryDetials),
                'cumSalaryPaid'=>$salaryPaid,
                'data'=>$salaryDetials
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    //get today salaries history details
    public function getTodaySalaryDetails(){

    	$myDate = Carbon::now();
        $todayDate =  $myDate->toDateString();

        try {
        $salaryDetials = array();
        $salaryDetials = DB::table('wages')
                            ->join('employee_types', 'wages.empId', '=', 'employee_types.empId')
                            ->select(
                            	'wages.id',
                                'employee_types.empId',
                                'employee_types.empName', 
                                'wages.date', 
                                'wages.details',
                                'wages.cashPaid'
                            )
                            ->where('date','=',$todayDate)
                            ->get();

        $salaryPaid = DB::table('wages')->where('date','=',$todayDate)->sum('cashPaid');
                  
            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($salaryDetials),
                'cumSalaryPaid'=>$salaryPaid,
                'data'=>$salaryDetials
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    //get all salary details between two dates
    public function searchSalaryBetweenTimePeriod(Request $request){

        try {
        	$validator = Validator::make($request->all(), [
            'from'=> 'required',
            'to'=> 'required',
        ]);

        $salaryDetials = array();
        $salaryDetials = DB::table('wages')
                            ->join('employee_types', 'wages.empId', '=', 'employee_types.empId')
                            ->select(
                            	'wages.id',
                                'employee_types.empId',
                                'employee_types.empName', 
                                'wages.date', 
                                'wages.details',
                                'wages.cashPaid'
                            )
							->whereBetween('date', [$request->from, $request->to])
                            ->get();

        $salaryPaid = DB::table('wages')->whereBetween('date', [$request->from, $request->to])
->sum('cashPaid');
                  
            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($salaryDetials),
                'cumSalaryPaid'=>$salaryPaid,
                'data'=>$salaryDetials
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
