<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\expense;
use Validator;
use Exception;

class expenseController extends Controller
{
    //add new expense to database
    public function addNewExpense(Request $request){

    	try {
    		$validator = Validator::make($request->all(), [
    		'expenseTypeId'=> 'required',
    		'date'=> 'required',
    		'details'=> 'required',
    		'cashPaid'=> 'required',
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$input = $request->all();
    	$user = expense::create($input);
    	return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getMessage()),
    			'code'=>500
    		], 500);
    	}
    }

    //get last 15 expenses details
    public function getExpensesDetails(){
        try {
        $expenseDetials = array();
        $expenseDetials = DB::table('expenses')
                            ->join('expense_types', 'expenses.expenseTypeId', '=', 'expense_types.expenseId')
                            ->select(
                                'expenses.id',
                                'expense_types.expenseName', 
                                'expenses.date', 
                                'expenses.details',
                                'expenses.cashPaid'
                            )
                            ->orderBy('id', 'DESC')
                            ->paginate(15);
                  
            return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($expenseDetials),
                'data'=>$expenseDetials
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
