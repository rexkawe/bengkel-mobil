<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Requests\ChatMessageRequest;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function getMessages(Request $request)
    {
        try {
            $sessionId = $request->get('session_id');
            
            if (!$sessionId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session ID diperlukan'
                ], Response::HTTP_BAD_REQUEST);
            }

            $messages = ChatMessage::where('session_id', $sessionId)
                ->orderBy('created_at', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'messages' => $messages->map(function ($message) {
                        return [
                            'id' => $message->id,
                            'message' => $message->message,
                            'sender_type' => $message->sender_type,
                            'is_read' => $message->is_read,
                            'created_at' => $message->created_at->format('H:i'),
                            'timestamp' => $message->created_at,
                        ];
                    })
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pesan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function sendMessage(ChatMessageRequest $request)
    {
        try {
            $user = $request->user();
            $sessionId = $request->session_id;

            // Simpan pesan dari user
            $message = ChatMessage::create([
                'user_id' => $user ? $user->id : null,
                'session_id' => $sessionId,
                'sender_type' => 'user',
                'message' => $request->message,
                'is_read' => false,
            ]);

            // Auto-response simulation (sederhana)
            $autoResponse = $this->generateAutoResponse($request->message);

            if ($autoResponse) {
                ChatMessage::create([
                    'session_id' => $sessionId,
                    'sender_type' => 'admin',
                    'message' => $autoResponse,
                    'is_read' => true,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pesan terkirim',
                'data' => [
                    'message' => [
                        'id' => $message->id,
                        'message' => $message->message,
                        'sender_type' => $message->sender_type,
                        'created_at' => $message->created_at->format('H:i'),
                    ]
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim pesan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function markAsRead(Request $request, $messageId)
    {
        try {
            $message = ChatMessage::findOrFail($messageId);
            $message->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Pesan ditandai sebagai sudah dibaca'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status pesan',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getUnreadCount(Request $request)
    {
        try {
            $sessionId = $request->get('session_id');
            
            if (!$sessionId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session ID diperlukan'
                ], Response::HTTP_BAD_REQUEST);
            }

            $unreadCount = ChatMessage::where('session_id', $sessionId)
                ->where('sender_type', 'admin')
                ->where('is_read', false)
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'unread_count' => $unreadCount
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil jumlah pesan belum dibaca',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function generateAutoResponse($userMessage)
    {
        $userMessage = strtolower($userMessage);

        $responses = [
            'halo' => 'Halo! Selamat datang di Adit AutoCare. Ada yang bisa saya bantu?',
            'servis' => 'Kami menyediakan berbagai layanan servis: servis berkala, tune up mesin, ganti ban, service rem, service AC, dan full body treatment.',
            'harga' => 'Harga servis mulai dari Rp 200.000. Bisa beri tahu jenis servis yang Anda butuhkan?',
            'jadwal' => 'Kami buka Senin-Jumat 08:00-18:00 dan Sabtu 08:00-16:00.',
            'booking' => 'Untuk booking servis, silakan klik tombol "Booking Servis" di website kami.',
            'lokasi' => 'Bengkel kami berada di Jl. Bengkel Modern No. 123, Jakarta.',
            'default' => 'Terima kasih sudah menghubungi AutoCare. Untuk informasi lebih lanjut, silakan hubungi kami di (021) 1234-5678.'
        ];

        if (str_contains($userMessage, 'halo') || str_contains($userMessage, 'hi')) {
            return $responses['halo'];
        } elseif (str_contains($userMessage, 'servis')) {
            return $responses['servis'];
        } elseif (str_contains($userMessage, 'harga')) {
            return $responses['harga'];
        } elseif (str_contains($userMessage, 'jadwal')) {
            return $responses['jadwal'];
        } elseif (str_contains($userMessage, 'booking')) {
            return $responses['booking'];
        } elseif (str_contains($userMessage, 'lokasi')) {
            return $responses['lokasi'];
        }

        return $responses['default'];
    }
}