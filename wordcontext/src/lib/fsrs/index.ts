import { createEmptyCard, fsrs, Rating, State, generatorParameters, type FSRSParameters, type Card, type Grade } from 'ts-fsrs';
import { db, type SettingsEntry } from '../db';

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

// ts-fsrs 的 Card 类型
export type FSRSCard = Card;

const RATING_MAP: Record<ReviewRating, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

// 训练阈值：累计 50 次复习后触发训练
const TRAINING_THRESHOLD = 50;

// 当前 FSRS 实例（可被更新）
let f = fsrs();

/**
 * 获取当前 FSRS 实例
 */
export function getFSRS() {
  return f;
}

/**
 * 使用新参数更新 FSRS 实例
 */
export function updateFSRSInstance(params: FSRSParameters) {
  f = fsrs(params);
}

/**
 * 创建新的空白卡片
 */
export function newCard(): FSRSCard {
  return createEmptyCard(new Date());
}

/**
 * 用户评价后计算下次复习时间
 */
export function scheduleReview(card: FSRSCard, rating: ReviewRating): FSRSCard {
  const schedulingCards = f.repeat(card, new Date());
  const mappedRating = RATING_MAP[rating];
  const result = schedulingCards[mappedRating];
  return result.card;
}

/**
 * 获取评价后的完整调度信息（包含 log）
 */
export function scheduleReviewWithLog(card: FSRSCard, rating: ReviewRating) {
  const schedulingCards = f.repeat(card, new Date());
  const mappedRating = RATING_MAP[rating];
  return schedulingCards[mappedRating];
}

/**
 * 获取卡片状态的中文描述
 */
export function getStateLabel(state: number): string {
  switch (state) {
    case State.New: return '新词';
    case State.Learning: return '学习中';
    case State.Review: return '复习';
    case State.Relearning: return '重新学习';
    default: return '未知';
  }
}

/**
 * 计算下次复习时间的人类可读描述
 */
export function getDueLabel(card: FSRSCard): string {
  const now = new Date();
  const due = new Date(card.due);
  const diffMs = due.getTime() - now.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMs <= 0) return '现在';
  if (diffMin < 60) return `${diffMin} 分钟后`;
  if (diffHour < 24) return `${diffHour} 小时后`;
  if (diffDay < 30) return `${diffDay} 天后`;
  return `${Math.floor(diffDay / 30)} 月后`;
}

/**
 * 获取记忆强度百分比（基于 stability）
 */
export function getMemoryStrength(card: FSRSCard): number {
  const s = card.stability;
  return Math.min(100, Math.round((s / (s + 10)) * 100));
}

// ==================== 参数训练功能 ====================

/**
 * 从 settings 表加载已训练的 FSRS 参数
 * 如果存在已训练参数，则更新 FSRS 实例
 * @returns 是否成功加载了已训练参数
 */
export async function loadFSRSParameters(): Promise<boolean> {
  try {
    const entry = await db.settings.get('fsrs');
    if (entry?.fsrsParameters) {
      updateFSRSInstance(entry.fsrsParameters);
      return true;
    }
  } catch (err) {
    console.warn('[FSRS] 加载训练参数失败，使用默认参数:', err);
  }
  return false;
}

/**
 * 基于 studyLogs 训练 FSRS 参数
 *
 * 由于 ts-fsrs v5 的 generatorParameters() 不接受 ReviewLog 进行训练，
 * 这里实现简化版参数优化：
 * 1. 计算用户的实际记忆保持率（recall rate）
 * 2. 根据保持率调整 request_retention
 * 3. 根据首次评价分布调整初始稳定性参数 (w[0]-w[3])
 * 4. 根据评价难度分布调整难度参数 (w[4]-w[5])
 * 5. 根据复习间隔表现调整间隔参数 (w[8]-w[10])
 *
 * @returns 训练后的参数，如果数据不足则返回 null
 */
