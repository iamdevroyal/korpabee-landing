import client from './client.js'

export const financeApi = {
  // Wallet
  getWallet: () => client.get('/wallet'),
  getBanks: () => client.get('/wallet/banks'),
  resolveBankAccount: (data) => client.post('/bank/resolve', data), // { account_number, bank_code }
  resolveTag: (tag) => client.get('/wallet/transfer/resolve', { params: { tag } }),
  internalTransfer: (data) => client.post('/wallet/transfer/internal', data),
  topupInitiate: (amount) => client.post('/wallet/topup/initiate', { amount }),
  topupVerify: (reference) => client.post('/wallet/topup/verify', { reference }),
  withdraw: (data) => client.post('/wallet/withdraw', data),

  // Transactions
  getTransactions: (params = {}) => client.get('/wallet/transactions', { params }),
  getTransaction: (uuid) => client.get(`/wallet/transactions/${uuid}`),

  // Savings Groups (Gamified Save & Win)
  getSavingsGroups: (params = {}) => client.get('/savings-groups', { params }),
  createSavingsGroup: (data) => client.post('/savings-groups', data),
  getSavingsGroup: (uuid) => client.get(`/savings-groups/${uuid}`),
  joinSavingsGroup: (uuid) => client.post(`/savings-groups/${uuid}/join`),
  leaveSavingsGroup: (uuid) => client.delete(`/savings-groups/${uuid}/leave`),
  depositToGroup: (uuid, amount) => client.post(`/savings-groups/${uuid}/deposit`, { amount }),
  withdrawFromGroup: (uuid, amount) => client.post(`/savings-groups/${uuid}/withdraw`, { amount }),

  // Loans
  getLoans: () => client.get('/loans'),
  applyLoan: (amount) => client.post('/loans/apply', { amount }),
  repayLoan: (id) => client.post(`/loans/${id}/repay`),

  // Transaction PIN
  getPinStatus: () => client.get('/wallet/pin/status'),
  setPin: (pin, pin_confirmation) => client.post('/wallet/pin/set', { pin, pin_confirmation }),
  changePin: (current_pin, pin, pin_confirmation) => client.post('/wallet/pin/change', { current_pin, pin, pin_confirmation }),

  // Budget
  getBudget: (params = {}) => client.get('/budget', { params }),
  saveBudget: (data) => client.post('/budget', data),

  // Allawee
  getAllawee: () => client.get('/allawee'),
  saveAllawee: (data) => client.post('/allawee', data),
}
