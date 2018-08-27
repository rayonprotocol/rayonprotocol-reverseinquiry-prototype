class StringUtil {
  static isEmpty(str: string) {
    return str === '' || str === undefined;
  }

  static ChangeToUrlFormat(str: string) {
    return str.toLowerCase().replace(/\s/g, '');
  }
}

export default StringUtil;
