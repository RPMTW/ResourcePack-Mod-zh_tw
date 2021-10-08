import 'dart:convert';

import 'package:archive/archive.dart';
import 'package:archive/archive_io.dart';

import '../Apis/CurseForgeAPI.dart';
import '../Models/CurseForgeAddon.dart';
import '../Models/CurseForgeFile.dart';
import 'DownloadModLangFile.dart';

class DownloadModPack {
  static final String route = "download_modpack";

  static Future<void> run(int modPackID) async {
    try {
      print("[ $modPackID | 1/4 ] 解析模組包資訊中...");
      CurseForgeAddon addon = await CurseForgeAPI.getAddonByID(modPackID);

      CurseForgeFile file = await CurseForgeAPI.getFileInfoByID(addon.id, addon.getLastFileId());

      Archive? archive = await file.downloadToArchive();

      if (archive != null) {
        ArchiveFile? manifestFile = archive.findFile("manifest.json");

        if (manifestFile != null) {
          Map manifest = json.decode(Utf8Decoder(allowMalformed: true).convert(manifestFile.content as List<int>));
          print("[ $modPackID | 2/4 ] 解析模組包資訊成功");

          List<Map> modList = manifest["files"].cast<Map>();

          print("[ $modPackID | 3/4 ] 準備開始下載模組包檔案中... 共有 ${modList.length} 個模組");

          for (Map mod in modList) {
            await DownloadModLangFile.run(mod['projectID'], lastFile: true);
          }

          print("[ $modPackID | 4/4 ] 模組包檔案全數處理完成");
        } else {
          print("[ $modPackID | error ] 找不到模組包資訊檔案");
        }
      } else {
        print("[ $modPackID | error ] 下載模組包時發生未知錯誤");
      }
    } catch (e) {
      print("[ $modPackID | error ] 處理模組包時發生未知錯誤\n$e");
    }
  }
}
