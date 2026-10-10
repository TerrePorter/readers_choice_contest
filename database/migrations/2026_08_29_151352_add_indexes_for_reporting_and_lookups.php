<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->index('campaign_id');
            $table->index('slug');
        });

        Schema::table('event_categories', function (Blueprint $table) {
            $table->unique(['event_id', 'category_id']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index('group_id');
        });

        Schema::table('categories_databases', function (Blueprint $table) {
            $table->index(['category_id', 'campaign_id']);
            $table->index('campaign_id');
        });

        Schema::table('ballots', function (Blueprint $table) {
            $table->index('event_id');
            $table->index(['event_id', 'session_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex(['campaign_id']);
            $table->dropIndex(['slug']);
        });

        Schema::table('event_categories', function (Blueprint $table) {
            $table->dropUnique(['event_id', 'category_id']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['group_id']);
        });

        Schema::table('categories_databases', function (Blueprint $table) {
            $table->dropIndex(['category_id', 'campaign_id']);
            $table->dropIndex(['campaign_id']);
        });

        Schema::table('ballots', function (Blueprint $table) {
            $table->dropIndex(['event_id']);
            $table->dropIndex(['event_id', 'session_id']);
        });
    }
};
