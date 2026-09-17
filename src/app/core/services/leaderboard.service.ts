import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, getFirestore, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { FirebaseAppService } from './firebase-app.service';
import type { GameId } from './easter-egg.service';

export interface LeaderboardEntry {
  name: string;
  score: number;
}

export type SubmitScoreResult = 'ok' | 'invalid' | 'error';

/** One Firestore collection per game (rather than one collection filtered by
 * a `game` field) so `orderBy(score, desc).limit(N)` works with zero
 * composite indexes to create/maintain. */
const COLLECTION_BY_GAME: Record<GameId, string> = {
  fireflies: 'leaderboard_fireflies',
  'dragon-run': 'leaderboard_dragon_run'
};

/**
 * Generous sanity ceilings enforced both here and in firestore.rules —
 * these block an obviously-forged/garbage value, they are NOT real
 * anti-cheat. A determined visitor can still submit any score up to the
 * ceiling directly via the browser console, since there's no server
 * authoritatively re-simulating gameplay (that would need a Cloud
 * Function). Fine for a for-fun hidden mini-game leaderboard; revisit if
 * this ever needs to be tamper-proof.
 */
const MAX_SCORE_BY_GAME: Record<GameId, number> = {
  fireflies: 500,
  'dragon-run': 20000
};

const TOP_N = 10;
const NAME_MAX_LEN = 24;

/**
 * Global, cross-visitor "Top 10" leaderboard per hidden mini-game, backed
 * by Firestore. Firestore security rules let anyone READ these collections
 * (so the board can display to every visitor) and CREATE a new entry
 * shaped exactly like { name, score, createdAt } within the score ceiling
 * above — but never update or delete an existing entry, so nobody can
 * tamper with someone else's spot on the board.
 */
@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly firebaseApp = inject(FirebaseAppService);
  private db: Firestore | null = null;

  private getDb(): Firestore {
    if (!this.db) {
      this.db = getFirestore(this.firebaseApp.getApp());
    }
    return this.db;
  }

  async getTop(game: GameId): Promise<LeaderboardEntry[]> {
    try {
      const q = query(collection(this.getDb(), COLLECTION_BY_GAME[game]), orderBy('score', 'desc'), limit(TOP_N));
      const snap = await getDocs(q);
      return snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return { name: String(data['name'] ?? '???'), score: Number(data['score'] ?? 0) };
      });
    } catch {
      // Most likely cause: firestore.rules hasn't been deployed yet, or
      // firebase-config.ts still has placeholder values. Fail quiet — an
      // empty board is a fine fallback, not worth surfacing as an error.
      return [];
    }
  }

  async submitScore(game: GameId, name: string, score: number): Promise<SubmitScoreResult> {
    const trimmedName = name.trim().slice(0, NAME_MAX_LEN);
    const roundedScore = Math.round(score);

    if (!trimmedName) return 'invalid';
    if (!Number.isFinite(roundedScore) || roundedScore < 0 || roundedScore > MAX_SCORE_BY_GAME[game]) return 'invalid';

    try {
      await addDoc(collection(this.getDb(), COLLECTION_BY_GAME[game]), {
        name: trimmedName,
        score: roundedScore,
        createdAt: serverTimestamp()
      });
      return 'ok';
    } catch {
      return 'error';
    }
  }
}
