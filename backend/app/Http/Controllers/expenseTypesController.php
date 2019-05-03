<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\expense_type;
use Validator;
use Exception;

class expenseTypesController extends Controller
{
    //add new expense type to database
    public function addExpenseType(Request $request){

    	try {
    		$validator = Validator::make($request->all(), [
    		'expenseName'=> 'required',
    		'expenseId'=> 'required'
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$input = $request->all();
    	$user = expense_type::create($input);
    	return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getCode()),
    			'code'=>500
    		], 500);
    	}
    }

    //get the next expense type ID number
    public function expenseTypeIdNextNumber(){
    	try {
    	$next_expense_type_id_number = array();
    	$next_expense_type_id_number = expense_type::max('expenseId')+1;
	    	return response()->json([
	    		'success'=>true,
	    		'error'=>null,
	    		'code'=>200,
	    		'data'=>$next_expense_type_id_number
	    	], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getMessage()),
    			'code'=>500
    		], 500);
    	}
    }

    //get all expense types for the drop down menu
    public function getAllExpenseTypes(){
        try {
        $expenseTypes = array();
        // $expenseTypes = DB::table('expenses')
        //                     ->join('expense_types', 'expenses.expenseTypeId', '=', 'expense_types.expenseId')
        //                     ->select(
        //                         'expenses.id',
        //                         'expense_types.expenseName', 
        //                         'expenses.date', 
        //                         'expenses.details',
        //                         'expenses.cashPaid'
        //                     )
        //                     ->orderBy('id', 'DESC')
        //                     ->paginate(15);

        $expenseTypes = expense_type::get();
                  
            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($expenseTypes),
                'data'=>$expenseTypes
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
