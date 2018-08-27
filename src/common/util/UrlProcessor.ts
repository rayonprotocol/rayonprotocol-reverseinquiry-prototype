import qs from 'query-string';

class UrlProcessor {
  public static KEY_ID = 'id';

  static readNumberFromPath(search: string, key: string, radix: number = 10) {
    return parseInt(qs.parse(search)[key], radix);
  }
}

export default UrlProcessor;
