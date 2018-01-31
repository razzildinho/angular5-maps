import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {} from '@types/googlemaps';
import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { DummyFormComponent } from './dummy-form/dummy-form.component';
import { MapsAutocompleteComponent } from './maps/maps-autocomplete/maps-autocomplete.component';
import { ReverseGeocodeComponent } from './maps/reverse-geocode/reverse-geocode.component';

import { GooglePlacesService } from './maps/google-places.service';

const agmConfig = {
    apiKey: "AIzaSyCm5P_cJtvxFDqFCIQhZYDgpFdizA_TWD0",
    libraries: ["places"]
}


@NgModule({
    declarations: [
        AppComponent,
        DummyFormComponent,
        MapsAutocompleteComponent,
        ReverseGeocodeComponent,
    ],
    imports: [
        BrowserModule,
        AgmCoreModule.forRoot(agmConfig),
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
    ],
  providers: [GooglePlacesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
