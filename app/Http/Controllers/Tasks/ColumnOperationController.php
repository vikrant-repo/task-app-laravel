<?php

namespace App\Http\Controllers\Tasks;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Column;

class ColumnOperationController extends Controller
{
    public function index(): JsonResponse {
        return response()->json(Column::all());
    }

    public function store(Request $request): JsonResponse {
        $user = $request->user();
        $userId = $user->id;
        $validated = $request->validate([
            'name' => 'required|string'
        ]);
        $column = Column::create([
            'name' => $validated['name'],
            'user_id' => $userId,
        ]);
        return response()->json($column, 201);
    }

    public function show($id) {
        return response()->json(Column::find($id));
    }

    public function update(Request $request, $id) {
        $column = Column::find($id);
        $column->update($request->all());
        return response()->json($column);
    }

    public function destroy($id) {
        Column::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}