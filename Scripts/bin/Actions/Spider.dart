import '../Apis/CurseForgeAPI.dart';
import '../Models/CurseForgeAddon.dart';
import '../main.dart';
import 'DownloadModLangFile.dart';

class Spider {
  static final String route = "spider";

  static Future<void> run(int modConut) async {
    int _index = (modConut / 50).ceil();

    for (int i = 0; i < _index; i++) {
      try {
        CurseForgeAddons addons = await CurseForgeAPI.searchAddons(gameVersion, index: i * 50, pageSize: _index == (i + 1) ? modConut % 50 : 50);

        for (CurseForgeAddon addon in addons) {
          await DownloadModLangFile.run(addon.id);
        }
      } catch (e) {
        print("抓取模組時發生未知錯誤\n$e");
      }
    }
  }
}
