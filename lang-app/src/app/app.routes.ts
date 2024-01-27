import { Routes } from '@angular/router';
import {SettingsComponent} from "./components/settings/settings.component";
import {RecentlyAddedComponent} from "./components/recently-added/recently-added.component";
import {ExercisesComponent} from "./components/exercises/exercises.component";

export const routes: Routes = [
  { path: 'recently-added', component: RecentlyAddedComponent },
  { path: 'exercises', component: ExercisesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: '/recently-added', pathMatch: 'full' }
];
