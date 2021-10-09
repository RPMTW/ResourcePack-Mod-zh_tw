import 'dart:convert';
import 'dart:io';

import 'package:path/path.dart';

import '../function/LangUttily.dart';
import '../function/PathUttily.dart';

/// 將 1.12 Json 轉為 lang
class JsonToLang {
  static final String route = "json_to_lang";

  static Future<void> run() async {
    Directory assetsDir = PathUttily.getAssetsDirectory();
    for (FileSystemEntity assets in assetsDir.listSync()) {
      File langFile = PathUttily.getChineseLangFile(basename(assets.path));
      File oldLangFile = PathUttily.getOldChineseLangFile(basename(assets.path));

      if (langFile.existsSync()) {
        await oldLangFile.writeAsString(LangUttily.jsonToOldLang(json.decode(await langFile.readAsString())));
      }
    }
  }
}
