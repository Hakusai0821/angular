import { ChangeDetectorRef, HostListener, Injectable } from '@angular/core';
import { HttpProxyService, LoaddingService, WorkTaskDataSvc } from 'oc-restful';
import {
  ActivatedRoute,
  NavigationExtras,
  NavigationStart,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Workbook, Worksheet } from 'exceljs';
import { GraphqlDataSource, QueryOptions } from 'oc-datasource';

import { RowSelectedEvent } from 'ag-grid-community';
import * as _ from 'lodash-es';
import * as fs from 'file-saver';
import { MenuItem } from 'primeng/api';
// import { ColType } from 'oc-primeng';
// import { QueryColType } from 'oc-primeng';
import { GraphqlService } from 'oc-component';
import { JsonPipe } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { ColType } from '../type/coltype';
import { QueryColType } from '../type/querycoltype';

@Injectable()
export abstract class QuerySuper {
  public abstract query(event: any): void;
  queryoptions: QueryOptions = new QueryOptions();
  title: string = '';
  queryFilterBtns: MenuItem[] = [];
  filterSortName: string = '排序';
  filterSortIcon: string = 'fa fa-filter';
  locationInputValue: string = '';
  columns: ColType[] = [];
  filter: any; //查詢條件
  datasource!: GraphqlDataSource;
  workbook = new Workbook();
  worksheet = this.workbook.addWorksheet('明細');
  backups!: Subscription;
  deviceType = 768;
  _querygrid: any;
  filterOptions: any;
  // dynamiccolumn: any;
  router_subscription: Subscription;

  // get getWorktask(){
  //     return this.worktaskdataSvc.getWorktask(this.router.url)
  // }
  //傳目前路由的URL進去，會返回排序中最後一個工作任務
  getWorktask(): any {
    return this.worktaskdataSvc.getWorktask(this.router.url);
  }
  //設置延遲0.1秒來把工作任務先存到session中，再用getworktask去看有沒有成功存進去
  setWorktask(): any {
    setTimeout(() => {
      sessionStorage.setItem(
        'worktaskdatas',
        JSON.stringify(this.worktaskdataSvc.worktaskdatas)
      );
    }, 100);
    return this.worktaskdataSvc.getWorktask(this.router.url);
  }
  constructor(
    protected httpProxyService: HttpProxyService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected worktaskdataSvc: WorkTaskDataSvc,
    protected changeDetectorRef: ChangeDetectorRef,
    protected translate: TranslateService,
    protected loaddingService: LoaddingService,
    protected graphqlService: GraphqlService
  ) {
    //把目前螢幕寬度存在deviceType內，就可以有響應式網頁
    this.deviceType = window.innerWidth;

    //this.router.events:Angular路由提供的Obserable，用來監聽路由導向事件
    //用pipe內的filter()來篩選，只保留類型為NavigationStart(就是路由導向)的事件
    this.router_subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((res: any) => {
        //滿足條件就執行subscribe
        console.log(' 查詢頁 QuerySuper - ', this.getWorktask());
        console.log(res);
        //如果有工作任務的話
        if (this.getWorktask() != null) {
          //在backupdata中創建一個項目，鍵值用時間
          this.setWorktask().backupsdata[this.getWorktask().time] = {
            //備份資料
            datasource: {
              pageindex: this.datasource.pageindex, //目前頁數
              hasMore: this.datasource.hasMore, //hasMore(true/false)表示是否還有更多數據
              data: JSON.parse(JSON.stringify(this.datasource.data)),
            },
            //對查詢對像做深拷貝
            queryoptions: {
              options: JSON.parse(JSON.stringify(this.queryoptions.options)),
            },
            //也是備份
            filterSortName: this.filterSortName,
            filterSortIcon: this.filterSortIcon,
            locationInputValue: this.locationInputValue,
          };
          //把上面查詢的工作資料存進session
          sessionStorage.setItem(
            'worktaskdatas',
            JSON.stringify(this.worktaskdataSvc.worktaskdatas)
          );
        }
      });
  }

