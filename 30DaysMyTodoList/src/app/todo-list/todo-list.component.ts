import { Component, OnInit } from "@angular/core";
// Service
import { TodoListService } from "./todo-list.service";

// Class
import { Todo } from "./todo.model";
import { TodoStatusType } from "./todo-status-type";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.css"],
})
export class TodoListComponent implements OnInit {
  constructor(private todoListService: TodoListService) {}
  ngOnInit(): void {}

  // /**
  //  * 新增代辦事項
  addTodo(event: KeyboardEvent): void {
    const todoThing = event.target as HTMLInputElement;
    if (!todoThing) {
      return;
    }
    if (event.key === "Enter") {
      const todo = todoThing.value.trim();
      this.todoListService.add(todo);
      console.log(todo);
      todoThing.value = "";
    }
  }

  //  * 取得待辦事項清單

  getList(): Todo[] {
    let list: Todo[] = [];

    switch (this.status) {
      case TodoStatusType.Active:
        list = this.getRemainingList();
        break;

      case TodoStatusType.Completed:
        list = this.getCompletedList();
        break;

      default:
        list = this.todoListService.getList();
        break;
    }
    return list;
  }

  /**
   * 移除待辦事項
   */
  remove(index: number): void {
    this.todoListService.remove(index);
  }

  /**
   * 開始編輯待辦事項
   */
  edit(todo: Todo): void {
    todo.editable = true;
  }

  /**
   * 更新待辦事項
   */
  update(todo: Todo, newTitle: string): void {
    if (!todo.editing) {
      return;
    }

    const title = newTitle.trim();

    // 如果有輸入名稱則修改事項名稱
    if (title) {
      todo.setTitle(title);
      todo.editable = false;

      // 如果沒有名稱則刪除該項待辦事項
    } else {
      const index = this.getList().indexOf(todo);
      if (index !== -1) {
        this.remove(index);
      }
    }
  }

  /**
   * 取消編輯狀態
   */
  cancelEditing(todo: Todo): void {
    todo.editable = false;
  }

  /**
   * 取得未完成的待辦事項清單
   */
  getRemainingList(): Todo[] {
    return this.todoListService.getWithCompleted(false);
  }

  /**
   * 待辦事項狀態的列舉
   */
  todoStatusType = TodoStatusType;

  //  * 目前狀態
  //  *
  private status = TodoStatusType.All;

  /**
   * 取得已完成的待辦事項
   */
  getCompletedList(): Todo[] {
    return this.todoListService.getWithCompleted(true);
  }

  /**
   * 設定狀態
   */
  setStatus(status: number): void {
    this.status = status;
  }

  /**
   * 檢查目前狀態
   *
   * @param {number} status - 欲檢查的狀態
   * @returns {boolean}
   * @memberof TodoListComponent
   */
  checkStatus(status: number): boolean {
    return this.status === status;
  }

  /**
   * 從清單中移除所有已完成之待辦事項
   *
   * @memberof TodoListComponent
   */
  removeCompleted(): void {
    this.todoListService.removeCompleted();
  }

  /**
   * 取得所有的待辦事項清單（不受狀態影響）
   *
   * @returns {Todo[]}
   * @memberof TodoListComponent
   */
  getAllList(): Todo[] {
    return this.todoListService.getList();
  }

  /**
   * 所有的代辦事項是否都已完成
   *
   * @returns {boolean}
   * @memberof TodoListComponent
   */
  allCompleted(): boolean {
    return this.getAllList().length === this.getCompletedList().length;
  }

  /**
   * 設定所有的待辦事項已完成/未完成
   *
   * @param {boolean} completed - 已完成/未完成
   * @memberof TodoListComponent
   */
  setAllTo(completed: boolean): void {
    this.getAllList().forEach((todo) => {
      todo.setCompleted(completed);
    });
  }
}
