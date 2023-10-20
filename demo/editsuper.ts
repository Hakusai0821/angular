/*
 * @Author: sz_teddy mailto:teddychenbin@126.com
 * @Date: 2023-01-06 14:01:12
 * @LastEditors: sz_teddy mailto:teddychenbin@126.com
 * @LastEditTime: 2023-01-06 14:41:48
 * @FilePath: \occ-bbd-030\src\app\services\EditSuper2.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/*
名詞解釋:
amb:代表目前的編輯狀態，a是新增 m是編輯 b是唯讀
res:HTTP請求返回的數據
data:目前看下來是res還有x的回應資料
options:FormGroup綁定的資料名字，裡面都塞這個響應式表單的內容
pk:每筆資料都會有的，類似流水號orID之類
rectype:案件狀態，草稿 = 0，已儲存 = 1，作廢 = 9
*/

import {
  NavigationExtras,
  NavigationStart,
  Params,
  Router,
} from "@angular/router";
import {
  EventResultT,
  HttpProxyService,
  IEntity,
  LoaddingService,
  WorkTask,
  UrlParamService,
  WorkTaskDataSvc,
} from "oc-restful";
import { ConfirmationService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import {
  concatMap,
  filter,
  never,
  Subject,
  Subscription,
  takeUntil,
  tap,
} from "rxjs";
import { ChangeDetectorRef, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ColType } from "../type/coltype";

//columns: ColType[] = []; 轉入子類
//子類刪除 isSaveBtn
//子類刪除 setworktaskData 的應用

@Injectable()
export abstract class EditSuper<T extends FormGroup, E extends IEntity> {
  amb = ""; //編輯狀態
  time = ""; //當前進行操作的時間
  pk = ""; //每筆資料的鍵值
  options!: T; //太多了自己去看上面名詞解釋
  title: string = "";
  relatedNeeds: any = [];
  private ngUnsubscribe = new Subject();
  backups!: Subscription; //資料備份
  deviceType = 768;
  columns: any = [];

  error1 = "";
  error2 = "";
  fieldKey: any;
  titlekey: any;
  titlelevel2key: any;
  titlelevel3key: any;
  isSaveBtn = false;
  router_subscription: Subscription;

  // 取得分頁
  getWorktask(): any {
    return this.worktaskdataSvc.getWorktask(this.router.url);
  }

  // 設定分頁
  setWorktask(): any {
    setTimeout(() => {
      sessionStorage.setItem(
        "worktaskdatas",
        JSON.stringify(this.worktaskdataSvc.worktaskdatas)
      );
    }, 100);
    return this.worktaskdataSvc.getWorktask(this.router.url);
  }

  constructor(
    protected httpProxyService: HttpProxyService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected loaddingService: LoaddingService,
    protected confirmationService: ConfirmationService,
    protected worktaskdataSvc: WorkTaskDataSvc,
    private changeDetectorRef: ChangeDetectorRef,
    protected translate: TranslateService,
    protected urlParamSvc: UrlParamService
  ) {
    console.info("edit constructor");
    //RWD抓視窗寬度
    this.deviceType = window.innerWidth;
    //上面分頁的部分，會把已開啟的分頁存在session裡面
    this.router_subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((res: any) => {
        console.log(" 編輯頁 EditSuper2 - ", this.getWorktask());
        console.log(res);
        // console.log(this.getWorktask().url);
        console.log(this.router.url);

        if (this.getWorktask() != null && this.time != "") {
          this.setWorktask().backupsdata[this.time] =
            this.options.getRawValue();
          sessionStorage.setItem(
            "worktaskdatas",
            JSON.stringify(this.worktaskdataSvc.worktaskdatas)
          );
        }
      });
  }

  //子類創建提供api路由地址
  abstract getApiPath(): string;
  //子類創建FormGroup
  abstract getFormGroup(): T;

  // 銀行練習開始點[@1]
  ngOnInit(): void {
    this.initForm();
  }

  //備份用，先檢查工作狀態是否為edit還有是否有設置時間，如果有已備份的數據的話就用fillData把數據填充到實體中
  backupsEntity() {
    if (
      this.getWorktask().type == "edit" &&
      this.getWorktask().backupsdata[this.time] != undefined
    ) {
      setTimeout(() => {
        this.fillData(this.getWorktask().backupsdata[this.time]);
      }, 200);
      return true;
    }
    return false;
  }

  // 新增
  createEntity() {
    //先檢查路由中是否有  pk + "/"  如果有的話代表是新增模式
    if (this.router.url.indexOf(this.pk + "/") == -1) {
      this.setWorktask().type = "edit";
      this.setWorktask().id = "新增";
      console.log("1223");
    }
    this.loaddingService.startLoading(); //跑載入動畫
    if (this.backupsEntity()) {
      this.loaddingService.stopLoading(); //關掉載入動畫
      return;
    }
    // call api，對照component.ts檔裡面getApiPath()
    this.httpProxyService
      .RxCreateJwtJsonPost<EventResultT<E>>(this.getApiPath() + "/create", null)
      .subscribe({
        next: (res) => {
          // 填充資料
          if (res.success) this.fillData(res.data);
        },
        complete: () => {
          this.loaddingService.stopLoading();
        },
        error: (err) => {
          this.httpProxyService.errorHandle(err);
        },
      });
  }
  //載入entity畫面
  loadEntity() {
    this.loaddingService.startLoading();
    if (this.backupsEntity()) {
      this.loaddingService.stopLoading();
      return;
    }
    this.httpProxyService
      .RxCreateJwtJsonGet<EventResultT<E>>(this.getApiPath() + "/" + this.pk)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            // 分頁標籤
            if (
              this.getWorktask().type == "" &&
              this.router.url.indexOf(this.pk + "/") == -1
            ) {
              this.setWorktask().type = "edit";
              if (this.titlelevel2key && !this.titlelevel3key) {
                this.setWorktask().id =
                  res.data[this.titlekey]?.[this.titlelevel2key];
              } else if (this.titlelevel2key && this.titlelevel3key) {
                this.setWorktask().id =
                  res.data[this.titlekey]?.[this.titlelevel2key]?.[
                    this.titlelevel3key
                  ];
              } else {
                this.setWorktask().id = res.data[this.titlekey];
              }
            }
            // 填充資料
            this.fillData(res.data);
          }
        },
        complete: () => {
          this.loaddingService.stopLoading();
        },
        error: (err) => {
          this.httpProxyService.errorHandle(err);
        },
      });
  }

  // 填充資料
  //對data進行深拷貝，產生保有data資料但是是全新物件的ds
  //a新增m編輯b唯讀，如果是新增或編輯的話把options打開
  fillData(data: E) {
    let ds = JSON.parse(JSON.stringify(data));
    console.info(data);
    console.info(this.amb);
    if (this.amb == "a" || this.amb == "m") this.options.enable();
    else this.options.disable();
    this.patchValueToForm(ds);
  }

  //提供 2line 資料擴充
  patchValueToForm(data: E) {
    this.options.patchValue(data);
  }

  initFormGroup() {
    //建立一個新formGroup叫options
    this.options = this.getFormGroup();
    //數據加載完成後變成enable
    this.options.disable();
  }

  // 銀行專案開始點[@2]
  initForm() {
    this.initFormGroup();
    //用takeUntil()可以在組件銷毀的時候取消訂閱
    this.activatedRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        let progs = JSON.parse(String(sessionStorage.getItem("progs")))[
          this.router.url.split("/" + res["pk"])[0]
        ];
        this.relatedNeeds = [];
        if (progs != undefined) {
          for (let item of progs.sub) {
            this.relatedNeeds.push({
              title: item.title,
              router: item.path == null ? "" : item.path,
              icon: item.icon,
            });
          }
        }
        this.pk = res["pk"];
        this.initparms(res);
      },
      complete: () => {},
      error: (err) => {
        console.error(err);
      },
    });

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          console.info(res);
          this.amb = res["amb"];
          this.time = res["time"];
          if (this.options.getRawValue() != null) {
            // 依照amb打開或關閉
            if (this.amb == "a" || this.amb == "m")
              //把options打開
              this.options.enable();
            //把options關閉
            else this.options.disable();
          }

          // 有沒有pk，沒有就是新增，有就是編輯
          setTimeout(() => {
            if (this.pk == "null") {
              this.createEntity(); //新增
            } else {
              this.loadEntity(); //編輯
            }

            this.setUrlParamData();
          }, 200);
        },
        complete: () => {},
        error: (err) => {
          console.error(err);
        },
      });
  }

  initparms(event: Params) {}

  /**
   * @description: 編輯事件
    @param {} event
    @return {}
   */

  // 新增按鈕
  toNew() {
    this.router.navigate(["../null"], {
      queryParams: { amb: "a", time: new Date().getTime() },
      relativeTo: this.activatedRoute,
    });
  }

  //作廢
  doBan() {
    console.info(this.options);

    this.confirmationService.confirm({
      header: "提示",
      message: "確定要作廢嗎?",
      accept: () => {
        this.options.controls["rectype"].patchValue("9");
        this.saveEntity(this.options.getRawValue());
      },
    });
  }

  //還原
  doUndo(event: string) {
    console.info(this.options);

    this.confirmationService.confirm({
      header: "提示",
      message: "確定要還原嗎?",
      accept: () => {
        if (event == "VU") {
          this.options.controls["rectype"].patchValue("1");
        } else {
          this.options.controls["rectype"].patchValue("0");
        }
        this.saveEntity(this.options.getRawValue());
      },
    });
  }

  // 編輯
  doEdit() {
    this.initFormGroup();
    this.router.navigate(["."], {
      relativeTo: this.activatedRoute,
      queryParams: { amb: "m", time: new Date().getTime() },
    });
  }

  /**
   * @description: 取消事件
    @param {} event
    @return {}
   */
  //問你是不是真的要狠心取消的提示框
  doCancel() {
    this.confirmationService.confirm({
      header: "提示",
      message: "確定要放棄嗎?",
      accept: () => {
        if (this.amb == "a") {
          this.worktaskdataSvc.callCloseEvent.next({}); //用來關閉目前編輯頁面
        } else {
          this.initFormGroup();
          this.router.navigate(["."], {
            relativeTo: this.activatedRoute,
            queryParams: { amb: "b", time: new Date().getTime() },
          });
          //把畫面切為唯讀模式 就是回到按下編輯之前的狀態
        }
      },
    });
  }

  // 離開
  doExit() {
    this.worktaskdataSvc.callCloseEvent.next({});
  }
  //切換上面那些分頁，並在切換過去新分頁的時候抓那頁的資料渲染給你看
  ontabselect(item: any) {
    if (
      item == undefined ||
      this.router.url.split("?")[0] == item.url.split("?")[0]
    )
      return;

    let url = item.url.split("?")[0];
    let navigationExtras: NavigationExtras = {
      queryParams: {},
    };

    if (item.param != null) {
      for (let p of item.param.split("&")) {
        let d = p.split("=");
        if (navigationExtras.queryParams) {
          navigationExtras.queryParams[d[0]] = d[1];
        }
      }
    }

    this.router.navigate([decodeURI(url)], navigationExtras);
  }

  /**
   * @description: 刪除事件
    @param {} event
    @return {}
   */

  //問你是不是真的要狠心刪除的提示框
  doDelete() {
    this.confirmationService.confirm({
      header: "提示",
      message: "確定要刪除嗎?",
      accept: () => {
        this.deleteEntity();
      },
    });
  }

  /**
   * @description: 保存事件
    @param {} event
    @return {}
   */
  // 確認儲存
  doSave() {
    console.info(this.options);
    if (this.formGroupRequired()) {
      this.options.controls["rectype"].patchValue("1");
      this.saveEntity(this.options.getRawValue());
    }
  }

  // 儲存草稿
  doDraft() {
    console.info(this.options);
    if (this.formGroupRequired()) {
      this.options.controls["rectype"].patchValue("0");
      this.saveEntity(this.options.getRawValue());
    }
  }

  formGroupRequired(FG: any = this.options) {
    let className = FG.constructor.getName();
    console.log(className);
    console.log(FG.valid);
    if (!FG.valid) {
      for (let key in FG.controls) {
        let formcontrol = FG.get(key);
        if (
          formcontrol instanceof FormControl &&
          formcontrol.errors?.["required"]
        ) {
          console.error(key + " is FormControl");
          this.showError(
            "請輸入" + this.translate.instant(`${className}.${key}`) + "\n"
          );
        } else if (formcontrol instanceof FormArray) {
          formcontrol.controls.forEach((elm: any, index) => {
            for (let item in elm["controls"]) {
              if (elm.get(item).errors?.["required"]) {
                console.error(key + " is FormArray");
                let reqClassName = this.translate.instant(
                  `${className}.${key}`
                );
                let req2lineName = this.translate.instant(
                  `${className}.${item}`
                );
                this.showError(
                  `${reqClassName}列表中第${
                    index + 1
                  }筆資料，${req2lineName}欄位必填\n`
                );
              }
            }
          });
        } else if (formcontrol instanceof FormGroup) {
          this.formGroupRequired(formcontrol);
        }
      }
    }
    return FG.valid;
  }
  //doDelete之後就會進到這邊刪除並把query的資料清掉然後離開
  deleteEntity() {
    this.loaddingService.startLoading();
    this.httpProxyService
      .RxCreateJwtDelete<EventResultT<Boolean>>(this.getApiPath(), this.pk)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.clearQueryData();
            this.doExit();
          } else {
            this.showError(res.message);
          }
        },
        complete: () => {
          this.loaddingService.stopLoading();
        },
        error: (err) => {
          this.httpProxyService.errorHandle(err);
        },
      });
  }
  //清空query數據的
  clearQueryData() {
    let a = this.worktaskdataSvc.worktaskdatas.filter(
      (s: any) =>
        s.type == "query" && this.router.url.split("?")[0].indexOf(s.pk) != -1
    );
    if (a.length > 0) {
      a[0].backupsdata[a[0].time + ""].datasource.data = [];
    }
  }
  //儲存entity的，不管作廢、新增、編輯都會用到這個(透過rectype來決定存成哪種狀態)
  //阿反正就是儲存
  saveEntity(data: E) {
    console.info("data");
    console.info(data);

    this.loaddingService.startLoading();
    this.httpProxyService
      .RxCreateJwtJsonPost<EventResultT<Object>>(
        this.getApiPath() + "/validate",
        data
      )
      .pipe(
        tap((x) => {
          if (!x.success) {
            this.showError(x.message);
            this.loaddingService.stopLoading();
          }
        }),
        concatMap((x) =>
          x.success
            ? this.httpProxyService.RxCreateJwtJsonPost<EventResultT<E>>(
                this.getApiPath(),
                data
              )
            : never()
        ),
        tap((x) => {
          if (x.success) {
            this.save_after(x.data);
          } else {
            this.showError(x.message);
          }
        })
      )
      .subscribe({
        next: (value) => {},
        complete: () => {
          this.loaddingService.stopLoading();
        },
        error: (err) => {
          this.httpProxyService.errorHandle(err);
        },
      });
  }
  //用來做saveentity做完之後的事情，就是儲存完之後進行路由導向
  //儲存完之後清空路由的參數(先關閉該分頁)
  //導向到剛剛儲存的頁面但是切換成唯讀模式(開新的分頁顯示剛剛新增的資料並切換成唯讀模式)
  save_after(d: E) {
    this.initFormGroup();
    if (this.amb == "a") {
      this.worktaskdataSvc.callCloseEvent.next({});
    }
    this.clearQueryData();
    this.router.navigate(["..", d.pk], {
      relativeTo: this.activatedRoute,
      queryParams: { amb: "b", time: new Date().getTime() },
    });
  }
  //提示確認框
  showError(msg = "") {
    this.confirmationService.confirm({
      header: "提示",
      message: msg,
      acceptLabel: "確認",
      rejectVisible: false,
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true); //告訴所有訂閱者說組件要被銷毀了可以清出記憶體了
    this.ngUnsubscribe.complete(); //告訴subscribe說已經不會有新訂閱事件發出
    this.router_subscription.unsubscribe(); //取消訂閱路由
    // this.backups.unsubscribe();
  }
  //設置ag-grid內容
  addcol(cols: any, columns: ColType[] = this.columns) {
    //用foreach跑每一個元素來設置CSS
    cols.forEach((elm: any) => {
      if (elm.cellEditor == "number" && elm.cellStyle == undefined) {
        elm.cellStyle = {
          "text-align": "right",
        };
      }
      if (elm.cellEditor == "checkbox" && elm.cellStyle == undefined) {
        elm.cellStyle = {
          "text-align": "center",
        };
      }
      elm.cellEditorParams = elm.cellEditorParams;
      if (
        (elm.cellEditor == "number" || elm.cellEditor == "float") &&
        elm.valueGetter == undefined
      ) {
        if (elm.cellEditor == "float") {
          //設到小數點後兩位
          elm.cellEditorParams = { precision: 2 };
        }
        //valuegetter()是用來自訂要怎麼抓grid裡面的資料並顯示在grid上的，例如grid裡面有年齡的欄位
        //valuegetter()可以設定<18就在欄位中顯示未成年，>18顯示成年
        elm.valueGetter = (event: any) => {
          //如果是number就設到小數點後第0位，有小數點的話就設到第二位
          return this.formatNumber(
            event.data.controls[elm.field].value + "",
            elm.cellEditor == "number" ? 0 : 2
          );
        };
      }
      columns.push(elm);
    });
  }

  //就只是處理小數點的方法 不用太細看直接抓來用就好
  formatNumber(value: any, precision: number = 0) {
    let replacevalue = "";
    //用正則表達式去掉非數字和小數點
    replacevalue = value.replace(/[^\d.]/g, "");

    if (
      replacevalue.length > 1 &&
      replacevalue.substr(0, 1) == "0" &&
      replacevalue.substr(1, 1) != "."
    ) {
      replacevalue = replacevalue.substr(1);
    }
    //如果是負號開頭的保留起來
    if (value.length >= 1 && value.substr(0, 1) == "-") {
      replacevalue = "-" + replacevalue;
    }

    const list = `${replacevalue}`.split(".");
    const prefix = list[0].charAt(0) === "-" ? "-" : "";
    let num = prefix ? list[0].slice(1) : list[0];
    let result = "";
    //增加千位符號(就是1,000,000中間的那個逗號啦)
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }

    if (num) {
      result = num + result;
    }
    //檢查precision，來決定要返回什麼樣的資料 整數or小數
    if (precision != undefined && precision > 0) {
      if (list.length > 1) {
        return `${prefix}${result}.${list[1].substr(0, precision)}`;
      } else {
        return `${prefix}${result}`;
      }
    } else {
      return `${prefix}${result}`;
    }
  }

  /* 將上筆與下筆query資料放進urlparamsvc裡面，上筆下筆切換的時候可以根據資料調整路由參數 */
  setUrlParamData() {
    let nowQueryData = this.worktaskdataSvc.worktaskdatas.find(
      (s: any) =>
        s.type == "query" &&
        this.router.url.split("?")[0].indexOf(s.pk + "/") != -1
    );
    if (nowQueryData != null) {
      let nowQueryTime: string =
        nowQueryData.time == null ? "" : nowQueryData.time;
      let nowIndex: number = nowQueryData.backupsdata[
        nowQueryTime
      ].datasource.data.findIndex((e: any) => e.pk == this.pk);
      let nextData: any =
        nowQueryData.backupsdata[nowQueryTime].datasource.data[nowIndex + 1];
      let previousData: any =
        nowQueryData.backupsdata[nowQueryTime].datasource.data[nowIndex - 1];
      this.urlParamSvc.setNextData(nextData);
      this.urlParamSvc.setPreviousData(previousData);
    }
  }
}
