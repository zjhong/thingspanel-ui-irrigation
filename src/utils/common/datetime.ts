import moment from 'moment';

/**
 * 将时间戳格式化为 YYYY-MM-DD HH:mm:ss 格式的字符串（24小时制）
 *
 * @param {string} ts - 时间戳
 * @returns {string} - 格式化后的时间字符串
 */
export function formatDateTime(ts: string): string {
  return moment(ts).format('YYYY-MM-DD HH:mm:ss');
}
