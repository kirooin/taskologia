import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// import { NG_STATUS_CLASSES } from '@angular/forms/signals/compat';
// import { provideSignalFormsConfig } from '@angular/forms/signals';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // provideSignalFormsConfig({
    //   classes: NG_STATUS_CLASSES
    // })
  ]
};
