// /**
//  * 待辦事項的資料物件模型
//  *
//  * @export
//  * @class Todo
//  */
export class Todo {
  //     /**
  //    * 事項名稱
  //    *
  //    * @private
  //    * @memberof Todo
  //    */
  private title = "";

  //   /**
  //    * 完成與否
  //    *
  //    * @private
  //    * @memberof Todo
  //    */
  private completed = false;

  /**
   * Creates an instance of Todo.
   *
   * @param {string} title - 待辦事項的名稱
   * @memberof Todo
   */
  constructor(title: string) {
    this.title = title || ""; // 為避免傳入的值為 Falsy 值，稍作處理
  }

  // **
  //  * 此事項是否已經完成
 
  get done(): boolean {
    return this.completed;
  }

  /**
   * 取得事項名稱
   *
   * @returns {string}
   * @memberof Todo
   */
  getTitle(): string {
    return this.title;
  }

  // **
  //  * 來回切換完成狀態
  //  *
  toggleCompletion(): void {
    this.completed = !this.completed;
  }

  /**
   * 是否處於編輯模式
   *
   * @private
   * @memberof Todo
   */
  private editMode = false;

  /**
   * 取得此事項是否處於編輯模式
   *
   * @readonly
   * @type {boolean}
   * @memberof Todo
   */
  get editing(): boolean {
    return this.editMode;
  }

  /**
   * 設定此事項是否可被編輯
   *
   * @memberof Todo
   */
  set editable(bl: boolean) {
    this.editMode = bl;
  }

  /**
   * 設定事項名稱
   *
   * @param {string} title
   * @memberof Todo
   */
  setTitle(title: string): void {
    this.title = title;
  }


  //  * 設定是否完成
  setCompleted(completed: boolean): void {
    this.completed = completed;
  }
}
