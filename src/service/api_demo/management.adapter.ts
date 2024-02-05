export function adapterOfFetchUserList(data: ApiUserManagement.User[] | null): UserManagement.User[] {
  if (!data) return []

  return data.map(item => {
    const user: UserManagement.User = {
      ...item
    }
    return user
  })
}

export function adapterOfAddIndex(data: any) {
  if (!data) return []

  return data.map((item: any, index: number) => {
    const rule: RuleEngine.Rule = {
      index: index + 1,
      ...item
    }

    return rule
  })
}
