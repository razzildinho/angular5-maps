import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

import { MapsAPILoader } from "@agm/core";

// declare var google: any;

@Injectable()
export class GooglePlacesService {

  	private autocompleteService: any;
  	private placeDetailsService: any;
    private geocoderService: any;

  	constructor(
		private mapsAPILoader: MapsAPILoader,
	){
		this.mapsAPILoader.load().then(() => {
            this.autocompleteService = new google.maps.places.AutocompleteService;
            this.placeDetailsService = new google.maps.places.PlacesService(<HTMLDivElement>document.createElement('div'));
            this.geocoderService = new google.maps.Geocoder;
		});
  	}

  	search(term: string) {
    	if (term === '') {
      		return Observable.of([]);
    	}

        let result = Observable.create(observer => {
            let boundsPts = [
                new google.maps.LatLng(55.770754, -10.462277),
                new google.maps.LatLng(59.216046, -8.634475),
                new google.maps.LatLng(61.838497, 0.300894),
                new google.maps.LatLng(52.384969, 2.480895),
                new google.maps.LatLng(51.020427, 1.564462),
                new google.maps.LatLng(49.401682, -5.359782),
                new google.maps.LatLng(52.198983, -15.561210)
            ];

            let bounds = new google.maps.LatLngBounds();
            boundsPts.forEach(function(d){
                bounds.extend(d);
            });

        	this.autocompleteService.getPlacePredictions({ 
                bounds: bounds, 
                input: term,
                types: ["geocode"],
			}, (results, status) => {
          		if (status == google.maps.places.PlacesServiceStatus.OK) {
            		observer.next(results);
            		observer.complete();
          		} else {
            		console.log('Error - ', results, ' & Status - ', status);
            		observer.next({});
            		observer.complete();
          		}
        	});
    	});
    	return result;
    }

    details(place){
        let result = Observable.create(observer => {
            this.placeDetailsService.getDetails({placeId: place}, (results, status) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
            		observer.next(results);
            		observer.complete();
            	} else {
            		console.log('Error - ', results, ' & Status - ', status);
            		observer.next({});
            		observer.complete();
            	}
            });
        });
        return result;
    }

    reverseGeocode(position){
        let result = Observable.create(observer => {
            this.geocoderService.geocode(position, (res) => {
                if (res.length > 0){
                    let place: google.maps.GeocoderResult = res.find((d) => {
                        return d.types.some((e) => {return e == "street_address";})
                    })
                    if (typeof(place) == 'undefined'){
                        place = res[0];
                    }
                    observer.next(place);
                    observer.complete();
                }
                else {
                    observer.next(null);
                    observer.complete();
                }
            });
        });
        return result;
    }

    currentLocation(){
        let result = Observable.create(observer => {
            if ("geolocation" in navigator){
                navigator.geolocation.getCurrentPosition((position) => {
                    this.geocoderService.geocode({
                        'location': {
                            lat: position.coords.latitude, 
                            lng: position.coords.longitude
                        }
                    }, (res) => {
                        if (res.length > 0){
                            let place: google.maps.GeocoderResult = res.find((d) => {
                                return d.types.some((e) => {return e == "street_address";})
                            })
                            if (typeof(place) == 'undefined'){
                                place = res[0];
                            }
                            observer.next(place);
                            observer.complete();
                        }
                        else {
                            observer.next(null);
                            observer.complete();
                        }
                    });
                }, (err) => {
                    observer.next(null);
                    observer.complete();
                });
            }
            else{
                observer.next(null);
                observer.complete();
            }
        });
        return result;
    }

}
