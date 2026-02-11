declare module 'vuex' {
  import Vuex from 'vuex/types/index.d.ts'
  export * from 'vuex/types/index.d.ts'
  export default Vuex
}


// 這是 TypeScript 5.0 以後搭配 Vite 時常見的 bug。
// 原因是 Vuex v4 的 package.json 裡 exports 欄位沒有正確標註型別檔路徑，
// 而你目前的 tsconfig.json 使用 "moduleResolution": "bundler"，
// 這個模式只認得 exports 欄位裡聲明的內容。