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
Route::post('purchasesHistoryMoreDetails','purchaseController@purchasesHistoryMoreDetails');

//api's from purchase_invoices table
Route::get('purchaseInvoiceNextNumber','purchaseInvoiceController@purchaseInvoiceNextNumber');
Route::post('addPurchaseInvoice','purchaseInvoiceController@addPurchaseInvoice');
Route::get('getAllPurchasesInvoiceDetails','purchaseInvoiceController@getAllPurchasesInvoiceDetails');
Route::get('getTodayPurchasesInvoiceDetails','purchaseInvoiceController@getTodayPurchasesInvoiceDetails');
Route::post('searchByPurchasesInvoiceNumber','purchaseInvoiceController@searchByPurchasesInvoiceNumber');
Route::post('searchBySupplierFromAllData','purchaseInvoiceController@searchBySupplierFromAllData');
Route::post('searchBySupplierBetweenTimePeriod','purchaseInvoiceController@searchBySupplierBetweenTimePeriod');
Route::post('searchPurchasesBetweenTimePeriod','purchaseInvoiceController@searchPurchasesBetweenTimePeriod');
Route::post('getPurchasesDataFromDetails','purchaseInvoiceController@getPurchasesDataFromDetails');
Route::post('getPurchasesDataFromDetailsBetweenTimePeriod','purchaseInvoiceController@getPurchasesDataFromDetailsBetweenTimePeriod');

//api from sales table
Route::post('addSales','saleController@addSales');
Route::post('getsaleListDetails','saleController@getsaleListDetails');
Route::post('deleteSales','saleController@deleteSales');
Route::post('salesClearList','saleController@salesClearList');
Route::post('salesHistoryMoreDetails','saleController@salesHistoryMoreDetails');

//api from sale_invoice table
Route::get('salesInvoiceNextNumber','saleInvoiceController@salesInvoiceNextNumber');
Route::post('addSalesInvoice','saleInvoiceController@addSalesInvoice');
Route::get('getAllSalesInvoiceDetails','saleInvoiceController@getAllSalesInvoiceDetails');
Route::get('getTodaySalesInvoiceDetails','saleInvoiceController@getTodaySalesInvoiceDetails');
Route::post('searchByInvoiceNumber','saleInvoiceController@searchByInvoiceNumber');
Route::post('searchBycustomerFromAllData','saleInvoiceController@searchBycustomerFromAllData');
Route::post('searchBycustomerBetweenTimePeriod','saleInvoiceController@searchBycustomerBetweenTimePeriod');
Route::post('searchBetweenTimePeriod','saleInvoiceController@searchBetweenTimePeriod');
Route::post('getSalesDataFromDetails','saleInvoiceController@getSalesDataFromDetails');
Route::post('getSalesDataFromDetailsBetweenTimePeriod','saleInvoiceController@getSalesDataFromDetailsBetweenTimePeriod');
Route::get('getTradeReceivableDetails','saleInvoiceController@getTradeReceivableDetails');

//api's from supplier_details table
Route::get('supplierDetails','supplierDetailController@supplierDetails');
Route::post('getSelectedSupplierName','supplierDetailController@getSelectedSupplierName');
Route::post('getSelectedSupplierByName','supplierDetailController@getSelectedSupplierByName');

//api from customer_details table
Route::post('getSelectedCustomerByMobile','customerDetailController@getSelectedCustomerByMobile');
Route::post('getSelectedCustomerByName','customerDetailController@getSelectedCustomerByName');
Route::get('customerIdNextNumber','customerDetailController@customerIdNextNumber');
Route::post('addNewCustomer','customerDetailController@addNewCustomer');

//api from cash_received_from_sales table
Route::post('addCashReceived','cashReceivedFromSalesController@addCashReceived');
Route::get('getAllCashReceivedInvoiceDetails','cashReceivedFromSalesController@getAllCashReceivedInvoiceDetails');
Route::get('getTodayCashReceivedInvoiceDetails','cashReceivedFromSalesController@getTodayCashReceivedInvoiceDetails');
Route::post('searchCashReceivedBetweenTimePeriod','cashReceivedFromSalesController@searchCashReceivedBetweenTimePeriod');

//api from cash_paid_to_suppliers table
Route::post('addCashPaid','cashPaidToSuppliersController@addCashPaid');
Route::get('getAllCashPaidInvoiceDetails','cashPaidToSuppliersController@getAllCashPaidInvoiceDetails');
Route::get('getTodayCashPaidInvoiceDetails','cashPaidToSuppliersController@getTodayCashPaidInvoiceDetails');
Route::post('searchCashPaidBetweenTimePeriod','cashPaidToSuppliersController@searchCashPaidBetweenTimePeriod');

