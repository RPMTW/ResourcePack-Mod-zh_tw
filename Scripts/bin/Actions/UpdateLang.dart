import '../function/CurseForgeIndex.dart';
import 'DownloadModLangFile.dart';

class UpdateLang {
  static final String route = "update_lang";

  static Future<void> run() async {
    Map curseForgeIndex = CurseForgeIndex().map;
    int _doneCount = 1;

    for (String curseID in curseForgeIndex.values) {
      try {
        _doneCount++;
        print("[ $_doneCount/${curseForgeIndex.length} ] 更新語系檔案中...");
        await DownloadModLangFile.run(int.parse(curseID));
      } catch (e) {
        print("[$curseID] 更新語系檔案時發生未知錯誤\n$e");
      }
    }
  }
}
