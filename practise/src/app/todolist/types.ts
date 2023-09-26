export type Template={
    id:number,
    value:string,
    edit:boolean,
    from?:string,
    to?:string,
}

export const renderTemplateData=(value:string):Template=>{
    return{
          id:Date.now(),
          //顯示文字
          value,
          //編輯狀態
          edit:false,
    }
}