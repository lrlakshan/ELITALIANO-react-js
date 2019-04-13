<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use Auth;
use Validator;
use App\User;
use Exception;

class UserController extends Controller
{
    //
    public function userLogin(Request $request){

        try {
            $validator = Validator::make($request->all(), [
            'username'=>'required',
            'password'=>'required'
        ]);

        if($validator->fails()){
            return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
        }

        if(Auth::attempt(['username'=>request('username'), 'password'=>request('password')])){
            $user = Auth::user();
            // $success['token'] = $user->createToken('MyApp')->accessToken;
            return response()->json(['success'=>true,'error'=>$validator->errors(),'code'=>200,'data'=>$user], 200);
        }

        else{
            return response()->json(['success'=>false,'error'=>'unauthorized','code'=>400]);
        }
        } catch (Exception $e) {
            return response()->json([
                'success'=>false,
                'error'=>($e->getCode()),
                'code'=>500
            ], 500);
        }
    }

    public function userRegister(Request $request){

    	try {
    		$validator = Validator::make($request->all(), [
    		'name'=> 'required',
    		'username'=> 'required',
    		'password' => 'required',
    	]);

    	if($validator->fails()){
    		return response()->json(['success'=>false,'error'=>$validator->errors(),'code'=>401]);
    	}

    	$input = $request->all();
    	$input['password'] = bcrypt($input['password']);
    	$user = User::create($input);
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

    public function UserDetails(){
    	try {
    	$users = array();
    	$users = User::get();
	    	return response()->json([
	    		'success'=>true,
	    		'error'=>null,
	    		'code'=>200,
	    		'total'=>count($users),
	    		'data'=>$users
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
