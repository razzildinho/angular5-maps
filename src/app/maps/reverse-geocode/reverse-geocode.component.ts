import { Component, OnChanges, OnInit, Input, NgZone } from '@angular/core';

import { GooglePlacesService } from '../google-places.service';

@Component({
  selector: 'app-reverse-geocode',
  template: `{{address}}`,
})
export class ReverseGeocodeComponent implements OnChanges, OnInit {

    @Input('latitude') public latitude: number = 0;
    @Input('longitude') public longitude: number = 0;
    public address: string = "";

    constructor(
        private googlePlacesSearchService: GooglePlacesService,
        private ngZone: NgZone
    ) { }

	ngOnInit(){}

    private lookup (){
        this.googlePlacesSearchService.reverseGeocode({'location': {lat: this.latitude, lng: this.longitude}})
            .subscribe((place) => {
                this.ngZone.run(() => {
                    if (place != null){
                        this.address = place.formatted_address;
		    	    }
		    	    else {
		    	    	this.address = `${this.longitude}, ${this.latitude}`
                    }
                });
		    });
    }

    ngOnChanges() {
        this.lookup();
    }

}
