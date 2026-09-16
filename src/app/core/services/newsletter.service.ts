import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '../firebase-config';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeResult = 'ok' | 'invalid-email' | 'error';

/**
 * "Join the Party" newsletter signup. Writes directly to a Firestore
 * collection (`subscribers`) from the browser using the Firebase client
 * SDK — no backend server needed. The Firestore security rules
 * (firestore.rules) restrict that collection to create-only, so this is
 * safe to call from public, unauthenticated visitors: nobody can read,
 * edit, or delete existing entries through the client SDK, only add a new
 * one shaped exactly like { email, source, createdAt }.
 *
 * Firebase app/Firestore are initialized lazily on first use rather than
 * at module load, so a missing/placeholder firebaseConfig doesn't break
 * anything until someone actually tries to submit the form.
 */
@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;

  private getDb(): Firestore {
    if (!this.db) {
      this.app = initializeApp(firebaseConfig);
      this.db = getFirestore(this.app);
    }
    return this.db;
  }

  /**
   * @param email visitor-entered email address
   * @param source where on the site the signup happened — e.g. 'hud-modal' or 'camp-scene'
   * @param honeypot a hidden form field real visitors never fill in; if it
   *   has any value, this is almost certainly a bot and we quietly report
   *   success without writing anything.
   */
  async subscribe(email: string, source: string, honeypot: string): Promise<SubscribeResult> {
    const trimmed = email.trim();

    if (honeypot) {
      // Silently "succeed" for bots so they don't learn to adapt.
      return 'ok';
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      return 'invalid-email';
    }

    try {
      await addDoc(collection(this.getDb(), 'subscribers'), {
        email: trimmed.toLowerCase(),
        source,
        createdAt: serverTimestamp()
      });
      return 'ok';
    } catch {
      return 'error';
    }
  }
}
