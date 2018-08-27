class ArrayUtil {
  static isEmpty = (targetArray: Array<any>): boolean => {
    return targetArray === undefined || targetArray.length < 1;
  };

  static makeLowerCase = (targetArray: Array<any>) => {
    return targetArray.map(element => element.toLowerCase());
  };

  static removeWhiteSpace = (targetArray: Array<any>) => {
    return targetArray.map(element => element.replace(/\s/g, ''));
  };
}

export default ArrayUtil;
