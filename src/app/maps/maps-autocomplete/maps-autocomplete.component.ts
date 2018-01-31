import { Component, OnInit, OnChanges, NgZone, forwardRef, Input } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

import { GooglePlacesService } from '../google-places.service';

@Component({
    selector: 'app-maps-autocomplete',
    templateUrl: './maps-autocomplete.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MapsAutocompleteComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MapsAutocompleteComponent), multi: true }
    ]
})
export class MapsAutocompleteComponent implements ControlValueAccessor, OnInit, OnChanges, Validator {

    propagateChange:any = () => {};
    validateFn:any = () => {};
    _onTouched:any = () => {};
    
    @Input('placeholder') public placeholder: string = "Where is the bike?";
    @Input('showMap') public showMap: boolean = true;
    @Input('showInput') public showInput: boolean = true;
    @Input('inputClass') public inputClass: string = "";
    @Input('address') _address = {
        formatted_address: "",
        place_id: "",
        country: "",
        latitude: 0,
        longitude: 0
    };

    get address() {
        return this._address;
    }

    set address(val) {
        this._address = val;
        this.propagateChange(val);
        if (val.latitude && val.longitude){ 
			this.latitude = val.latitude;
            this.longitude = val.longitude;
			this.zoom = 15;
        }
        else{
            this.zoom = 4;
            this.latitude = 53.7;
            this.longitude = 4.8 * -1;
        }
        if (val.formatted_address){ 
			this.formatted_address = val.formatted_address;
			this.place_object = {description: this.formatted_address};
        }
        else{
			this.formatted_address = "";
			this.place_object = null;
        }
    }

    public latitude: number;
    public longitude: number;
    public formatted_address: string;
	public place_object: any;
    public country: string;
    public place_id: string;
    public searchControl: FormControl;
    public zoom: number;
    public pinUrl: string =  "./assets/images/pin-sm.png";
    public locationDisabled: boolean = false;
    public searchResult: any;

    constructor(
        private ngZone: NgZone,
        private googlePlacesSearchService: GooglePlacesService,
    ) { }

    ngOnInit() {
        this.zoom = 4;
        this.latitude = 53.7;
        this.longitude = 4.8 * -1;
    }

    ngOnChanges(inputs) {
        if (inputs.address){
            this.propagateChange(this.address);
        }
    }

    public validate(c: FormControl) {
        let err = {
            addressError: {
                given: c.value
            }
        };
        return (
            c.value != null && c.value != undefined &&
            c.value.formatted_address != undefined && c.value.formatted_address != "" &&
            c.value.place_id != undefined && c.value.place_id != "" &&
            c.value.country != undefined && c.value.country != "" &&
            c.value.latitude != undefined && c.value.country != 0 &&
            c.value.longitude != undefined && c.value.longitude != 0
        ) ? err : null;
    };

    writeValue(value) {
        if (value) {
            this.address = value;
        }
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn) {
        this._onTouched = fn;
    }

    public setCurrentPosition(){
        return this.googlePlacesSearchService.currentLocation()
            .subscribe((place) => {
                this.ngZone.run(() => {

                    if (place == null){
                        this.locationDisabled = true;
                        return;
                    }

                    this.locationDisabled = false;

                    if (place.geometry === undefined || place.geometry === null){
                        return;
                    }

                    this.zoom = 15;
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.country = place.address_components.find((d) => {
                        return d.types.some((e) => {return e == "country";})
                    }).short_name;
                    this.formatted_address = place.formatted_address;
                    this.place_object = {description: this.formatted_address};
                    this.address = {
                        formatted_address: this.formatted_address,
                        place_id: this.place_id,
                        country: this.country,
                        latitude: this.latitude,
                        longitude: this.longitude
                    }
                });
            });
    }

    public placesSearch = (text$: Observable<string>) => {
        return text$
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(term => {
                return this.googlePlacesSearchService.search(term)
                    .catch(() => {
                        return Observable.of([]);
                    });
            });
    };

    public getDetails(selection): void{
        return this.googlePlacesSearchService.details(selection.item.place_id)
            .subscribe((place) => {
                this.ngZone.run(() => {
                    if (place.geometry === undefined || place.geometry === null){
                        return;
                    }

                    this.zoom = 15;
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.country = place.address_components.find((d) => {
                        return d.types.some((e) => {return e == "country";})
                    }).short_name;
                    this.formatted_address = place.formatted_address;
					this.place_object = {description: this.formatted_address};
                    this.address = {
                        formatted_address: this.formatted_address,
                        place_id: this.place_id,
                        country: this.country,
                        latitude: this.latitude,
                        longitude: this.longitude
                    }
                });
            });
    }

    public formatter = (place: any) => {
        return place.description;
    }

    public blurCheck(){
        this._onTouched();
    }

}
