import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

/**
 * Each "scene" gets a real, crawlable, shareable URL (matching SCENES in
 * core/services/scene.service.ts) even though all of them render through
 * the same HomeComponent — SceneService reads the route's `sceneId` data
 * on first load and sets the initial scene before anything paints.
 *
 * GROWTH POINT: adding a new scene = one entry here (path + sceneId
 * matching a SCENES entry) + the usual scene-service/home-component wiring
 * described there.
 */
export const routes: Routes = [
  { path: '', component: HomeComponent, data: { sceneId: 'hero' } },
  { path: 'treasure-room', component: HomeComponent, data: { sceneId: 'featured' } },
  { path: 'friends-of-the-troll', component: HomeComponent, data: { sceneId: 'friends' } },
  { path: 'the-makers-tower', component: HomeComponent, data: { sceneId: 'gallery' } },
  { path: 'troll-cave', component: HomeComponent, data: { sceneId: 'visit' } },
  { path: '**', redirectTo: '' }
];
