class StringUtil {
  static isEmpty(str: string): boolean {
    return str === '' || str === undefined;
  }

  static ChangeToUrlFormat(str: string): string {
    return str.toLowerCase().replace(/\s/g, '');
  }
}

export default StringUtil;
