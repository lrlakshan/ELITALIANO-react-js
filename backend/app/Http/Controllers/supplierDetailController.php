<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\supplier_detail;
use Validator;
use Exception;

class supplierDetailController extends Controller
{
    //
    public function supplierDetails(){
    	try {
    	$suppliers = array();
    	$suppliers = supplier_detail::get();
	    	return response()->json([
	    		'success'=>true,
	    		'error'=>null,
	    		'code'=>200,
	    		'total'=>count($suppliers),
	    		'data'=>$suppliers
	    	], 200);
    		
    	} catch (Exception $e) {
    		return response()->json([
    			'success'=>false,
    			'error'=>($e->getMessage()),
    			'code'=>500
    		], 500);
    	}
    }

    //get the supplier name selected from the dropdown menu
    public function getSelectedSupplierName(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'id'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $data = $request->all();
        $id = $data['id'];

        if($id != "" && !empty($id)){

            $details = supplier_detail::where('id', $id)->first();

            if($details){
                    // supplier_detail::where('id', $id)->details();

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

    //get the selected customer using the name
    public function getSelectedSupplierByName(Request $request){

        try {

            $validator = Validator::make($request->all(), [
            'supplierName'=> 'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        $data = $request->all();
        $supplierName = $data['supplierName'];

        if($supplierName != "" && !empty($supplierName)){

            $details = supplier_detail::where('supplierName', 'LIKE', '%' . $supplierName . '%')->paginate(5);

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
