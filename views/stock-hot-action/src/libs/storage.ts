class LocalStorage {
  private namespace: string;
  constructor(namespace: string = "yt_") {
    this.namespace = namespace;
  }
  public saveStorage(key: string, value: string) {
    localStorage.setItem(`${this.namespace}${key}`, value);
  }
  public getStorage(key: string) {
    return localStorage.getItem(`${this.namespace}${key}`) || "";
  }
}

export default new LocalStorage();
