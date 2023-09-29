export enum StarknetErrorCodes {
  TransactionFailed = "StarknetErrorCode.TRANSACTION_FAILED",
}

export enum ContractFailureReasons {
  ERC721InvalidTokenID = "0x4552433732313a20696e76616c696420746f6b656e204944",
}

export function isError(error: string, failureReason: ContractFailureReasons) {
  return error.includes(failureReason);
}
