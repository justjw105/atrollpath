import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorldMapNavComponent } from './shared/world-map-nav/world-map-nav.component';
import { SiteFooterComponent } from './shared/site-footer/site-footer.component';
import { ScrollSpyService } from './core/services/scroll-spy.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WorldMapNavComponent, SiteFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly spy = inject(ScrollSpyService);

  ngAfterViewInit(): void {
    // Wait a tick so section elements from the routed page exist in the DOM.
    setTimeout(() => this.spy.observe(), 0);
  }

  ngOnDestroy(): void {
    this.spy.disconnect();
  }
}
