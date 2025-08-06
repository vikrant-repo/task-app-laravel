<?php
use App\Http\Controllers\Tasks\TaskOperationsController;
use App\Http\Controllers\Tasks\ColumnOperationController;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', TaskOperationsController::class);
    Route::apiResource('columns', ColumnOperationController::class);
}); 