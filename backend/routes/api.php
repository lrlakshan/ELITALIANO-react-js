<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('userLogin','UserController@userLogin');
//Route::post('userLogin', array('middleware' => 'cors', 'uses' => 'UserController@userLogin'));

Route::post('userRegister','UserController@userRegister');
// Route::group(['middleware'=>'auth:api'], function(){
	Route::get('userDetails','UserController@userDetails');
// })

Route::post('addProducts','productController@addProducts');
Route::get('productDetails','productController@productDetails');
Route::post('updateProducts','productController@updateProducts');