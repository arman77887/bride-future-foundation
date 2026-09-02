<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendUpdateNotificationJob;
use App\Http\Requests\Cms\StoreEventRequest;
use App\Http\Requests\Cms\UpdateEventRequest;
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
        $query = Event::with('coverMedia');

        if (
            !$request->user() ||
            !$request->user()->roles()
                ->whereIn('slug', ['admin', 'president', 'content-manager'])
                ->exists()
        ) {
            $query->where('status', 'PUBLISHED');
        }

        return EventResource::collection(
            $query->orderBy('start_time')->paginate(15)
        );
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $this->authorize('manage', Event::class);

        $event = Event::create($request->validated());
        $event->load('coverMedia');

        if ($event->status === 'PUBLISHED') {
            SendUpdateNotificationJob::dispatch(
                'event',
                (string) $event->id,
                $event->title_bn ?? '',
                $event->title_en ?? '',
                $event->description_bn ?? '',
                $event->description_en ?? '',
                url('/events')
            );
        }

        $this->cmsService->logAudit(
            $event,
            'EVENT_CREATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            null,
            $event->toArray()
        );

        return response()->json([
            'message' => 'Event created successfully',
            'data' => new EventResource($event),
        ], 201);
    }

    public function update(
        UpdateEventRequest $request,
        string $id
    ): JsonResponse {
        $this->authorize('manage', Event::class);

        $event = Event::findOrFail($id);

        $oldValues = $event->toArray();

        $wasPublished = $event->status === 'PUBLISHED';

        $event->update($request->validated());
        $event->load('coverMedia');

        if (! $wasPublished && $event->status === 'PUBLISHED') {
            SendUpdateNotificationJob::dispatch(
                'event',
                (string) $event->id,
                $event->title_bn ?? '',
                $event->title_en ?? '',
                $event->description_bn ?? '',
                $event->description_en ?? '',
                url('/events')
            );
        }

        $this->cmsService->logAudit(
            $event,
            'EVENT_UPDATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $oldValues,
            $event->fresh()->toArray()
        );

        return response()->json([
            'message' => 'Event updated successfully',
            'data' => new EventResource($event->fresh('coverMedia')),
        ]);
    }

    public function destroy(
        Request $request,
        string $id
    ): JsonResponse {
        $this->authorize('manage', Event::class);

        $event = Event::findOrFail($id);

        $oldValues = $event->toArray();

        $event->delete();

        $this->cmsService->logAudit(
            $event,
            'EVENT_DELETED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Event deleted successfully',
        ]);
    }
}
