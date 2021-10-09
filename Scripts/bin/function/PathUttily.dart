import 'dart:io';

import 'package:path/path.dart';

import '../main.dart';

class PathUttily {
  final bool zhTWPath;
  PathUttily({this.zhTWPath = false});

  Directory get _root => zhTWPath ? Directory(join(Directory.current.path, "zh-TW")) : Directory.current;

  File getCuseForgeIndexFile() {
    return File(join(_root.path, dirGameVersion, 'CurseForgeIndex.json'));
  }

  Directory getAssetsDirectory() {
    return Directory(join(_root.path, dirGameVersion, 'assets'));
  }

  Directory getLangDirectory(String modID) {
    return Directory(join(getAssetsDirectory().path, modID, 'lang'));
  }

  Directory getPatchouliBooksDirectory(String modID) {
    return Directory(join(getAssetsDirectory().path, modID, 'patchouli_books'));
  }

  File getEnglishLangFile(String modID) {
    return File(join(getLangDirectory(modID).path, 'en_us.json'));
  }

  File getChineseLangFile(String modID) {
    return File(join(getLangDirectory(modID).path, 'zh_tw.json'));
  }

  File getOldChineseLangFile(String modID) {
    return File(join(getLangDirectory(modID).path, 'zh_tw.lang'));
  }
}
