import 'package:dio/dio.dart';

import '../Models/CurseForgeAddon.dart';
import '../Models/CurseForgeFile.dart';
import 'ApiUrls.dart';

class CurseForgeAPI {
  static Future<CurseForgeAddons> searchAddons(String version, {int? index, int? pageSize, String? searchFilter, CurseForgeSort? sort}) async {
    Response response = await Dio().get("${ApiUrls.curseForgeBaseUrl}/search", queryParameters: {
      "gameId": 432,
      "categoryId": "0",
      "gameVersion": version,
      "index": index ?? 0,
      "pageSize": pageSize ?? 50, // CurseForge 預設最大數量為 50 個
      "searchFilter": searchFilter ?? "",
      "sort": sort == null ? CurseForgeSort.featured.id : sort.id,
    });

    if (response.statusCode != 200) throw Exception("Failed to search addons");

    return CurseForgeAddons.format(response.data);
  }

  static Future<CurseForgeAddon> getAddonByID(int id) async {
    Response response = await Dio().get("${ApiUrls.curseForgeBaseUrl}/$id");
    return CurseForgeAddon.fromJson(response.data);
  }

  static Future<CurseForgeFile> getFileInfoByID(int curseForgeID, int fileID) async {
    Response response = await Dio().get("${ApiUrls.curseForgeBaseUrl}/$curseForgeID/file/$fileID");
    return CurseForgeFile.fromJson(curseForgeID, response.data);
  }
}

enum CurseForgeSort {
  featured,
  popularity,
  lastUpdate,
  name,
  author,
  downloads,
}

extension CurseForgeSortExtension on CurseForgeSort {
  int get id {
    switch (this) {
      case CurseForgeSort.featured:
        return 0;
      case CurseForgeSort.popularity:
        return 1;
      case CurseForgeSort.lastUpdate:
        return 2;
      case CurseForgeSort.name:
        return 3;
      case CurseForgeSort.author:
        return 4;
      case CurseForgeSort.downloads:
        return 5;
    }
  }
}
