<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'supplierId' => 'required',
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

    public function getPurchaseListDetails(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'invoiceNum'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $purchaseDetails = array();
        $purchaseDetails = DB::table('purchases')
                            ->join('products', 'products.productId', '=', 'purchases.productId')
                            ->select(
                                'purchases.id',
                                'products.productName', 
                                'products.purchasePrice', 
                                'purchases.amountPurchases',
                                 DB::raw(
                                    'products.purchasePrice*purchases.amountPurchases as amount')
                            )
                            ->where('invoiceNum','=',$request->all())
                            ->get();

        $totalBill = DB::table('purchases')
                            ->join('products', 'products.productId', '=', 'purchases.productId')
                            ->select(DB::raw('sum(products.purchasePrice*purchases.amountPurchases) AS totalBill'))
                            ->where('invoiceNum','=',$request->all())
                            ->first();

        return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($purchaseDetails),
                'sum'=>$totalBill,
                'data'=>$purchaseDetails
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    public function deletePurchases(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'Id'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $data = $request->all();
        $Id = $data['Id'];

        if($Id != "" && !empty($Id)){

            $delete = purchase::where('Id', $Id)->first();

            if($delete){
                    purchase::where('Id', $Id)->delete();

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

    public function clearList(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'invoiceNum'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $data = $request->all();
        $invoiceNum = $data['invoiceNum'];

        if($invoiceNum != "" && !empty($invoiceNum)){

            $delete = purchase::where('invoiceNum', $invoiceNum)->first();

            if($delete){
                    purchase::where('invoiceNum', $invoiceNum)->delete();

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
}