  //用來加載任物資料
  loadWorktaskData() {
    console.log(this.getWorktask());
    //如果有工作任務的話執行下面
    if (this.getWorktask() != null) {
      this.setWorktask().id = '查詢';
      this.setWorktask().type = 'query';
      let querys = this.getWorktask().backupsdata[this.getWorktask().time];

      if (querys != undefined) {
        this.queryoptions.options = querys.queryoptions.options;
        this.datasource.pageindex = querys.datasource.pageindex;
        this.datasource.hasMore = querys.datasource.hasMore;
        this.datasource.data = querys.datasource.data;
        this.locationInputValue = querys.locationInputValue;
        this.filterSortName = querys.filterSortName;
        this.filterSortIcon = querys.filterSortIcon;

        for (let el of this.queryFilterBtns) {
          el.icon = el.label == this.filterSortName ? this.filterSortIcon : '';
        }
      }
    }
  }
  ngOnInit() {
    //有什麼作用待參考
    // this.changeDetectorRef.detectChanges();
    // this.activatedRoute.fragment.subscribe(f => {
    //     const element: HTMLElement | null = document.getElementById(f!);
    //     if (element)
    //         element.scrollIntoView({ behavior: "smooth" });
    // });

    this.loadWorktaskData(); //載入任務資料
    //如果沒有數據，用query來查詢
    if (this.datasource.data.length == 0)
      this.query({
        pageindex: this.datasource.pageindex,
        pagesize: this.datasource.pagesize,
      });
    //有數據的話用setColumnSort()來排序
    else this.setColumnSort();
  }

  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (
      this._querygrid != undefined &&
      this._querygrid.grid != undefined &&
      this._querygrid.grid.api.getSelectedNodes().length > 0
    ) {
      if (localStorage.getItem('loading') == 'true') {
        //如果還在載入的話就直接返回
        return;
      }
      //用來抓表格中的索引，[0]表示抓目前選中的第一個節點
      let index = this._querygrid.grid.api.getSelectedNodes()[0].rowIndex;
      //如果按向上鍵and不是選第一欄的話，就移去選前一欄
      if (event.code == 'ArrowUp' && index > 0) {
        this._querygrid.grid.api.forEachNode((node: any) => {
          node.setSelected(node.rowIndex == index - 1);
        });
      }
      //如果按向下鍵and不是選最後一欄的話，就移去選後一欄
      if (
        event.code == 'ArrowDown' &&
        index < this._querygrid.gridData.length - 1
      ) {
        this._querygrid.grid.api.forEachNode((node: any) => {
          node.setSelected(node.rowIndex == index + 1);
        });
      }
      //如果按下enter的話進到編輯模式
      if (event.code == 'Enter') {
        this.toEdit(this._querygrid.grid.api.getSelectedNodes()[0]);
      }
    }
  }

  doQuery() {
    this.loaddingService.startLoading();
    //調API的get
    this.graphqlService
      .RxCreateJwtQuery<any>(this.datasource.url, this.datasource.getCmd())
      .subscribe({
        next: (res) => {
          //把查出來的資料填充到grid
          this.datasource.fillData(res);
          //下拉式選單、定位功能
          this.setColumnSort();
        },
        complete: () => {
          this.loaddingService.stopLoading();
        },
        error: (err) => {
          this.httpProxyService.errorHandle(err);
        },
      });
  }

  addcol(cols: QueryColType[]) {
    console.info('addcol');
    //產生Grid列的屬性，包括列的顯示名稱、能否排序、寬度之類的
    cols.forEach((elm) => {
      let col = new ColType();
      col.field = elm.field;
      col.headerName = elm.headerName;
      col.dateformat = elm.dateformat!;
      col.headerClass = elm.headerClass;
      col.sortable = elm.sortable;
      col.sort = elm.sort;
      //RWD
      //elm是cols內的列配置，col是自訂的
      if (this.deviceType > 768) {
        //電腦版&手機板column
        col.width = elm.width;
        col.maxWidth = elm.maxWidth;
        col.minWidth = elm.minWidth;
      }
      col.cellEditor = elm.cellEditor;//設置編輯器
      if (//如果編輯器or渲染器的格式是複選框，而且elm.cellstyle沒有被設置的話，就設定cellstyle的樣式
        (elm.cellEditor == 'checkbox' || elm.cellRenderer == 'checkbox') &&
        elm.cellStyle == (undefined || null)
      ) {
        col.cellStyle = {
          'text-align': 'center',
        };
      } else {//有被設置的話就把col.cellstyle的樣式設置成來源的
        col.cellStyle = elm.cellStyle;
      }
      col.cellRenderer = elm.cellRenderer;
      col.cellRendererParams = elm.cellRendererParams;
      col.valueGetter = elm.valueGetter;//valueGetter設置列的值獲取器
      this.columns.push(col);
    });
    //產生排序條件
    cols.forEach((elm) => {
      let _icon = '';
      //升冪排序的話給他向上箭頭
      if (elm.sort == 'asc') {
        this.filterSortName = elm.headerName + '';
        this.filterSortIcon = _icon = 'fa fa-arrow-up';
      } else if (elm.sort == 'desc') {//降冪排序的話給他向下箭頭
        this.filterSortName = elm.headerName + '';
        this.filterSortIcon = _icon = 'fa fa-arrow-down';
      }
      //用來渲染排序按鈕
      this.queryFilterBtns.push({
        label: elm.headerName,
        icon: _icon,
        iconStyle: '',
        command: (event) => {//按下按鈕觸發事件
          this.chooseFilterSort(event);
        },
      });
    });
  }

  chooseFilterSort(el: any) {
    console.log(el, this.queryFilterBtns);

    //獲得所選的排序並更新
    let listIndex = this.queryFilterBtns.findIndex(
      (val: any) => val.label == el.item.label
    );
      //把除了點擊的btn以外的icon清空
    for (let index = 0; index < this.queryFilterBtns.length; index++) {
      if (index == listIndex) {
        console.log(this.queryFilterBtns[index]);

        this.filterSortName = this.queryFilterBtns[index].label + '';
        //如果有箭頭按鈕的話取反
        if (this.queryFilterBtns[index].icon == 'fa fa-arrow-up') {
          this.filterSortIcon = this.queryFilterBtns[index].icon =
            'fa fa-arrow-down';
        } else {
          this.filterSortIcon = this.queryFilterBtns[index].icon =
            'fa fa-arrow-up';
        }
      } else {
        this.queryFilterBtns[index].icon = '';
      }
    }

    //和grid column title同步
    let columnState = this._querygrid.grid.api.getColumnDefs();
    //找第一個不為空的icon代表他是目前排序對象
    let Index = columnState.findIndex((val: any) => val.sort !== null);

    console.log(columnState, columnState[Index], this.queryFilterBtns);
    //如果有按鈕的icon為空的話，用splice把它移除
    for (let i = 0; i < this.queryFilterBtns.length; i++) {
      if (this.queryFilterBtns[i].label == '') {
        this.queryFilterBtns.splice(i, 1);
      }
    }
    //用findIndex來找icon不為空的來確認列頭
    let gridColumnTilteSortIndex = this.queryFilterBtns.findIndex(
      (val: any) => val.icon !== ''
    );
      //看目前排序的index是否跟gridColumnTilteSortIndex相同來判斷是否要切換排序狀態
    columnState.forEach((colDef: any, index: any) => {
      if (index == gridColumnTilteSortIndex) {
        colDef.sort = colDef.sort == 'asc' ? 'desc' : 'asc';
      } else {
        colDef.sort = null;
      }
    });

    this._querygrid.grid.api.setColumnDefs(columnState);//更新後的列標題傳進去ag-grid

    this.dataLocations(this.locationInputValue);//把排序好的grid資料依排進去
  }

  gridSort(el: any) {
    //抓目前的列定義
    let columnState = this._querygrid.grid.api.getColumnDefs();
    //抓目前依照哪個排序的
    let Index = columnState.findIndex((val: any) => val.sort !== null);

    console.log(columnState, columnState[Index]);
    console.log(this.queryFilterBtns);
    //移除所有標籤是空的
    for (let i = 0; i < this.queryFilterBtns.length; i++) {
      if (this.queryFilterBtns[i].label == '') {
        this.queryFilterBtns.splice(i, 1);
      }
      this.queryFilterBtns[i].icon = '';
    }

    if (columnState[Index] !== undefined) {
      //用列定義的列名來找當前的index
      let inDex = this.queryFilterBtns.findIndex(
        (val: any) => val.label == columnState[Index].headerName
      );
      console.log(inDex, this.queryFilterBtns[inDex]);

      this.filterSortName = this.queryFilterBtns[inDex].label + '';
      //用目前排序的狀態來決定要給他什麼箭頭
      if (columnState[Index].sort == 'asc') {
        this.queryFilterBtns[inDex].icon = this.filterSortIcon =
          'fa fa-arrow-up';
      } else if (columnState[Index].sort == 'desc') {
        this.queryFilterBtns[inDex].icon = this.filterSortIcon =
          'fa fa-arrow-down';
      }
    } else {//沒有排序的話就把全部icon都設為空的
      this.filterSortIcon = '';
      console.log(this.queryFilterBtns);
      for (let i = 0; i < this.queryFilterBtns.length; i++) {
        this.queryFilterBtns[i].icon = '';
      }
    }
    this.dataLocations(this.locationInputValue);//把排序完的傳進去grid
  }

