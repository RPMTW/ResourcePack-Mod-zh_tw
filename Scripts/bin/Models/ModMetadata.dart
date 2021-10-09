import 'dart:convert';

import 'package:gson/decoder.dart';
import 'package:gson/encoder.dart';
import 'package:gson/gson.dart';
import 'package:toml/toml.dart';

class ModMetadata {
  /// 模組的唯一識別碼
  final String modID;

  /// 模組的名稱
  final String name;

  final String version;

  ModMetadata(this.modID, this.name, this.version);

  factory ModMetadata.fromForge112(List<int> bytes) {
    String string = Utf8Decoder(allowMalformed: true).convert(bytes);
    Map meta = json.decode(string)[0];
    return ModMetadata(meta['modid'], meta['name'], meta['version']);
  }

  factory ModMetadata.fromForge113(List<int> bytes) {
    String string = Utf8Decoder(allowMalformed: true).convert(bytes);
    Map meta = TomlDocument.parse(string).toMap()['mods'][0];
    return ModMetadata(meta['modId'], meta['displayName'], meta['version']);
  }

  factory ModMetadata.fromFabric(List<int> bytes) {
    String string = Utf8Decoder(allowMalformed: true).convert(bytes);
    Map meta = gsonDecode(string);
    return ModMetadata(meta['id'], meta['name'], meta['version']);
  }
}
