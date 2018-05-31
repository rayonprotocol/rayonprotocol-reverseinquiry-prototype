const parseTransactionResult = (eventResult, eventName: string) => {
  return eventResult.logs.find(item => item.event === eventName).args;
};

export default parseTransactionResult;
