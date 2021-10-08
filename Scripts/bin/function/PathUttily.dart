import 'dart:io';

import 'package:path/path.dart';

import '../main.dart';

class PathUttily {
  static Directory get _root => Directory.current;

  static File getCuseForgeIndexFile() {
    return File(join(_root.path, dirGameVersion, 'CurseForgeIndex.json'));
  }

  static Directory getAssetsDirectory() {
    return Directory(join(_root.path, dirGameVersion, 'assets'));
  }

  static Directory getLangDirectory(String modID) {
    return Directory(join(getAssetsDirectory().path, modID, 'lang'));
  }

  static Directory getPatchouliBooksDirectory(String modID) {
    return Directory(join(getAssetsDirectory().path, modID, 'patchouli_books'));
  }

  static File getEnglishLangFile(String modID) {
    return File(join(getLangDirectory(modID).path, 'en_us.json'));
  }

  static File getChineseLangFile(String modID) {
    return File(join(getLangDirectory(modID).path, 'zh_tw.json'));
  }

  static File getOldChineseLangFile(String modID) {
    return File(join(getLangDirectory(modID).path, 'zh_tw.lang'));
  }
}
