<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EventController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Event::query();
        if (!$request->user() || !$request->user()->roles()->whereIn('slug', ['admin', 'president', 'content-manager'])->exists()) {
            $query->where('status', 'PUBLISHED');
        }
        return EventResource::collection($query->orderBy('start_time')->paginate(15));
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $this->authorize('manage', Event::class);
        $event = Event::create($request->validated());
        $this->cmsService->logAudit($event, 'EVENT_CREATED', $request->user()->id, $request->ip(), $request->userAgent(), null, $event->toArray());
        return response()->json(['message' => 'Event created successfully', 'data' => new EventResource($event)], 201);
    }
}
