import {Component, Input} from "@angular/core";

@Component({
    selector: 'br-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.less']
})
export class SpinnerComponent{

    @Input() show = false;

}
