import 'dart:collection';
import 'dart:convert';

class CurseForgeAddons extends ListBase<CurseForgeAddon> {
  List<CurseForgeAddon> _list;

  CurseForgeAddons(this._list);

  @override
  int get length => _list.length;

  @override
  set length(int newLength) => _list.length = newLength;

  @override
  CurseForgeAddon operator [](int index) {
    return _list[index];
  }

  @override
  void operator []=(int index, CurseForgeAddon value) {
    _list[index] = value;
  }

  factory CurseForgeAddons.empty() => CurseForgeAddons([]);

  factory CurseForgeAddons.format(List<dynamic> list) {
    return CurseForgeAddons(
      list.map((dynamic item) => CurseForgeAddon.fromJson(item)).toList(),
    );
  }
}

class CurseForgeAddon {
  /// Addon 專案ID
  final int id;

  /// Addon 專案名稱
  final String name;

  /// Addon 下載次數
  final int downloadCount;

  /// Addon 專案網址識別碼
  final String slug;

  final List<Map> gameVersionLatestFiles;
  final List<Map> latestFiles;

  final String _dateModified;
  final String _dateCreated;
  final String _dateReleased;

  /// Addon 最後修改日期
  DateTime get dateModified => DateTime.parse(_dateModified);

  /// Addon 建立日期
  DateTime get dateCreated => DateTime.parse(_dateCreated);

  /// Addon發布日期
  DateTime get dateReleased => DateTime.parse(_dateReleased);

  int? getLastFileIdByVersion(String version) {
    try {
      return gameVersionLatestFiles.firstWhere(
        (Map item) => item['gameVersion'] == version,
      )['projectFileId'];
    } catch (e) {
      return null;
    }
  }

  int getLastFileId() {
    return latestFiles.reversed.first['id'];
  }

  CurseForgeAddon(
      this.id,
      this.name,
      this.downloadCount,
      this.slug,
      this.gameVersionLatestFiles,
      this.latestFiles,
      this._dateModified,
      this._dateCreated,
      this._dateReleased);

  factory CurseForgeAddon.fromJson(Map json) {
    return CurseForgeAddon(
        json['id'],
        json['name'],
        double.parse(json['downloadCount'].toString()).toInt(),
        json['slug'],
        json['gameVersionLatestFiles'].cast<Map>(),
        json['latestFiles'].cast<Map>(),
        json['dateModified'],
        json['dateCreated'],
        json['dateReleased']);
  }

  Map toMap() {
    return {
      'id': id,
      'name': name,
      'downloadCount': downloadCount,
      'slug': slug,
      'gameVersionLatestFiles': json.encode(gameVersionLatestFiles),
      'latestFiles': json.encode(latestFiles),
      'dateModified': _dateModified,
      'dateCreated': _dateCreated,
      'dateReleased': _dateReleased
    };
  }

  String toJson() {
    return json.encode(toMap());
  }
}
