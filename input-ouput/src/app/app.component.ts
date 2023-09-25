import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <input type="text" [(ngModel)]="form" />
    <p>Result: {{ form }}</p>
    <app-input [(name)]="form"></app-input>
  `,
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  form = "Mike";
}
