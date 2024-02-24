// eslint-disable-next-line import/order
import { getServiceEnvConfig } from '~/.env-config'

export const IS_DEV = import.meta.env.MODE === 'development'
export const STATIC_BASE_URL = IS_DEV ? getServiceEnvConfig(import.meta.env).url.replace('/api/v1', '') : ''
