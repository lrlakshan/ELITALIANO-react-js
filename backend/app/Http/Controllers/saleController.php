<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\sale;
use Validator;
use Exception;

class saleController extends Controller
{
    //add new sales details to sales details
    public function addSales(Request $request){

    	try {
    		$validator = Validator::make($request->all(), [
    		'invoiceNum'=> 'required',
	    	'date'=> 'required',
	    	'productId' => 'required',
            'customerId' => 'required',
            'purchasePrice'=> 'required',
	    	'sellingPrice'=> 'required',
	    	'amountPurchases'=> 'required',
	    	'marketPrice'=> 'required',
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$input = $request->all();
    	$user = sale::create($input);
    	return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getMessage()),
    			'code'=>500
    		], 500);
    	}
    }

    //get the details of the selected products in the frontend grid
    public function getsaleListDetails(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'invoiceNum'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $saleDetails = array();
        $saleDetails = DB::table('sales')
                            ->join('products', 'products.productId', '=', 'sales.productId')
                            ->select(
                                'sales.id',
                                'sales.productId',
                                'products.productName', 
                                'products.sellingPrice', 
                                'products.marketPrice',
                                'sales.amountPurchases',
                                 DB::raw(
                                    'products.sellingPrice*sales.amountPurchases as amount'),
	                            DB::raw(
	                                    'products.marketPrice*sales.amountPurchases as regAmount')
	                            )
                            ->where('invoiceNum','=',$request->all())
                            ->get();

        $totalBill = DB::table('sales')
                            ->join('products', 'products.productId', '=', 'sales.productId')
                            ->select(
                            	DB::raw('sum(products.sellingPrice*sales.amountPurchases) AS totalBill'),
                             	DB::raw('sum(products.marketPrice*sales.amountPurchases) AS totalBillRegular'))
                            ->where('invoiceNum','=',$request->all())
                            ->first();

        return response()->json([
                'success'=>true,
                'error'=>null,
                'code'=>200,
                'total'=>count($saleDetails),
                'sum'=>$totalBill,
                'data'=>$saleDetails
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getMessage()),
                'code'=>500
            ], 500);
        }
    }

    //delete the sales product of a paticular invoice number 
    public function deleteSales(Request $request){

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

            $delete = sale::where('Id', $Id)->first();

            if($delete){
                    sale::where('Id', $Id)->delete();

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

    //clear all existing sales in the table when page is reload
    public function salesClearList(Request $request){

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

            $delete = sale::where('invoiceNum', $invoiceNum)->first();

            if($delete){
                    sale::where('invoiceNum', $invoiceNum)->delete();

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
