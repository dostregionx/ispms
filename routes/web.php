<?php

    use App\Http\Controllers\Libraries\UOMController;
    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\InventoryItemsController;
    use App\Http\Controllers\RequestController;
    use App\Http\Controllers\StockinController;
    use App\Http\Controllers\AuthController;
    use App\Http\Controllers\InventoryRequestsController;
    use App\Http\Controllers\Libraries\RISNoController;
    use App\Http\Controllers\RISController;
    use App\Http\Controllers\RSMIController;

        // Public Routes
        Route::get('/', [RequestController::class, 'index']);
        Route::get('login', [AuthController::class, 'index'])->name('login');
        Route::post('login', [AuthController::class, 'login'])->name('auth.login');
        Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');

        Route::prefix('items/request')->group(function () {
            Route::get('/', [RequestController::class, 'index']);
            Route::post('/', [RequestController::class, 'store'])->name('request.store');
            Route::get('/sent', [RequestController::class, 'requestSent'])->name('request.sent');
        });

        // Protected Routes
        Route::middleware(['web','auth'])->group(function () {
            // Staff Request Routes
            Route::prefix('inventory/requests')->group(function () {
                Route::get('/', [InventoryRequestsController::class, 'index']);
                Route::get('/details/{requestsummaryid}', [InventoryRequestsController::class, 'show'])->name('requests.show');
                Route::put('/acknowledge/{requestsummaryid}', [InventoryRequestsController::class, 'acknowledge'])->name('requests.acknowledge');
                Route::put('/serve/{requestsummaryid}', [InventoryRequestsController::class, 'serve'])->name('requests.serve');
                Route::delete('/{requestsummaryid}', [RequestController::class, 'destroy'])->name('requests.destroy');
	    });

            // Inventory Items
            Route::prefix('inventory/items')->controller(InventoryItemsController::class)->group(function () {
                Route::get('/', 'index');
                Route::get('/available', 'availableItems')->name('items.available');
                Route::post('/breakdown', 'getItemsBreakDown')->name('items.breakdown');
                Route::put('/{invitemsid}', 'update')->name('items.update');
                Route::delete('/{invitemsid}', 'destroy')->name('items.destroy');
            });

            // RIS
            Route::prefix('reports/ris')->controller(RISController::class)->group(function () {
                Route::get('/', 'index')->name('ris.index');
                Route::get('/show/{empnumber}', 'show')->name('ris.show');
            });

            Route::prefix('reports/rsmi')->controller(RSMIController::class)->group(function () {
                Route::get('/', 'index')->name('rsmi.index');
                Route::get('/show', 'show')->name('rsmi.show');

            });

            Route::resource('inventory/stock-in', StockinController::class);


            Route::prefix('libraries/risno')->controller(RISNoController::class)->group(function () {
                Route::get('/', 'index');
                Route::put('/update/{empnumber}', 'update')->name('risno.update');
            });

            Route::prefix('libraries/uom')->controller(UOMController::class)->group(function () {
                Route::get('/', 'index');
                Route::post('/', 'store')->name('uom.store');
                Route::put('/{uomid}', 'update')->name('uom.update');
            });


        });


    

