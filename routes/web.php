<?php

use App\Http\Controllers\AdminCampaignsController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BallotController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CategoriesDatabaseController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::get('events/{event:slug}', [EventsController::class, 'show'])->name('events.show');

Route::post('events/{event}/ballot', [BallotController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('events.ballot.store');

Route::get('categories/{category}/businesses', [CategoriesDatabaseController::class, 'index'])->name('categories.businesses');

Route::post('categories/{category}/businesses', [CategoriesDatabaseController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('categories.businesses.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('admin', [AdminController::class, 'index'])->name('admin');

    Route::get('campaigns', [AdminCampaignsController::class, 'index'])->name('adminCampaigns');

    Route::post('campaigns/{campaign}/events', [EventsController::class, 'store'])->name('events.store');

    Route::patch('events/{event}', [EventsController::class, 'update'])->name('events.update');

    Route::get('categories', [CategoriesController::class, 'index'])->name('adminCategories');

    Route::post('categories', [CategoriesController::class, 'store'])->name('categories.store');

    Route::patch('categories/{category}', [CategoriesController::class, 'update'])->name('categories.update');

    Route::get('businesses', [CategoriesDatabaseController::class, 'adminIndex'])->name('adminBusinesses');

    Route::post('businesses', [CategoriesDatabaseController::class, 'adminStore'])->name('businesses.store');

    Route::patch('businesses/{business}', [CategoriesDatabaseController::class, 'adminUpdate'])->name('businesses.update');

    Route::delete('businesses/{business}', [CategoriesDatabaseController::class, 'adminDestroy'])->name('businesses.destroy');

    Route::get('reports/ballots', [ReportsController::class, 'ballots'])->name('adminReportsBallots');

    Route::get('reports/ballots/export', [ReportsController::class, 'ballotsExport'])->name('reports.ballots.export');
});

require __DIR__.'/settings.php';

Route::get('/event/images/{path}', function (string $path) {
    if (str_contains($path, '..')) {
        abort(404);
    }

    $disk = Storage::disk('public');

    if (! $disk->exists($path)) {
        abort(404);
    }

    $allowedRoot = realpath(storage_path('app/public/event-banners'));
    $resolvedPath = realpath($disk->path($path));

    if ($allowedRoot === false || $resolvedPath === false || ! str_starts_with($resolvedPath, $allowedRoot)) {
        abort(404);
    }

    return response()->file($resolvedPath);
})->where('path', 'event-banners/.*');

