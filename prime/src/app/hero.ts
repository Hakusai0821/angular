
export type Hero={
    userName: string,
    pwd: string,
    email: string
}

export const renderHeroData=(userName:string,pwd:string,email:string):Hero=>{
    return{
          userName,
          //顯示文字
          pwd,
          //編輯狀態
          email,
    }
}