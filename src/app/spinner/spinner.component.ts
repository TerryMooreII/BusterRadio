import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Input} from "@angular/core/src/metadata/directives";

@Component({
    selector: 'br-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.less']
})
export class SpinnerComponent{

    @Input() show = false;

}
