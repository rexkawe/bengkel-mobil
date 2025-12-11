<?php

use App\Models\Service;

echo "Cleaning up services...\n";

$services = Service::all();

foreach ($services as $service) {
    if (is_string($service->features)) {
        // Attempt to decode to check if it was double encoded
        $decoded = json_decode($service->features, true);
        
        // If it decodes to an array/json, and the original was a string that looked like a JSON,
        // it might have been double encoded. 
        // BUT, since we have 'casts' => ['features' => 'array'], 
        // accessing $service->features SHOULD give us the PHP array if it was stored correctly as JSON.
        // If it was double encoded, $service->features would be a STRING (the inner JSON string).
        
        echo "Service ID {$service->id} has features type: " . gettype($service->features) . "\n";
        echo "Value: " . var_export($service->features, true) . "\n";

        if (is_string($service->features)) {
             echo "Fixing Service {$service->id}...\n";
             // It's a string, so it's likely double encoded or just raw string.
             // We try to decode it.
             $realFeatures = json_decode($service->features, true);
             if (is_array($realFeatures)) {
                 $service->features = $realFeatures;
                 $service->save();
                 echo "Fixed!\n";
             }
        }
    } else {
        echo "Service ID {$service->id} is already okay (type: " . gettype($service->features) . ")\n";
    }
}
echo "Done.\n";
