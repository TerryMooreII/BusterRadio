import {Component, OnInit} from "@angular/core";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'br-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

    search: FormControl = new FormControl();

    constructor(private router: Router) {
        this.search.valueChanges
            .debounceTime(400)
            .subscribe(term => {
                if (term){
                    this.router.navigate(['/artists', {query: term}]);
                }
            })
    }

    ngOnInit() {

    }

    clear(){
        this.search.setValue(null);
    }

}
