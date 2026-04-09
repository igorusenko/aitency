import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="w-full h-full flex items-center justify-center p-6">
      <div class="text-center max-w-xl">
        <h1 class="text-3xl font-semibold mb-2">Page not found</h1>
        <p class="text-color-secondary mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <a routerLink="/home" class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-contrast hover:opacity-90">
          Go to Home
        </a>
      </div>
    </div>
  `
})
export class NotFound {}
