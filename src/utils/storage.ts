class Storage {
  public set<T>(key: string, value: T) {
    if (!key || typeof value === "undefined") return
    localStorage.setItem(key, JSON.stringify(value))
  }

  public get<T>(key: string): T | null {
    const dataStr = localStorage.getItem(key)
    if (!dataStr) return null
    try {
      return JSON.parse(dataStr)
    } catch (err) {
      return dataStr
    }
  }

  public remove(key: string) {
    localStorage.removeItem(key)
  }
}

export const storage = new Storage()
