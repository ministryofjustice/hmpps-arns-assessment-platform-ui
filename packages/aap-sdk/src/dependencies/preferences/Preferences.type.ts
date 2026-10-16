export interface Preferences {
  get<TPreferences extends Record<string, unknown>>(preferencesId: string): Promise<TPreferences | null>
  update<TPreferences extends Record<string, unknown>>(
    preferencesId: string,
    updater: (current: TPreferences | null) => TPreferences,
  ): Promise<void>
}
