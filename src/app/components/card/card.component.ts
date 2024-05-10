import { Component, Input } from '@angular/core';

interface ItemObject {
  name: string;
  topics: Array<string>;
  description: string;
  language: string;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() cardData: ItemObject = {
    name: 'Not Provided',
    topics: [],
    description: 'Running Nike- Collection 2022',
    language: '5.0',
  };
  ngOnViewInit() {
    console.log(this.cardData);
  }
}
