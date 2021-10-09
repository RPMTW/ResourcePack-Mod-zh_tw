import 'dart:convert';
import 'dart:io';

import 'PathUttily.dart';

class CurseForgeIndex {
  File get file => PathUttily().getCuseForgeIndexFile();

  late Map _index;

  Map get map => _index;

  CurseForgeIndex() {
    _index = readAsMap();
  }

  String read() {
    return file.existsSync() ? file.readAsStringSync() : "{}";
  }

  Map readAsMap() {
    return json.decode(read());
  }

  void write(String modID, int curseForgeID) {
    _index[modID] = curseForgeID.toString();
    save();
  }

  void save() {
    file
      ..createSync(recursive: true)
      ..writeAsStringSync(json.encode(_index));
  }
}
