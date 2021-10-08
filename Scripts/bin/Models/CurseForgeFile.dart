import 'dart:convert';

import 'package:archive/archive_io.dart';
import 'package:dio/dio.dart';

class CurseForgeFile {
  /// 檔案的 Addon ID
  final int addonID;

  /// 檔案 ID
  final int id;

  /// 檔案所適用的遊戲版本
  final List gameVersion;

  /// 檔案的下載連結
  final String downloadUrl;

  final String _gameVersionDateReleased;

  /// 檔案發布日期
  DateTime get gameVersionDateReleased => DateTime.parse(_gameVersionDateReleased);

  CurseForgeFile(
    this.addonID,
    this.id,
    this.gameVersion,
    this.downloadUrl,
    this._gameVersionDateReleased,
  );

  factory CurseForgeFile.fromJson(int addonID, Map json) {
    return CurseForgeFile(addonID, json['id'], json['gameVersion'], json['downloadUrl'], json['gameVersionDateReleased']);
  }

  Future<Archive?> downloadToArchive() async {
    try {
      Response response = await Dio().get(downloadUrl, options: Options(responseType: ResponseType.bytes));

      return ZipDecoder().decodeBytes(response.data);
    } catch (e) {
      return null;
    }
  }

  Map toMap() {
    return {
      'id': id,
      'gameVersion': gameVersion,
      'downloadUrl': downloadUrl,
      'gameVersionDateReleased': _gameVersionDateReleased,
    };
  }

  String toJson() {
    return json.encode(toMap());
  }
}
