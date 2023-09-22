import { Injectable } from "@angular/core";

// Class
import { Todo } from "./todo.model";

@Injectable({
  providedIn: "root",
})
export class TodoListService {
  constructor() {}
  private list: Todo[] = [];

  //  * 新增待辦事項
  //  *
  //  * @param {string} title - 待辦事項的標題
  //  * @memberof TodoListService
  //  */
  add(title: string): void {
    // 避免傳入的 title 是無效值或空白字串，稍微判斷一下
    if (title || title.trim()) {
      this.list.push(new Todo(title));
    }
  }

  //  * 取得待辦事項清單
  //  *
  getList(): Todo[] {
    return this.list;
  }

  //  * 移除待辦事項
  //  *
  remove(index: number): void {
    this.list.splice(index, 1);
  }

  // **
  //  * 取得已完成/未完成的清單
 
  getWithCompleted(completed: boolean): Todo[] {
    return this.list.filter((todo) => todo.done === completed);
  }

  /**
   * 從清單中移除所有已完成之待辦事項
   *
   * @memberof TodoListService
   */
  removeCompleted(): void {
    this.list = this.getWithCompleted(false);
  }
}
