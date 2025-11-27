<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatMessageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'message' => 'required|string|max:1000',
            'session_id' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'message.required' => 'Pesan tidak boleh kosong',
            'message.max' => 'Pesan maksimal 1000 karakter',
            'session_id.required' => 'Session ID diperlukan',
        ];
    }
}