export async function trainParameters(): Promise<FSRSParameters | null> {
  try {
    const logs = await db.studyLogs.orderBy('id').toArray();

    if (logs.length < TRAINING_THRESHOLD) {
      return null;
    }

    // 获取当前默认参数作为基础
    const defaultParams = generatorParameters();
    const w = [...defaultParams.w]; // 复制一份可修改的 w 数组

    // ---- 1. 计算实际记忆保持率 ----
    // 在 Review 状态下，rating >= Good 视为成功回忆，rating = Again 视为遗忘
    const reviewLogs = logs.filter(log => log.state === State.Review);
    if (reviewLogs.length >= 10) {
      const successCount = reviewLogs.filter(log => log.rating >= Rating.Good).length;
      const actualRetention = successCount / reviewLogs.length;

      // 根据实际保持率微调 request_retention
      // 如果实际保持率高于目标，说明用户记忆能力较强，可以适当降低目标保持率以减少复习频率
      // 如果实际保持率低于目标，需要提高目标保持率以增加复习频率
      const currentRetention = defaultParams.request_retention;
      const retentionAdjustment = (actualRetention - currentRetention) * 0.3;
      defaultParams.request_retention = Math.max(0.7, Math.min(0.97, currentRetention + retentionAdjustment));
    }

    // ---- 2. 根据首次评价分布调整初始稳定性参数 (w[0]-w[3]) ----
    // 收集每个词的首次评价
    const firstRatings = new Map<string, { rating: number; state: number }>();
    for (const log of logs) {
      if (!firstRatings.has(log.wordId)) {
        firstRatings.set(log.wordId, { rating: log.rating, state: log.state });
      }
    }

    const firstReviews = Array.from(firstRatings.values());
    if (firstReviews.length >= 10) {
      // 统计各评分的比例
      const againRatio = firstReviews.filter(r => r.rating === Rating.Again).length / firstReviews.length;
      const hardRatio = firstReviews.filter(r => r.rating === Rating.Hard).length / firstReviews.length;
      const goodRatio = firstReviews.filter(r => r.rating === Rating.Good).length / firstReviews.length;
      const easyRatio = firstReviews.filter(r => r.rating === Rating.Easy).length / firstReviews.length;

      // 如果用户倾向于给高评分，说明学习能力强，可以增大初始稳定性
      // 如果用户倾向于给低评分，需要减小初始稳定性
      const highRatingBias = (goodRatio + easyRatio) - (againRatio + hardRatio);
      const stabilityAdjustment = 1 + highRatingBias * 0.15;

      // 调整 w[0]-w[3]（初始稳定性参数）
      w[0] = Math.max(0.01, w[0] * stabilityAdjustment);  // Again
      w[1] = Math.max(0.01, w[1] * stabilityAdjustment);  // Hard
      w[2] = Math.max(0.01, w[2] * stabilityAdjustment);  // Good
      w[3] = Math.max(0.01, w[3] * stabilityAdjustment);  // Easy
    }

    // ---- 3. 根据评价难度分布调整难度参数 (w[4], w[5]) ----
    if (firstReviews.length >= 10) {
      // w[4] 是初始难度，w[5] 控制评分对难度的影响
      // 如果用户普遍给 Again，说明材料较难，应提高初始难度
      const againRatio = firstReviews.filter(r => r.rating === Rating.Again).length / firstReviews.length;
      const easyRatio = firstReviews.filter(r => r.rating === Rating.Easy).length / firstReviews.length;

      // 难度调整：Again 多 -> 增大 w[4]，Easy 多 -> 减小 w[4]
      const difficultyAdjustment = (againRatio - easyRatio) * 0.2;
      w[4] = Math.max(1, Math.min(10, w[4] + difficultyAdjustment));
    }

    // ---- 4. 根据复习间隔表现调整间隔参数 (w[8]-w[10]) ----
    // 分析 Review 状态下成功回忆的间隔变化
    if (reviewLogs.length >= 20) {
      const successReviews = reviewLogs.filter(log => log.rating >= Rating.Good);
      const failReviews = reviewLogs.filter(log => log.rating === Rating.Again);

      if (successReviews.length >= 10 && failReviews.length >= 5) {
        // 成功回忆的平均间隔
        const avgSuccessInterval = successReviews.reduce((sum, log) => sum + log.scheduled_days, 0) / successReviews.length;
        // 遗忘的平均间隔
        const avgFailInterval = failReviews.reduce((sum, log) => sum + log.scheduled_days, 0) / failReviews.length;

        // 如果遗忘发生在较短间隔，说明稳定性衰减快，需要增大 w[8]（稳定性增长因子）
        // 如果遗忘发生在较长间隔，说明当前参数合理
        if (avgFailInterval > 0 && avgSuccessInterval > 0) {
          const failRatio = avgFailInterval / avgSuccessInterval;
          // failRatio 越小，说明遗忘发生得越早，需要更激进的稳定性增长
          const stabilityGrowthAdjustment = 1 + (0.5 - failRatio) * 0.1;
          w[8] = Math.max(0.01, w[8] * Math.max(0.5, Math.min(2.0, stabilityGrowthAdjustment)));
        }
      }
    }

    // ---- 5. 根据复习速度调整短期记忆参数 (w[17], w[18]) ----
    const learningLogs = logs.filter(log => log.state === State.Learning || log.state === State.Relearning);
    if (learningLogs.length >= 10) {
      const avgDuration = learningLogs.reduce((sum, log) => sum + log.review_duration, 0) / learningLogs.length;
      // 如果用户复习速度较快（< 3000ms），说明短期记忆较好，可以适当增大短期稳定性增长
      if (avgDuration > 0 && avgDuration < 10000) {
        const speedFactor = Math.max(0.5, Math.min(1.5, 3000 / avgDuration));
        w[17] = Math.max(0.01, w[17] * speedFactor);
      }
    }

    // 构建最终参数
    const trainedParams: FSRSParameters = {
      request_retention: defaultParams.request_retention,
      maximum_interval: defaultParams.maximum_interval,
      w,
      enable_fuzz: defaultParams.enable_fuzz,
      enable_short_term: defaultParams.enable_short_term,
      learning_steps: defaultParams.learning_steps,
      relearning_steps: defaultParams.relearning_steps,
    };

    // 持久化到 settings 表
    const now = new Date().toISOString();
    const entry: SettingsEntry = {
      id: 'fsrs',
      fsrsParameters: trainedParams,
      lastTrainedAt: now,
      reviewCountSinceTraining: 0,
    };
    await db.settings.put(entry);

    // 更新当前 FSRS 实例
    updateFSRSInstance(trainedParams);

    return trainedParams;
  } catch (err) {
    console.error('[FSRS] 参数训练失败:', err);
    return null;
  }
}

/**
 * 检查是否需要触发参数训练
 * 每次评价后调用，当自上次训练以来的复习次数达到阈值时自动训练
 */
export async function checkAndTrainIfNeeded(): Promise<void> {
  try {
    const entry = await db.settings.get('fsrs');
    const totalLogs = await db.studyLogs.count();

    if (!entry) {
      // 没有 settings 记录，检查总复习次数
      if (totalLogs >= TRAINING_THRESHOLD) {
        trainParameters().catch(() => {});
      }
      return;
    }

    // 更新自上次训练以来的复习次数
    const countSinceTraining = entry.reviewCountSinceTraining + 1;
    await db.settings.update('fsrs', { reviewCountSinceTraining: countSinceTraining });

    if (countSinceTraining >= TRAINING_THRESHOLD) {
      trainParameters().catch(() => {});
    }
  } catch (err) {
    console.warn('[FSRS] 检查训练条件失败:', err);
  }
}

export { Rating, State, TRAINING_THRESHOLD };
export type { FSRSParameters };
