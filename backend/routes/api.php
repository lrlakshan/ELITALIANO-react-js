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

//api's from products table
Route::post('addProducts','productController@addProducts');
Route::get('productDetails','productController@productDetails');
Route::post('updateProducts','productController@updateProducts');
Route::post('deleteProducts','productController@deleteProducts');
Route::post('getSelectedProductDetails','productController@getSelectedProductDetails');

//api's from purchases table
Route::post('addPurchases','purchaseController@addPurchases');
Route::post('getPurchaseListDetails','purchaseController@getPurchaseListDetails');
Route::post('deletePurchases','purchaseController@deletePurchases');
Route::post('clearList','purchaseController@clearList');

//api's from purchase_invoices table
Route::get('purchaseInvoiceNextNumber','purchaseInvoiceController@purchaseInvoiceNextNumber');
Route::get('getInvoiceDetails','purchaseInvoiceController@getInvoiceDetails');
Route::post('addPurchaseInvoice','purchaseInvoiceController@addPurchaseInvoice');

//api from sales table
Route::post('addSales','saleController@addSales');
Route::post('getsaleListDetails','saleController@getsaleListDetails');
Route::post('deleteSales','saleController@deleteSales');
Route::post('salesClearList','saleController@salesClearList');

//api from sale_invoice table
Route::get('salesInvoiceNextNumber','saleInvoiceController@salesInvoiceNextNumber');
Route::post('addSalesInvoice','saleInvoiceController@addSalesInvoice');
Route::get('getAllSalesInvoiceDetails','saleInvoiceController@getAllSalesInvoiceDetails');
Route::get('getTodaySalesInvoiceDetails','saleInvoiceController@getTodaySalesInvoiceDetails');
Route::post('getDetailsOfThisInvoice','saleInvoiceController@getDetailsOfThisInvoice');
Route::get('getTradeReceivableDetails','saleInvoiceController@getTradeReceivableDetails');

//api's from supplier_details table
Route::get('supplierDetails','supplierDetailController@supplierDetails');
Route::post('getSelectedSupplierName','supplierDetailController@getSelectedSupplierName');

//api from customer_details table
Route::post('getSelectedCustomerByMobile','customerDetailController@getSelectedCustomerByMobile');
Route::post('getSelectedCustomerByName','customerDetailController@getSelectedCustomerByName');
Route::post('getSelectedCustomerByMobile','customerDetailController@getSelectedCustomerByMobile');
Route::get('customerIdNextNumber','customerDetailController@customerIdNextNumber');
Route::post('addNewCustomer','customerDetailController@addNewCustomer');




