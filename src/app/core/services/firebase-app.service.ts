import { Injectable } from '@angular/core';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';

/**
 * Single shared Firebase App instance for the whole site. Both
 * NewsletterService and LeaderboardService need a Firestore handle, and
 * calling `initializeApp` twice with the same config throws ("Firebase App
 * named '[DEFAULT]' already exists") — so every consumer goes through this
 * one lazy getter instead of calling initializeApp itself.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseAppService {
  private app: FirebaseApp | null = null;

  getApp(): FirebaseApp {
    if (!this.app) {
      const existing = getApps();
      this.app = existing.length > 0 ? existing[0] : initializeApp(firebaseConfig);
    }
    return this.app;
  }
}
