<?php

namespace App\Http\Controllers\Tasks;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Task;

class TaskOperationsController extends Controller
{
    public function index(): JsonResponse {
        return response()->json(Task::all());
    }

    public function store(Request $request): JsonResponse {
        $task = Task::create($request->all());
        return response()->json($task, 201);
    }

    public function show($id) {
        return response()->json(Task::find($id));
    }

    public function update(Request $request, $id) {
        $task = Task::find($id);
        $task->update($request->all());
        return response()->json($task);
    }

    public function destroy($id) {
        Task::destroy($id);
        return response()->json(null, 204);
    }
}