//根據gird的排序規則來一個一個抓數據，把排序完的加進去newDate內
  dataLocations(event: any) {
    setTimeout(() => {
      let newDate: any[] = [];
      this._querygrid.grid.gridOptions.api.forEachNodeAfterFilterAndSort(
        (rowNode: any) => {
          //把排序好的資料推進newDate內
          newDate.push(rowNode.data);
        }
      );
      //再把newDate傳進去this.datasource.data內來顯示gird
      this.datasource.data = newDate;
    });

    setTimeout(() => {
      console.log(event);
      let value: string | null = null;//存搜尋關鍵字
      //抓用戶輸入的搜尋關鍵字
      if (event.target == null) {
        value = event;
      } else {
        value = event.target.value;
      }
      this.locationInputValue = value + '';
      let issetSelected = false;
      let columnState = this._querygrid.grid.api.getColumnDefs();
      let sreachValue: string = '';

      columnState.forEach((element: any) => {
        if (element.sort !== null) {//每個列是否有排序不為null的
          sreachValue = element.field.toString();//把field設給searchValue
        }
      });
      //如果找了一遍還是undefined的話代表沒有排序
      //改用filterSortName內的值來搜尋columStae，並把找到的值送進sreachValue
      if (sreachValue == undefined) {
        let index = columnState.findIndex(
          (val: any) => val.headerName == this.filterSortName
        );
        sreachValue = columnState[index].field.toString();
      }

      this._querygrid.grid.api.forEachNode((node: any) => {
        if (
          node.data[sreachValue] !== null &&
          node.data[sreachValue] != undefined
        ) {
          //先檢查是否是物件
          if (typeof node.data[sreachValue] === 'object') {
            if (//檢查abbrname內是否包含value
              node.data[sreachValue].abbrname.indexOf(value) != -1 &&
              !issetSelected
            ) {
              issetSelected = true;//設為true代表選中這行
              node.setSelected(true);
              //會直接移到選中的那行
              this._querygrid.grid.api.ensureIndexVisible(//
                node.rowIndex,
                'middle'
              );
            }
            //不是物件的話，檢查是否有value
          } else if (
            node.data[sreachValue].indexOf(value) != -1 &&
            !issetSelected
          ) {
            issetSelected = true;
            node.setSelected(true);
            this._querygrid.grid.api.ensureIndexVisible(
              node.rowIndex,
              'middle'
            );
            
          } else if (value !== null) {
            //檢查ASCII值是否在小寫字母的範圍內
            if (value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122) {
              //大小寫定位
              let upValue = value.toUpperCase();
              //轉為大寫並檢查
              if (
                node.data[sreachValue].toUpperCase().indexOf(upValue) != -1 &&
                !issetSelected
              ) {
                issetSelected = true;
                node.setSelected(true);
                this._querygrid.grid.api.ensureIndexVisible(
                  node.rowIndex,
                  'middle'
                );
              }
              //檢查是否為大寫字母
            } else if (value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90) {
              let lowerValue = value.toLowerCase();
              //轉為小寫並檢查
              if (
                node.data[sreachValue].toLowerCase().indexOf(lowerValue) !=
                  -1 &&
                !issetSelected
              ) {
                issetSelected = true;
                node.setSelected(true);
                this._querygrid.grid.api.ensureIndexVisible(
                  node.rowIndex,
                  'middle'
                );
              }
            }
          }
        } else if (node.data[sreachValue] == undefined && node.rowIndex == 0) {//預設第一行
          issetSelected = true;
          node.setSelected(true);
          console.log(node);

          this._querygrid.grid.api.ensureIndexVisible(2, 'middle');
        }
      });
    }, 200);
  }

  //這個是在進階查詢底下的那個選排序的下拉式選單框
  //選要用哪個欄位的標題(直的排)來排序，可以升冪排也可以降冪排
  //如果有A、B、C欄位，底下各自有資料，按下A之後A旁邊會出現一個向上的箭頭然後把資料由小到大排
  //再按一次會變成由大到小排，按下B之後會把A的箭頭清除，並顯示B的向上箭頭
  setColumnSort() {
    //把排序操作放在下一個事件循環中執行，避免UI更新卡到其他操作
    setTimeout(() => {
      //找到icon不為空的資料索引放到listIndex內
      let listIndex = this.queryFilterBtns.findIndex((val) => val.icon != '');
      console.log(listIndex);
      //用迴圈跑一遍queryFilterBtns，如果有找到index == listIndex的話
      //表示這是現在要進行排序的列，設置icon並把其他列的icon清除
      for (let index = 0; index < this.queryFilterBtns.length; index++) {
        if (index == listIndex) {
          this.filterSortName = this.queryFilterBtns[index].label + '';
          this.filterSortIcon =
            this.queryFilterBtns[index].icon == 'fa fa-arrow-up'? 'fa fa-arrow-up': 'fa fa-arrow-down';
        } else {
          this.queryFilterBtns[index].icon = '';
        }
      }

      //和grid column title同步
      //抓當前grid的列定義
      let columnState = this._querygrid.grid.api.getColumnDefs();
      columnState.forEach((colDef: any, index: any) => {
        //看是否有非空的icon來確定目前這列是不是要拿來排序的列
        if (index == this.queryFilterBtns.findIndex((val) => val.icon !== '')) {
          //圖標是否為arrow-up，是的話用升冪排，不是的話用降冪
          colDef.sort = this.queryFilterBtns[index].icon == 'fa fa-arrow-up' ? 'asc': 'desc';
        } else {
          colDef.sort = null;
        }
      });
      //把列定義應用到gird裡面
      this._querygrid.grid.api.setColumnDefs(columnState);
      //呼叫dataLocations()來顯示以排序後的數據
      this.dataLocations(this.locationInputValue);
    }, 0);
  }

  public toNew() {
    this.router.navigate(['null'], {
      queryParams: { amb: 'a', time: new Date().getTime() },
      relativeTo: this.activatedRoute,
    });
  }

  public toExit() {
    this.worktaskdataSvc.callCloseEvent.next({});
  }
  //頁面跳轉和參數傳遞功能
  ontabselect(item: any) {
    if (
      item == undefined ||
      this.router.url.split('?')[0] == item.url.split('?')[0]
    )
      return;

    let url = item.url.split('?')[0];
    let navigationExtras: NavigationExtras = {
      queryParams: {},
    };

    if (item.param != null) {
      for (let p of item.param.split('&')) {
        let d = p.split('=');
        if (navigationExtras.queryParams) {
          navigationExtras.queryParams[d[0]] = d[1];
        }
      }
    }

    this.router.navigate([decodeURI(url)], navigationExtras);
  }
  //進行編輯動作時，使用者選中的PK來進行路由導向
  public toEdit(row: RowSelectedEvent, field: string = '') {
    this.router.navigate([row.data.pk], {
      queryParams: { amb: 'b', time: new Date().getTime() },
      relativeTo: this.activatedRoute,
    });
  }

  unshiftworksheet(worksheet: any): boolean | null {
    return null;
  }
  //傳入Defs:列定義，worksheet:定義excel的，entity:要導出到excel的
  gridAutoExcel(defs: ColType[], worksheet: Worksheet, entity: any[]) {
    //進行深拷貝
    let columnDefs = _.cloneDeep(defs);
    let fullentity = _.cloneDeep(entity);

    this.unshiftworksheet(worksheet);
    //導出到excel的
    let tempwidth: { width: number }[] = [];
    let exceltitlearr: string[] = [];
    let refcolumnDefs: ColType[] = [];
    columnDefs.forEach((element) => {
      if (element.children != null) {
        refcolumnDefs.push(...(element.children as ColType[]));
      } else {
        refcolumnDefs.push(element);
      }
    });
    refcolumnDefs.forEach((element) => {
      let number = 0;
      if (element.width != null) {
        number = Number(element.width) / 8;
      } else {
        number = 25;
      }
      tempwidth.push({
        width: number,
      });
      exceltitlearr.push(this.translate.instant(element.headerName!));
    });

    // 設定Excel 寬度
    worksheet.columns = tempwidth;
    // 設定Title 名稱
    worksheet.addRow(exceltitlearr);

    // 根據AG-Grid valueGetter 轉變資料格式
    fullentity.forEach((el) => {
      let temp2: any[] = [];
      refcolumnDefs.forEach((col) => {
        if (col.valueGetter != null) {
          el[col.field] = col.valueGetter({ data: el });
        } else {
          el[col.field] = el[col.field];
        }
        if (col.valueFormatter != null) {
          el[col.field] = col.valueFormatter({
            data: el,
            value: el[col.field],
          });
        }
        temp2.push(el[col.field]);
      });
      worksheet.addRow(temp2);
    });

    // 根據Ag-Grid 樣式來設定Excel樣式
    for (let i = 0; i < refcolumnDefs.length; i++) {
      worksheet.eachRow((row) => {
        if (refcolumnDefs[i].headerClass != null) {
          // 判斷 headerClass 要靠左靠右還是置中。
          switch (refcolumnDefs[i].headerClass) {
            case 'gridright':
              row.getCell(i + 1).alignment = {
                vertical: 'bottom',
                horizontal: 'right',
              };
              break;
            case 'gridcenter':
              row.getCell(i + 1).alignment = {
                vertical: 'bottom',
                horizontal: 'center',
              };
              break;
          }
        }
      });
    }
  }

  async export(): Promise<void> {
    this.workbook = new Workbook();
    this.worksheet = this.workbook.addWorksheet('明細');
    await this.gridAutoExcel(
      this.columns,
      this.worksheet,
      this.datasource.data
    );
    let typename = this.translate.instant(this.title);
    this.workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, typename);
    });
  }

  getRectype(val: any) {
    if (val + '' == '0') {
      return '草稿';
    } else if (val + '' == '1') {
      return '確認';
    } else if (val + '' == '9') {
      return '作廢';
    }
    return '';
  }

  ngOnDestroy(): void {
    this.router_subscription.unsubscribe();
  }
}
