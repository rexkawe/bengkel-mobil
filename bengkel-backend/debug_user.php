<?php
try {
    echo "Attempting to create user...\n";
    $user = \App\Models\User::create([
        'name' => 'Test User ' . rand(1000, 9999),
        'email' => 'test' . rand(1000, 9999) . '@test.com',
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'phone' => '08123456789',
        'address' => 'Test Address',
        'role' => 'customer',
        'is_active' => true
    ]);
    echo "SUCCESS: User created with ID " . $user->id . "\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
