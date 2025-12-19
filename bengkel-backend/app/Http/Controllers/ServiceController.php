<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    /**
     * Get all active services
     */
    public function index(Request $request)
    {
        try {
            $services = Service::active()
                ->orderBy('order')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'services' => $services->map(function ($service) {
                        return $this->formatServiceData($service);
                    })
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch services', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data layanan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get specific service by ID
     */
    public function show($id)
    {
        try {
            $service = Service::active()->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'service' => $this->formatServiceData($service)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Service not found', ['id' => $id, 'error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Layanan tidak ditemukan',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Get all service categories
     */
    public function categories()
    {
        try {
            $categories = Service::active()
                ->distinct('category')
                ->pluck('category');

            return response()->json([
                'success' => true,
                'data' => [
                    'categories' => $categories
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch categories', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil kategori',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get services by category
     */
    public function byCategory($category)
    {
        try {
            $services = Service::active()
                ->byCategory($category)
                ->orderBy('order')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'services' => $services->map(function ($service) {
                        return $this->formatServiceData($service);
                    })
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch services by category', [
                'category' => $category, 
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data layanan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Create new service
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'duration' => 'required|string|max:50',
                'category' => 'required|string|max:100',
                'features' => 'nullable|array',
                'features.*' => 'string|max:255',
                'icon' => 'nullable|string|max:10',
                'is_active' => 'sometimes|boolean'
            ]);

            $service = Service::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'duration' => $validated['duration'],
                'category' => $validated['category'],
                'features' => !empty($validated['features']) ? $validated['features'] : null,
                'icon' => $validated['icon'] ?? '🛠️',
                'is_active' => $validated['is_active'] ?? true,
                'order' => Service::max('order') + 1
            ]);

            Log::info('Service created successfully', ['service_id' => $service->id]);

            return response()->json([
                'success' => true,
                'message' => 'Layanan berhasil dibuat',
                'data' => [
                    'service' => $this->formatServiceData($service)
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            Log::error('Failed to create service', [
                'data' => $request->all(),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat layanan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update existing service
     */
    public function update(Request $request, $id)
    {
        try {
            $service = Service::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric|min:0',
                'duration' => 'sometimes|string|max:50',
                'category' => 'sometimes|string|max:100',
                'features' => 'nullable|array',
                'features.*' => 'string|max:255',
                'icon' => 'nullable|string|max:10',
                'is_active' => 'sometimes|boolean',
                'order' => 'sometimes|integer'
            ]);

            // Handle features array conversion - No manual encoding needed due to Model casting
            if (isset($validated['features'])) {
                $validated['features'] = !empty($validated['features']) 
                    ? $validated['features'] 
                    : null;
            }

            $service->update($validated);

            Log::info('Service updated successfully', ['service_id' => $service->id]);

            return response()->json([
                'success' => true,
                'message' => 'Layanan berhasil diperbarui',
                'data' => [
                    'service' => $this->formatServiceData($service)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update service', [
                'service_id' => $id,
                'data' => $request->all(),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui layanan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete service
     */
    public function destroy($id)
    {
        try {
            $service = Service::findOrFail($id);
            $service->delete();

            Log::info('Service deleted successfully', ['service_id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Layanan berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to delete service', [
                'service_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus layanan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Toggle service status
     */
    public function toggleStatus($id)
    {
        try {
            $service = Service::findOrFail($id);
            $service->update([
                'is_active' => !$service->is_active
            ]);

            $status = $service->is_active ? 'diaktifkan' : 'dinonaktifkan';

            Log::info('Service status toggled', [
                'service_id' => $id,
                'new_status' => $service->is_active
            ]);

            return response()->json([
                'success' => true,
                'message' => "Layanan berhasil $status",
                'data' => [
                    'service' => $this->formatServiceData($service)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to toggle service status', [
                'service_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status layanan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Format service data for consistent API response
     */
    private function formatServiceData(Service $service)
    {
        return [
            'id' => $service->id,
            'name' => $service->name,
            'description' => $service->description,
            'price' => $service->price,
            'formatted_price' => $service->formatted_price,
            'duration' => $service->duration,
            'category' => $service->category,
            'features' => $service->features,
            'icon' => $service->icon,
            'is_active' => $service->is_active,
            'order' => $service->order,
            'created_at' => $service->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $service->updated_at->format('Y-m-d H:i:s')
        ];
    }
}