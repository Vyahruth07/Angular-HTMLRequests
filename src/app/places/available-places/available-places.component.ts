import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  selectedPlace=output<Place>();
  isFetching=signal(false);
  error=signal('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  placesService      = inject(PlacesService);

  ngOnInit(){
    this.isFetching.set(true);
    const subscription=
    this.placesService.loadAvailablePlaces()
    .subscribe({
      next: (places) =>{
        this.places.set(places);
        // console.log(response.body?.places);
      },
      error:(error: Error) =>{
        this.error.set(error.message);
      },
      complete:() =>{
        this.isFetching.set(false);
      }
    });
    this.destroyRef.onDestroy(() =>{
      subscription.unsubscribe();
    })
  }

  onSelectPlace(selectedPlace: Place){
    const subscription=this.placesService.addPlaceToUserPlaces(selectedPlace.id).subscribe({
      next: (resData) => console.log(resData),
    })
    this.destroyRef.onDestroy(() =>{
      subscription.unsubscribe();
    })
  }
  
}