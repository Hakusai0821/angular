import { Component } from "@angular/core";

@Component({
  selector: "app-pipereverse",
  templateUrl: "./pipereverse.component.html",
  styleUrls: ["./pipereverse.component.css"],
})
export class PipereverseComponent {
  price: number = 198746.59793263568498;
  content: string = "今天天氣真好";
  msg:string="HELLO"
  date:number = Date.now()

}
