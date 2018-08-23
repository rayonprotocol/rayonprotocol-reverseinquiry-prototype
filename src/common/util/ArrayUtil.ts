class ArrayUtil {
  static isEmpty = (targetArray: Array<any>) => {
    return targetArray === undefined || targetArray.length < 1;
  };
}

export default ArrayUtil;
