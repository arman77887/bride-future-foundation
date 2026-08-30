<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CmsService
{
    public function logAudit(Model $model, string $action, ?int $userId, ?string $ip, ?string $userAgent, ?array $oldValues = null, ?array $newValues = null): void
    {
        AuditLog::create([
            'actor_id' => $userId,
            'action' => $action,
            'module' => 'cms',
            'entity_type' => get_class($model),
            'entity_id' => $model->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
        ]);
    }
}
