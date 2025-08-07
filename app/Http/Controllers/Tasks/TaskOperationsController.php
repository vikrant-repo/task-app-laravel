<?php

namespace App\Http\Controllers\Tasks;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Task;

class TaskOperationsController extends Controller
{
    public function index(Request $request): JsonResponse {
        $user = $request->user();
        $userId = $user->id;
        $tasks = Task::where('user_id', $userId)->get();
        return response()->json($tasks);
    }

      public function store(Request $request): JsonResponse {
        $user = $request->user();
        $userId = $user->id;
        $validated = $request->validate([
            'title' => 'required|string',
            'column_id' => 'required|exists:columns,id'
        ]);
        $column = Task::create([
            'title' => $validated['title'],
            'column_id' => $validated['column_id'],
            'user_id' => $userId,
        ]);
        return response()->json($column, 201);
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
        return response()->json(['message' => 'Deleted']);
    }
}