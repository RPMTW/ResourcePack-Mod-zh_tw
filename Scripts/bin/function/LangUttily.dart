import 'dart:convert';
import 'dart:io';

import 'package:archive/archive.dart';
import 'package:gson/gson.dart';
import 'package:path/path.dart';

import '../main.dart';
import 'PathUttily.dart';
import 'PathUttily.dart';

class LangUttily {
  /// Lang轉換為Json格式，由 https://gist.github.com/ChAoSUnItY/31c147efd2391b653b8cc12da9699b43 修改並移植而成
  /// 特別感謝3X0DUS - ChAoS#6969 編寫此function。
  static Map oldLangToMap(String source) {
    Map obj = {};

    String? lastKey;

    for (String line in LineSplitter().convert(source)) {
      if (line.startsWith("#") || line.startsWith("//") || line.startsWith("!")) continue;
      if (line.contains("=")) {
        if (line.split("=").length == 2) {
          List<String> kv = line.split("=");
          lastKey = kv[0];

          obj[kv[0]] = kv[1].trimLeft();
        } else {
          if (lastKey == null) continue;
          obj[lastKey] += "\n$line";
        }
      } else if (!line.contains("=")) {
        if (lastKey == null) continue;
        if (line == "") continue;

        obj[lastKey] += "\n$line";
      }
    }
    return obj;
  }

  static String oldLangToJson(String source) {
    Map obj = oldLangToMap(source);
    return json.encode(obj);
  }

  static String jsonToOldLang(Map json) {
    List<String> jsonKeys = json.keys.toList().cast<String>();
    String _lang = "";
    for (int i = 0; i < jsonKeys.length; i++) {
      if (jsonKeys[i].startsWith("_comment_")) {
        _lang += "#${json[jsonKeys[i]]}\n";
      } else {
        _lang += "${jsonKeys[i]}=${json[jsonKeys[i]]}\n";
      }
    }
    return _lang;
  }

  static Future<void> write(String modID, String englishLang) async {
    Map langMap = {};
    File chineseLang = PathUttily().getChineseLangFile(modID);
    late Map englishLangMap;

    /// 由於 1.12 使用舊版語系檔案格式
    if (dirGameVersion == "1.12") {
      englishLangMap = oldLangToMap(englishLang);
    } else {
      englishLangMap = gsonDecode(englishLang);
    }

    /// 假設先前已經存在語系檔案就新增回去
    if (await chineseLang.exists()) {
      langMap.addAll(json.decode(await chineseLang.readAsString()));
    }

    /// 新增英文語系檔案的內容
    langMap.addAll(englishLangMap);

    PathUttily().getChineseLangFile(modID)
      ..createSync(recursive: true)
      ..writeAsStringSync(JsonEncoder.withIndent('    ').convert(langMap));
  }

  static Future<bool> writePatchouliBooks(Archive archive, String modID) async {
    bool isPatchouliBooks = false;
    for (ArchiveFile file in archive) {
      String fileName = file.name;

      /// 1.14+ 使用 data 作為儲存 Patchouli 手冊位置 ，1.14 以下版本使用 assets 儲存 Patchouli 手冊位置
      if (fileName.startsWith("data/$modID/patchouli_books") || fileName.startsWith("assets/$modID/patchouli_books")) {
        /// 如果是檔案才處理
        if (file.isFile) {
          Directory patchouliBooksDir = PathUttily().getPatchouliBooksDirectory(modID);

          /// assets/[modID]/patchouli_books/[BookName]/[Lang_Code]/......

          List<String> _allPath = [patchouliBooksDir.path];
          List<String> _bookPath = split(fileName.split("/").sublist(3).join("/"));
          if (_bookPath[1] == "en_us") {
            /// 將 en_us 換成 zh_tw
            _bookPath[1] = "zh_tw";
          } else {
            continue;
          }
          isPatchouliBooks = true;

          _allPath.addAll(_bookPath);

          File(joinAll(_allPath))
            ..createSync(recursive: true)
            ..writeAsBytesSync(file.content as List<int>);
        }
      }
    }
    return isPatchouliBooks;
  }
}
