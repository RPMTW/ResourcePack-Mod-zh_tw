import '../function/CurseForgeIndex.dart';
import 'DownloadModLangFile.dart';

class UpdateLang {
  static final String route = "update_lang";

  static Future<void> run() async {
    Map curseForgeIndex = CurseForgeIndex().map;

    for (String curseID in curseForgeIndex.values) {
      try {
        print("[ ${(curseForgeIndex.values.toList().indexOf(curseID)) + 1}/${curseForgeIndex.length} ] 更新語系檔案中...");
        await DownloadModLangFile.run(int.parse(curseID));
      } catch (e) {
        print("[$curseID] 更新語系檔案時發生未知錯誤\n$e");
      }
    }
  }
}
