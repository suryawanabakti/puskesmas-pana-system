<?php

namespace App\Exports;

use App\Models\Complaint;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ComplaintsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Complaint::with('user')->get();
    }

    public function map($complaint): array
    {
        return [
            $complaint->id,
            $complaint->title,
            $complaint->category,
            $complaint->status,
            $complaint->description,
            $complaint->user->name,
            $complaint->user->email,
            $complaint->user->phone,
            $complaint->user->gender,
            $complaint->created_at->format('Y-m-d H:i'),
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Judul',
            'Kategori',
            'Status',
            'Deskripsi',
            'Nama Pasien',
            'Email Pasien',
            'Telepon Pasien',
            'Jenis Kelamin',
            'Tanggal Dikirim',
        ];
    }
}
