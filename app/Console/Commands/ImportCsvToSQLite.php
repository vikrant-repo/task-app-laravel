<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ImportCsvToSQLite extends Command
{
    protected $signature = 'import:csv {filepath} {tableName}';
    protected $description = 'Import a CSV file with 1000 columns into a SQLite table';

    public function handle()
    {
        $filePath = $this->argument('filepath');
        $tableName = $this->argument('tableName');

        if (!file_exists($filePath)) {
            $this->error("File does not exist: $filePath");
            return;
        }

        $handle = fopen($filePath, 'r');
        if (!$handle) {
            $this->error("Unable to open file.");
            return;
        }

        $headers = fgetcsv($handle);

        $headers = array_map(fn($h) => Str::slug($h, '_'), $headers);

        Schema::dropIfExists($tableName);

        Schema::create($tableName, function ($table) use ($headers) {
            $table->id();
            foreach ($headers as $column) {
                $table->text($column)->nullable();
            }
            $table->timestamps();
        });

        $rows = [];
        $batchSize = 100;
        $rowCount = 0;

        while (($data = fgetcsv($handle)) !== false) {
            $row = array_combine($headers, $data);
            $row['created_at'] = now();
            $row['updated_at'] = now();
            $rows[] = $row;

            if (count($rows) >= $batchSize) {
                DB::table($tableName)->insert($rows);
                $rowCount += count($rows);
                $rows = [];
            }
        }

        if (!empty($rows)) {
            DB::table($tableName)->insert($rows);
            $rowCount += count($rows);
        }

        fclose($handle);

        $this->info("Imported rows into `$tableName` successfully.");
    }
}