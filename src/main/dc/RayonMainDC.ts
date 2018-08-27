class RayonMainDC {
  borrowerTabMenus = ['Register Data', 'Loan Request', 'Mailbox'];
  lenderTabMenus = ['Loan Request', 'Mailbox'];

  public getTabMenus(isBorrower: boolean) {
    return isBorrower ? this.borrowerTabMenus : this.lenderTabMenus;
  }
}

export default new RayonMainDC();
