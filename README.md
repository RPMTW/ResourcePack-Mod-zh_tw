# ResourcePack-Mod-zh_tw
一個兼容Forge/Fabric的Minecraft繁體中文化模組的資源包。  

## 主旨:
> 希望透過此專案能夠盡量將curseforge上的模組進行繁體中文化翻譯，也歡迎大家來幫助我們進行翻譯。  

## 如何下載/安裝此資源包?
首先請先到 [這裡](https://github.com/SiongSng/ResourcePack-Mod-zh_tw/releases/latest) 會有最新版本的資源包 依據教學下載下來
然後到遊戲內的 ESC>選項>資源包>開啟資源包資料夾 把下載下來的檔案丟進去即可。  
   
## 支援
遇到問題了? 歡迎到我們的[Discord伺服器](https://discord.gg/5w9BUM4)詢問呦!  
  
## 如何協助我們翻譯?
~~如果很會使用github/翻譯模組基本上不用看此教學(X~~

首先要先有一個可以編輯文字的軟體(記事本...)，建議使用[Notepad++](https://notepad-plus-plus.org/)
然後確認您要翻譯的模組，接著要取得那個模組的ID，至於如何取得呢?  繼續看下去吧。
假設說看到這個模組想要翻譯，要先知道你要翻譯哪個版本，例如現在最新版本是1.16 那我就去下載1.16的模組檔案下來
![test](https://media.discordapp.net/attachments/808603449285410846/811887465468002354/unknown.png)    
接著進入模組的頁面之後選擇Files(檔案)，然後往下滑動。  
![test](https://media.discordapp.net/attachments/808603449285410846/811893144799019038/unknown.png)  
選擇View All(顯示全部)這個按鈕  
![test](https://media.discordapp.net/attachments/808603449285410846/811893407999852544/unknown.png)  
接著打開這個選單選擇你要翻譯的版本 例如說我要翻譯1.16的版本 那就選擇1.16之後把模組檔案下載下來。  
![test](https://media.discordapp.net/attachments/808603449285410846/811893625977700372/unknown.png)  
接著建議大家安裝[WinRAR](https://rar.tw/)是一個解壓縮程式他可以解壓縮模組的檔案，用來取得模組原本的文本。  
安裝完[WinRAR](https://rar.tw/)之後，對著模組檔案右鍵選擇"解壓縮至此"  
![test](https://media.discordapp.net/attachments/808603449285410846/811894334751244288/unknown.png)  
解壓縮完成後通常會出現類似下圖的資料夾格式，接著打開assets裡面是專門放模組文字、圖片、動畫等等的檔案。  
![test](https://media.discordapp.net/attachments/808603449285410846/811894746297532436/unknown.png)  
首先一進來會看到一個資料夾，那個資料夾的名稱就是模組ID了，請先把他記下來(寫在記事本裡之類的)  
![test](https://media.discordapp.net/attachments/808603449285410846/811895101953540106/unknown.png)  
打開資料夾後會看到一個資料夾是"lang"，他是專門儲存模組文字檔的地方(如果沒有這個資料夾可能是這個模組程式碼寫死，或者您的步驟錯誤)    
![test](https://media.discordapp.net/attachments/808603449285410846/811895439820849152/unknown.png)  
打開"lang"資料夾後通常會看到很多的文字檔案，附檔名為.json(麥塊版本1.7以後)或者.lang(麥塊版本1.7以前)    
![test](https://media.discordapp.net/attachments/808603449285410846/811895973424136212/unknown.png)   
通常我們會拿英文的原始檔案來做翻譯，英文的代號為en-us(麥塊版本1.7以後)或者en-US(麥塊版本1.7以前)   
接著對著英文的檔案按下右鍵，選擇Edit with [Notepad++](https://notepad-plus-plus.org/)(使用[Notepad++](https://notepad-plus-plus.org/)編輯)  
![test](https://media.discordapp.net/attachments/808603449285410846/811896715513954375/unknown.png)    
打開之後會看到下圖類似的畫面(麥塊版本1.7以前跟現在有點不一樣)，每個字串都會用""來框住文字。  
![test](https://media.discordapp.net/attachments/808603449285410846/811897197142212638/unknown.png?width=503&height=701)  
### 翻譯時注意事項
翻譯的時候要特別小心不要把 `""` 刪除了，還有編輯時請使用"半形"文字進行編輯，以免導致錯誤。
在文本中如果看到類似下圖有%s %xxx \<xxx> %xxx% 這類的文字千萬不要修改 且記得**使用"半形"文字編輯 使用"半形"文字編輯 使用"半形"文字編輯** (很重要所以說三次)   
![test](https://media.discordapp.net/attachments/808603449285410846/811898041825099786/unknown.png)   
翻譯時如果遇到無法翻譯的文字網路上也查不到相關說明，可以到遊戲內測試看看那功能是什麼用途，如果還是不知道，請"不要"去翻譯他，直接跳過。   
### 如何把翻譯完成後的文字上傳給我們?
翻譯完成後，要上傳給我們的話，請進入 [此網頁](https://github.com/SiongSng/ResourcePack-Mod-zh_tw/new/main)   
您會看到如下圖 第一個框框請填入`版本(例如1.16、1.17...)`加上`模組ID` 加上 `/assets/lang/` 再加上 `zh_tw.json`(如果原本英文檔案是en-US後面的US是大寫，請將TW也改為大寫，如果原本英文檔案的副檔名是.lang請將副檔名改為.lang而不是.json)  
![test](https://media.discordapp.net/attachments/808603449285410846/811900110157512734/unknown.png)  
接著在下方貼上您翻譯後的內容，往下滑在框框內輸入更改內容(建議加上模組版本)，下方較大的框框是敘述可填可不填，再按下Propose new file(提交新文件)按鈕 就可以提交惹。  
![test](https://media.discordapp.net/attachments/808603449285410846/811901735412432896/unknown.png)  
提交完成後會出現一個綠色按鈕(這邊沒有圖片可以演示)也請記得按下去。  

#### 以上遇到任何問題請私訊Discord (菘菘#8663) ， 需有共同伺服器才能私訊(https://discord.gg/5w9BUM4)  

### 我們非常感激你們的幫助，讓這個專案更好。  
